import { IBasketModel, IProductModel, IBasketModelManager } from '../types';
import { EventEmitter } from '../components/base/events';
import { EVENTS } from '../utils/constants';

export class BasketModel implements IBasketModelManager {
	private basket: IBasketModel = {
		items: [],
		total: 0,
		count: 0,
	};
	private events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	/**
	 * Получить товары в корзине
	 */
	getItems(): IProductModel[] {
		return this.basket.items;
	}

	/**
	 * Получить общую стоимость
	 */
	getTotal(): number {
		return this.basket.total;
	}

	/**
	 * Получить количество товаров
	 */
	getCount(): number {
		return this.basket.count;
	}

	/**
	 * Добавить товар в корзину
	 */
	addItem(product: IProductModel): void {
		if (!this.basket.items.find((item) => item.id === product.id)) {
			this.basket.items.push(product);
			this.updateTotals();
			this.events.emit(EVENTS.BASKET_UPDATE, { basket: this.basket });
		}
	}

	/**
	 * Удалить товар из корзины
	 */
	removeItem(productId: string): void {
		this.basket.items = this.basket.items.filter(
			(item) => item.id !== productId
		);
		this.updateTotals();
		this.events.emit(EVENTS.BASKET_UPDATE, { basket: this.basket });
	}

	/**
	 * Очистить корзину
	 */
	clear(): void {
		this.basket.items = [];
		this.updateTotals();
		this.events.emit(EVENTS.BASKET_CLEAR, { basket: this.basket });
	}

	/**
	 * Проверить, пуста ли корзина
	 */
	isEmpty(): boolean {
		return this.basket.items.length === 0;
	}

	/**
	 * Обновить общие показатели корзины
	 */
	private updateTotals(): void {
		this.basket.total = this.basket.items.reduce(
			(sum, item) => sum + item.price,
			0
		);
		this.basket.count = this.basket.items.length;
	}

	/**
	 * Получить данные корзины
	 */
	getBasketData(): IBasketModel {
		return { ...this.basket };
	}

	/**
	 * Синхронизировать корзину с моделью товаров
	 */
	syncWithProducts(products: IProductModel[]): void {
		this.basket.items = products.filter((product) => product.inBasket);
		this.updateTotals();
		this.events.emit(EVENTS.BASKET_UPDATE, { basket: this.basket });
	}
}
