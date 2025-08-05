import { IMainView, IProductModel } from '../types';
import { CSS_CLASSES } from '../utils/constants';
import { ensureElement, setText } from '../utils/utils';
import { ProductCard } from '../components/ProductCard';

export class MainView implements IMainView {
	protected container: HTMLElement;
	protected gallery: HTMLElement;
	protected basketCounter: HTMLElement;
	protected cards: ProductCard[] = [];

	constructor() {
		this.container = document.querySelector('.page') as HTMLElement;
		this.gallery = ensureElement<HTMLElement>(
			this.container,
			`.${CSS_CLASSES.GALLERY}`
		);
		this.basketCounter = ensureElement<HTMLElement>(
			this.container,
			`.${CSS_CLASSES.HEADER_BASKET_COUNTER}`
		);
	}

	/**
	 * Рендер товаров
	 */
	renderProducts(products: IProductModel[]): void {
		// Очищаем галерею
		this.gallery.innerHTML = '';
		this.cards = [];

		// Создаем карточки товаров
		products.forEach((product) => {
			const card = new ProductCard();
			card.setProduct(product);
			card.setInBasket(product.inBasket);

			this.gallery.appendChild(card.render());
			this.cards.push(card);
		});
	}

	/**
	 * Обновить счетчик корзины
	 */
	updateBasketCount(count: number): void {
		setText(this.basketCounter, count.toString());
	}

	/**
	 * Показать загрузку
	 */
	showLoading(): void {
		this.gallery.innerHTML =
			'<p style="text-align: center; padding: 20px;">Загрузка товаров...</p>';
	}

	/**
	 * Скрыть загрузку
	 */
	hideLoading(): void {
		// Загрузка скрывается при рендере товаров
	}

	/**
	 * Показать ошибку
	 */
	showError(message: string): void {
		this.gallery.innerHTML = `<p style="text-align: center; padding: 20px; color: red;">${message}</p>`;
	}

	/**
	 * Рендер компонента
	 */
	render(): HTMLElement {
		return this.container;
	}

	/**
	 * Уничтожить компонент
	 */
	destroy(): void {
		this.cards.forEach((card) => card.destroy());
		this.cards = [];
	}
}
