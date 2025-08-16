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
import { IProductModel } from '../types';

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
		this.view = new MainView(events);
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
			console.error('Ошибка загрузки товаров:', error);
			this.view.showError(MESSAGES.PRODUCTS_LOAD_ERROR);
		}
	}

	/**
	 * Открыть модальное окно товара
	 */
	openProductModal(productId: string): void {
		const product = this.productModel.getProduct(productId);
		if (product) {
			const preview = new ProductPreview(this.events);
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
		const basket = new Basket(this.events);

		// Обновляем корзину перед открытием
		basket.updateBasket(this.basketModel.getItems());

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

			// Обновляем счетчик корзины
			this.view.updateBasketCount(this.basketModel.getCount());

			// Если открыто модальное окно корзины, обновляем его
			if (this.currentModal === 'basket') {
				const basket = new Basket(this.events);
				basket.updateBasket(this.basketModel.getItems());
				this.modal.setContent(basket.render());
			}
		}
	}

	/**
	 * Удалить товар из корзины
	 */
	removeFromBasket(productId: string): void {
		this.productModel.removeFromBasket(productId);
		this.basketModel.removeItem(productId);

		// Обновляем счетчик корзины
		this.view.updateBasketCount(this.basketModel.getCount());

		// Если открыто модальное окно корзины, обновляем его
		if (this.currentModal === 'basket') {
			const basket = new Basket(this.events);
			basket.updateBasket(this.basketModel.getItems());
			this.modal.setContent(basket.render());
		}
	}

	/**
	 * Начать оформление заказа
	 */
	startOrder(): void {
		const orderForm = new OrderForm(this.events);
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

			// Очищаем корзину и сбрасываем счётчик
			this.basketModel.clear();
			this.productModel.clearBasket();
			this.view.updateBasketCount(0);
			this.orderModel.reset();

			// Показываем успешное сообщение
			const success = new Success(this.events);
			success.setTotal(order.total);

			this.modal.setContent(success.render());
			this.modal.open();
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

	private handleProductAdd(data: { product: IProductModel }): void {
		if (data.product) {
			this.addToBasket(data.product.id);
		}
	}

	private handleProductRemove(data: { productId: string }): void {
		if (data.productId) {
			this.removeFromBasket(data.productId);
		}
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

	private handleOrderSubmit(data: { data: any }): void {
		if (data.data) {
			this.orderModel.setPayment(data.data.payment);
			this.orderModel.setAddress(data.data.address);
			this.orderModel.setEmail(data.data.email);
			this.orderModel.setPhone(data.data.phone);
			this.submitOrder();
		}
	}

	private handleOrderSuccess(): void {
		// Обрабатывается в submitOrder
	}

	private handleModalOpen(data: { type: string; data: any }): void {
		if (data.type === 'product') {
			this.openProductModal(data.data.productId);
		}
	}

	private handleModalClose(): void {
		this.modal.close();
		this.currentModal = null;
	}

	private handleErrorShow(data: { message: string }): void {
		this.view.showError(data.message);
	}
}
