import { IProductCard, IProductModel } from '../types';
import { CSS_CLASSES, TEMPLATES, CDN_URL, EVENTS } from '../utils/constants';
import {
	cloneTemplate,
	setText,
	setImage,
	addListener,
	removeListener,
	formatPrice,
	formatCategory,
} from '../utils/utils';
import { EventEmitter } from '../components/base/events';

export class ProductCard implements IProductCard {
	protected element: HTMLElement;
	protected product: IProductModel | null = null;
	protected button: HTMLButtonElement | null = null;
	protected events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
		const template = cloneTemplate(TEMPLATES.CARD_CATALOG);
		// Клонируем шаблон и получаем первый элемент
		this.element = template.firstElementChild as HTMLElement;
		if (!this.element) {
			throw new Error('Failed to create ProductCard element');
		}
		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Обработчик клика по карточке
		this.element.addEventListener('click', this.handleCardClick.bind(this));

		// Обработчик клика по кнопке (используем CARD_BUTTON)
		this.button = this.element.querySelector(`.${CSS_CLASSES.CARD_BUTTON}`);
		if (this.button) {
			addListener(this.button, 'click', this.handleButtonClick.bind(this));
		}
	}

	/**
	 * Обработчик клика по карточке
	 */
	protected handleCardClick(event: Event): void {
		// Проверяем, что клик не по кнопке
		if (event.target === this.button) {
			return;
		}

		if (this.product) {
			// Используем EventEmitter для открытия модального окна
			this.events.emit(EVENTS.MODAL_OPEN, {
				type: 'product',
				data: { productId: this.product.id },
			});
		}
	}

	/**
	 * Обработчик клика по кнопке
	 */
	protected handleButtonClick(event: Event): void {
		event.stopPropagation();

		if (this.product) {
			if (this.product.inBasket) {
				// Удаляем из корзины
				this.events.emit(EVENTS.PRODUCT_REMOVE, { productId: this.product.id });
			} else {
				// Добавляем в корзину
				this.events.emit(EVENTS.PRODUCT_ADD, { product: this.product });
			}
		}
	}

	/**
	 * Установить товар
	 */
	setProduct(product: IProductModel): void {
		this.product = product;
		this.renderCard();
	}

	/**
	 * Установить статус в корзине
	 */
	setInBasket(inBasket: boolean): void {
		if (this.product) {
			this.product.inBasket = inBasket;
			this.renderCard();
		}
	}

	/**
	 * Обновить кнопку
	 */
	protected updateButton(): void {
		if (this.button && this.product) {
			if (this.product.inBasket) {
				this.button.textContent = 'Убрать';
				this.button.classList.add('button_alt');
			} else {
				this.button.textContent = 'В корзину';
				this.button.classList.remove('button_alt');
			}
		}
	}

	/**
	 * Рендер карточки
	 */
	protected renderCard(): void {
		if (!this.product) {
			return;
		}

		// Устанавливаем заголовок
		const title = this.element.querySelector(
			`.${CSS_CLASSES.CARD_TITLE}`
		) as HTMLElement;
		if (title) {
			setText(title, this.product.title);
		}

		// Устанавливаем описание (используем CARD_TEXT вместо CARD_DESCRIPTION)
		const description = this.element.querySelector(
			`.${CSS_CLASSES.CARD_TEXT}`
		) as HTMLElement;
		if (description) {
			setText(description, this.product.description);
		}

		// Устанавливаем категорию
		const category = this.element.querySelector(
			`.${CSS_CLASSES.CARD_CATEGORY}`
		) as HTMLElement;
		if (category) {
			setText(category, formatCategory(this.product.category));
		}

		// Устанавливаем изображение
		const image = this.element.querySelector(
			`.${CSS_CLASSES.CARD_IMAGE}`
		) as HTMLImageElement;
		if (image) {
			const imagePath = this.product.image.startsWith('http')
				? this.product.image
				: CDN_URL + this.product.image;
			setImage(image, imagePath);
		}

		// Устанавливаем цену
		const price = this.element.querySelector(
			`.${CSS_CLASSES.CARD_PRICE}`
		) as HTMLElement;
		if (price) {
			setText(price, formatPrice(this.product.price));
		}

		// Устанавливаем текст кнопки
		if (this.button) {
			setText(this.button, this.product.inBasket ? 'Убрать' : 'Купить');
		}
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
			removeListener(this.button, 'click', this.handleButtonClick.bind(this));
		}
		removeListener(this.element, 'click', this.handleCardClick.bind(this));
	}
}
