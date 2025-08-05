import { IMainPresenter } from '../types';
import { EventEmitter } from '../components/base/events';
import { ProductModel } from '../models/ProductModel';
import { BasketModel } from '../models/BasketModel';
import { OrderModel } from '../models/OrderModel';
import { ProductApi } from '../api/ProductApi';
import { OrderApi } from '../api/OrderApi';
import { MainView } from '../views/MainView';
import { Modal } from '../components/Modal';
import { ProductPreview } from '../components/ProductPreview';
import { Basket } from '../components/Basket';
import { OrderForm } from '../components/OrderForm';
import { Success } from '../components/Success';
import { EVENTS, MODAL_TYPES, MESSAGES } from '../utils/constants';

export class MainPresenter implements IMainPresenter {
	private events: EventEmitter;
	private productModel: ProductModel;
	private basketModel: BasketModel;
	private orderModel: OrderModel;
	private productApi: ProductApi;
	private orderApi: OrderApi;
	private view: MainView;
	private modal: Modal;
	private currentModal: 'product' | 'basket' | 'order' | 'success' | null =
		null;

	constructor(
		events: EventEmitter,
		productModel: ProductModel,
		basketModel: BasketModel,
		orderModel: OrderModel,
		productApi: ProductApi,
		orderApi: OrderApi
	) {
		this.events = events;
		this.productModel = productModel;
		this.basketModel = basketModel;
		this.orderModel = orderModel;
		this.productApi = productApi;
		this.orderApi = orderApi;
		this.view = new MainView();
		this.modal = new Modal(
			document.getElementById('modal-container') as HTMLElement
		);

		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	private bindEvents(): void {
		// События товаров
		this.events.on(
			EVENTS.PRODUCTS_LOADED,
			this.handleProductsLoaded.bind(this)
		);
		this.events.on(EVENTS.PRODUCT_ADD, this.handleProductAdd.bind(this));
		this.events.on(EVENTS.PRODUCT_REMOVE, this.handleProductRemove.bind(this));

		// События корзины
		this.events.on(EVENTS.BASKET_UPDATE, this.handleBasketUpdate.bind(this));
		this.events.on(EVENTS.BASKET_CLEAR, this.handleBasketClear.bind(this));

		// События заказа
		this.events.on(EVENTS.ORDER_START, this.handleOrderStart.bind(this));
		this.events.on(EVENTS.ORDER_SUBMIT, this.handleOrderSubmit.bind(this));
		this.events.on(EVENTS.ORDER_SUCCESS, this.handleOrderSuccess.bind(this));

		// События модальных окон
		this.events.on(EVENTS.MODAL_OPEN, this.handleModalOpen.bind(this));
		this.events.on(EVENTS.MODAL_CLOSE, this.handleModalClose.bind(this));

		// События ошибок
		this.events.on(EVENTS.ERROR_SHOW, this.handleErrorShow.bind(this));

		// DOM события
		document.addEventListener(
			'product:click',
			this.handleProductClick.bind(this)
		);
		document.addEventListener(
			'product:add',
			this.handleProductAddEvent.bind(this)
		);
		document.addEventListener(
			'product:remove',
			this.handleProductRemoveEvent.bind(this)
		);
		document.addEventListener(
			'basket:order',
			this.handleBasketOrder.bind(this)
		);
		document.addEventListener(
			'order:submit',
			this.handleOrderSubmitEvent.bind(this)
		);
		document.addEventListener(
			'success:close',
			this.handleSuccessClose.bind(this)
		);
	}

	/**
	 * Инициализация
	 */
	init(): void {
		this.loadProducts();
	}

	/**
	 * Загрузить товары
	 */
	async loadProducts(): Promise<void> {
		try {
			this.view.showLoading();
			const response = await this.productApi.getProducts();
			this.productModel.setProducts(response.items);
		} catch (error) {
			this.view.showError(MESSAGES.PRODUCTS_LOAD_ERROR);
			console.error('Ошибка загрузки товаров:', error);
		}
	}

	/**
	 * Открыть модальное окно товара
	 */
	openProductModal(productId: string): void {
		const product = this.productModel.getProduct(productId);
		if (product) {
			const preview = new ProductPreview();
			preview.setProduct(product);
			preview.setInBasket(product.inBasket);

			this.modal.setContent(preview.render());
			this.modal.open();
			this.currentModal = 'product';
		}
	}

	/**
	 * Открыть модальное окно корзины
	 */
	openBasketModal(): void {
		const basket = new Basket();
		const items = this.basketModel.getItems();

		items.forEach((item) => basket.addItem(item));

		this.modal.setContent(basket.render());
		this.modal.open();
		this.currentModal = 'basket';
	}

	/**
	 * Добавить товар в корзину
	 */
	addToBasket(productId: string): void {
		this.productModel.addToBasket(productId);
		const product = this.productModel.getProduct(productId);
		if (product) {
			this.basketModel.addItem(product);
		}
	}

	/**
	 * Удалить товар из корзины
	 */
	removeFromBasket(productId: string): void {
		this.productModel.removeFromBasket(productId);
		this.basketModel.removeItem(productId);
	}

	/**
	 * Начать оформление заказа
	 */
	startOrder(): void {
		const orderForm = new OrderForm();
		this.modal.setContent(orderForm.render());
		this.modal.open();
		this.currentModal = 'order';
	}

	/**
	 * Отправить заказ
	 */
	async submitOrder(): Promise<void> {
		try {
			const orderData = this.orderModel.getData();
			const basketItems = this.basketModel.getItems();

			const order = {
				payment: orderData.payment!,
				address: orderData.address,
				email: orderData.email,
				phone: orderData.phone,
				total: this.basketModel.getTotal(),
				items: basketItems.map((item) => item.id),
			};

			const response = await this.orderApi.createOrder(order);

			// Очищаем корзину
			this.basketModel.clear();
			this.productModel.clearBasket();

			// Показываем успешное сообщение
			const success = new Success();
			success.setTotal(order.total);

			this.modal.setContent(success.render());
			this.currentModal = 'success';
		} catch (error) {
			this.events.emit(EVENTS.ERROR_SHOW, {
				message: MESSAGES.ORDER_SUBMIT_ERROR,
			});
			console.error('Ошибка отправки заказа:', error);
		}
	}

	// Обработчики событий

	private handleProductsLoaded(data: { products: any[] }): void {
		this.view.renderProducts(data.products);
		this.basketModel.syncWithProducts(data.products);
	}

	private handleProductAdd(data: { product: any }): void {
		this.basketModel.addItem(data.product);
	}

	private handleProductRemove(data: { productId: string }): void {
		this.basketModel.removeItem(data.productId);
	}

	private handleBasketUpdate(data: { basket: any }): void {
		this.view.updateBasketCount(data.basket.count);
	}

	private handleBasketClear(data: { basket: any }): void {
		this.view.updateBasketCount(0);
	}

	private handleOrderStart(): void {
		this.startOrder();
	}

	private handleOrderSubmit(): void {
		this.submitOrder();
	}

	private handleOrderSuccess(): void {
		// Обрабатывается в submitOrder
	}

	private handleModalOpen(data: { type: string; data?: any }): void {
		switch (data.type) {
			case MODAL_TYPES.PRODUCT:
				if (data.data?.productId) {
					this.openProductModal(data.data.productId);
				}
				break;
			case MODAL_TYPES.BASKET:
				this.openBasketModal();
				break;
			case MODAL_TYPES.ORDER:
				this.startOrder();
				break;
		}
	}

	private handleModalClose(): void {
		this.modal.close();
		this.currentModal = null;
	}

	private handleErrorShow(data: { message: string }): void {
		this.view.showError(data.message);
	}

	// DOM обработчики событий

	private handleProductClick(event: CustomEvent): void {
		this.openProductModal(event.detail.product.id);
	}

	private handleProductAddEvent(event: CustomEvent): void {
		this.addToBasket(event.detail.product.id);
	}

	private handleProductRemoveEvent(event: CustomEvent): void {
		this.removeFromBasket(event.detail.productId);
	}

	private handleBasketOrder(event: CustomEvent): void {
		this.startOrder();
	}

	private handleOrderSubmitEvent(event: CustomEvent): void {
		this.orderModel.setPayment(event.detail.data.payment);
		this.orderModel.setAddress(event.detail.data.address);
		this.orderModel.setEmail(event.detail.data.email);
		this.orderModel.setPhone(event.detail.data.phone);
		this.submitOrder();
	}

	private handleSuccessClose(): void {
		this.modal.close();
		this.currentModal = null;
	}
}
