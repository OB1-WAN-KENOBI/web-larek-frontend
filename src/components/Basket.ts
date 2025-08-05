import { IBasket, IProductModel } from '../types';
import { CSS_CLASSES, TEMPLATES } from '../utils/constants';
import {
	cloneTemplate,
	setText,
	addListener,
	removeListener,
	formatPrice,
} from '../utils/utils';

export class Basket implements IBasket {
	protected element: HTMLElement;
	protected list: HTMLElement;
	protected totalElement: HTMLElement;
	protected button: HTMLButtonElement | null = null;
	protected items: IProductModel[] = [];
	protected total: number = 0;

	constructor() {
		this.element = cloneTemplate(TEMPLATES.BASKET);
		this.list = this.element.querySelector(`.${CSS_CLASSES.BASKET_LIST}`)!;
		this.totalElement = this.element.querySelector(
			`.${CSS_CLASSES.BASKET_PRICE}`
		)!;
		this.button = this.element.querySelector(`.${CSS_CLASSES.BUTTON}`);

		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Клик по кнопке оформления заказа
		if (this.button) {
			addListener(this.button, 'click', this.handleOrderClick.bind(this));
		}

		// Обработка удаления товаров из корзины
		addListener(this.element, 'click', this.handleItemClick.bind(this));
	}

	/**
	 * Обработчик клика по кнопке оформления заказа
	 */
	protected handleOrderClick(event: Event): void {
		if (this.items.length > 0) {
			const customEvent = new CustomEvent('basket:order', {
				detail: { items: this.items, total: this.total },
				bubbles: true,
			});
			this.element.dispatchEvent(customEvent);
		}
	}

	/**
	 * Обработчик клика по элементам корзины
	 */
	protected handleItemClick(event: Event): void {
		const target = event.target as HTMLElement;

		if (target.classList.contains(CSS_CLASSES.BASKET_ITEM_DELETE)) {
			const item = target.closest(`.${CSS_CLASSES.BASKET_ITEM}`);
			if (item) {
				const index = item.getAttribute('data-index');
				if (index) {
					const productId = this.items[parseInt(index)]?.id;
					if (productId) {
						const customEvent = new CustomEvent('product:remove', {
							detail: { productId },
							bubbles: true,
						});
						this.element.dispatchEvent(customEvent);
					}
				}
			}
		}
	}

	/**
	 * Добавить товар в корзину
	 */
	addItem(product: IProductModel): void {
		this.items.push(product);
		this.updateTotal();
		this.renderBasket();
	}

	/**
	 * Удалить товар из корзины
	 */
	removeItem(productId: string): void {
		this.items = this.items.filter((item) => item.id !== productId);
		this.updateTotal();
		this.renderBasket();
	}

	/**
	 * Обновить общую стоимость
	 */
	updateTotal(): void {
		this.total = this.items.reduce((sum, item) => sum + item.price, 0);
		setText(this.totalElement, formatPrice(this.total));
	}

	/**
	 * Очистить корзину
	 */
	clear(): void {
		this.items = [];
		this.total = 0;
		this.renderBasket();
	}

	/**
	 * Рендер списка товаров
	 */
	protected renderBasket(): void {
		// Очищаем список
		this.list.innerHTML = '';

		if (this.items.length === 0) {
			// Показываем сообщение о пустой корзине
			const emptyMessage = document.createElement('p');
			emptyMessage.textContent = 'Корзина пуста';
			emptyMessage.style.textAlign = 'center';
			emptyMessage.style.padding = '20px';
			this.list.appendChild(emptyMessage);
		} else {
			// Добавляем товары
			this.items.forEach((item, index) => {
				const itemElement = this.createBasketItem(item, index);
				this.list.appendChild(itemElement);
			});
		}

		// Обновляем общую стоимость
		this.updateTotal();

		// Обновляем состояние кнопки
		if (this.button) {
			this.button.disabled = this.items.length === 0;
		}
	}

	/**
	 * Создать элемент товара в корзине
	 */
	protected createBasketItem(
		product: IProductModel,
		index: number
	): HTMLElement {
		const template = cloneTemplate(TEMPLATES.CARD_BASKET);
		const item = template.querySelector(
			`.${CSS_CLASSES.BASKET_ITEM}`
		) as HTMLElement;

		// Устанавливаем индекс
		item.setAttribute('data-index', index.toString());

		// Устанавливаем заголовок
		const title = item.querySelector(
			`.${CSS_CLASSES.CARD_TITLE}`
		) as HTMLElement;
		if (title) {
			setText(title, product.title);
		}

		// Устанавливаем цену
		const price = item.querySelector(
			`.${CSS_CLASSES.CARD_PRICE}`
		) as HTMLElement;
		if (price) {
			setText(price, formatPrice(product.price));
		}

		// Устанавливаем номер
		const indexElement = item.querySelector(
			`.${CSS_CLASSES.BASKET_ITEM_INDEX}`
		) as HTMLElement;
		if (indexElement) {
			setText(indexElement, (index + 1).toString());
		}

		return item;
	}

	/**
	 * Рендер компонента
	 */
	render(): HTMLElement {
		return this.element;
	}

	/**
	 * Уничтожить компонент
	 */
	destroy(): void {
		if (this.button) {
			removeListener(this.button, 'click', this.handleOrderClick.bind(this));
		}
		removeListener(this.element, 'click', this.handleItemClick.bind(this));
	}
}
