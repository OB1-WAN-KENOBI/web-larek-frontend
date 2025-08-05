import { IProductCard, IProductModel } from '../types';
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

export class ProductCard implements IProductCard {
	protected element: HTMLElement;
	protected product: IProductModel | null = null;
	protected button: HTMLButtonElement | null = null;

	constructor() {
		this.element = cloneTemplate(TEMPLATES.CARD_CATALOG);
		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Клик по карточке для открытия деталей
		addListener(this.element, 'click', this.handleCardClick.bind(this));

		// Клик по кнопке для добавления в корзину
		this.button = this.element.querySelector(`.${CSS_CLASSES.BUTTON}`);
		if (this.button) {
			addListener(this.button, 'click', this.handleButtonClick.bind(this));
		}
	}

	/**
	 * Обработчик клика по карточке
	 */
	protected handleCardClick(event: Event): void {
		if (this.product) {
			// Эмитим событие для открытия модального окна с деталями
			const customEvent = new CustomEvent('product:click', {
				detail: { product: this.product },
				bubbles: true,
			});
			this.element.dispatchEvent(customEvent);
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
		this.renderCard();
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
				this.button.textContent = 'В корзину';
				this.button.classList.remove('button_alt');
			}
		}
	}

	/**
	 * Рендер карточки
	 */
	protected renderCard(): void {
		if (!this.product) return;

		// Устанавливаем заголовок
		const title = this.element.querySelector(
			`.${CSS_CLASSES.CARD_TITLE}`
		) as HTMLElement;
		if (title) {
			setText(title, this.product.title);
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
		removeListener(this.element, 'click', this.handleCardClick.bind(this));
	}
}
