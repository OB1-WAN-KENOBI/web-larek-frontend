import { IProductModel, IProduct, IProductModelManager } from '../types';
import { EventEmitter } from '../components/base/events';
import { EVENTS } from '../utils/constants';

export class ProductModel implements IProductModelManager {
	private products: IProductModel[] = [];
	private events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	/**
	 * Получить все товары
	 */
	getProducts(): IProductModel[] {
		return this.products;
	}

	/**
	 * Получить товар по ID
	 */
	getProduct(id: string): IProductModel | null {
		return this.products.find((product) => product.id === id) || null;
	}

	/**
	 * Установить товары из API
	 */
	setProducts(products: IProduct[]): void {
		this.products = products.map((product) => ({
			...product,
			inBasket: false,
		}));

		this.events.emit(EVENTS.PRODUCTS_LOADED, { products: this.products });
	}

	/**
	 * Добавить товар в корзину
	 */
	addToBasket(productId: string): void {
		const product = this.getProduct(productId);
		if (product && !product.inBasket) {
			product.inBasket = true;
			this.events.emit(EVENTS.PRODUCT_ADD, { product });
		}
	}

	/**
	 * Удалить товар из корзины
	 */
	removeFromBasket(productId: string): void {
		const product = this.getProduct(productId);
		if (product && product.inBasket) {
			product.inBasket = false;
			this.events.emit(EVENTS.PRODUCT_REMOVE, { productId });
		}
	}

	/**
	 * Проверить, находится ли товар в корзине
	 */
	isInBasket(productId: string): boolean {
		const product = this.getProduct(productId);
		return product ? product.inBasket : false;
	}

	/**
	 * Получить товары в корзине
	 */
	getBasketProducts(): IProductModel[] {
		return this.products.filter((product) => product.inBasket);
	}

	/**
	 * Очистить корзину
	 */
	clearBasket(): void {
		this.products.forEach((product) => {
			product.inBasket = false;
		});
	}
}
