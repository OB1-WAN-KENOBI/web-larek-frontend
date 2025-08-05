import { IProduct, IProductModel } from '../types';
import { CSS_CLASSES, TEMPLATES, CDN_URL } from '../utils/constants';
import {
	cloneTemplate,
	setText,
	setImage,
	addListener,
	removeListener,
	formatPrice,
	formatCategory,
} from '../utils/utils';

export class ProductPreview {
	protected element: HTMLElement;
	protected product: IProductModel | null = null;
	protected button: HTMLButtonElement | null = null;

	constructor() {
		this.element = cloneTemplate(TEMPLATES.CARD_PREVIEW);
		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Клик по кнопке для добавления/удаления из корзины
		this.button = this.element.querySelector(`.${CSS_CLASSES.CARD_BUTTON}`);
		if (this.button) {
			addListener(this.button, 'click', this.handleButtonClick.bind(this));
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
				const customEvent = new CustomEvent('product:remove', {
					detail: { productId: this.product.id },
					bubbles: true,
				});
				this.element.dispatchEvent(customEvent);
			} else {
				// Добавляем в корзину
				const customEvent = new CustomEvent('product:add', {
					detail: { product: this.product },
					bubbles: true,
				});
				this.element.dispatchEvent(customEvent);
			}
		}
	}

	/**
	 * Установить товар
	 */
	setProduct(product: IProductModel): void {
		this.product = product;
		this.renderPreview();
	}

	/**
	 * Установить состояние корзины
	 */
	setInBasket(inBasket: boolean): void {
		if (this.product) {
			this.product.inBasket = inBasket;
			this.updateButton();
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
				this.button.textContent = 'Купить';
				this.button.classList.remove('button_alt');
			}
		}
	}

	/**
	 * Рендер компонента
	 */
	protected renderPreview(): void {
		if (!this.product) return;

		// Устанавливаем заголовок
		const title = this.element.querySelector(
			`.${CSS_CLASSES.CARD_TITLE}`
		) as HTMLElement;
		if (title) {
			setText(title, this.product.title);
		}

		// Устанавливаем описание
		const text = this.element.querySelector(
			`.${CSS_CLASSES.CARD_TEXT}`
		) as HTMLElement;
		if (text) {
			setText(text, this.product.description);
		}

		// Устанавливаем изображение
		const image = this.element.querySelector(
			`.${CSS_CLASSES.CARD_IMAGE}`
		) as HTMLImageElement;
		if (image) {
			const imageUrl = this.product.image.startsWith('http')
				? this.product.image
				: `${CDN_URL}${this.product.image}`;
			setImage(image, imageUrl, this.product.title);
		}

		// Устанавливаем цену
		const price = this.element.querySelector(
			`.${CSS_CLASSES.CARD_PRICE}`
		) as HTMLElement;
		if (price) {
			setText(price, formatPrice(this.product.price));
		}

		// Устанавливаем категорию
		const category = this.element.querySelector(
			`.${CSS_CLASSES.CARD_CATEGORY}`
		) as HTMLElement;
		if (category) {
			setText(category, formatCategory(this.product.category));

			// Устанавливаем класс категории
			category.className = `${CSS_CLASSES.CARD_CATEGORY} card__category_${this.product.category}`;
		}

		// Обновляем кнопку
		this.updateButton();
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
	}
}
