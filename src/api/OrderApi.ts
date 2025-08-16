import { Api } from '../components/base/api';
import { IOrderApi, IOrder } from '../types';

export class OrderApi implements IOrderApi {
	private api: Api;

	constructor(api: Api) {
		this.api = api;
	}

	/**
	 * Создать заказ
	 */
	async createOrder(order: IOrder): Promise<{ id: string }> {
		// API weblarek ожидает endpoint в единственном числе
		return this.api.post('/order', order) as Promise<{ id: string }>;
	}
}
