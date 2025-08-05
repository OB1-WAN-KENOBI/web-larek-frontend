import { Api } from '../components/base/api';
import { IProductApi, IProductsResponse, IProduct } from '../types';

export class ProductApi implements IProductApi {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	/**
	 * Получить список товаров
	 */
	async getProducts(): Promise<IProductsResponse> {
		return this.api.get('/product') as Promise<IProductsResponse>;
	}

	/**
	 * Получить товар по ID
	 */
	async getProduct(id: string): Promise<IProduct> {
		return this.api.get(`/product/${id}`) as Promise<IProduct>;
	}
}
