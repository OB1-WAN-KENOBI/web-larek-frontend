import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

// Модели
import { ProductModel } from './models/ProductModel';
import { BasketModel } from './models/BasketModel';
import { OrderModel } from './models/OrderModel';

// API
import { ProductApi } from './api/ProductApi';
import { OrderApi } from './api/OrderApi';

// Презентеры
import { MainPresenter } from './presenters/MainPresenter';

// Инициализация базовых компонентов
const events = new EventEmitter();
const api = new Api(API_URL);

// Инициализация API
const productApi = new ProductApi(api);
const orderApi = new OrderApi(api);

// Инициализация моделей
const productModel = new ProductModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Инициализация презентеров
const mainPresenter = new MainPresenter(
	events,
	productModel,
	basketModel,
	orderModel,
	productApi,
	orderApi
);

// Базовый класс приложения
class App {
	private events: EventEmitter;
	private api: Api;
	private presenter: MainPresenter;

	constructor(events: EventEmitter, api: Api, presenter: MainPresenter) {
		this.events = events;
		this.api = api;
		this.presenter = presenter;
		this.init();
	}

	private init(): void {
		console.log('WEB-ларёк: Приложение инициализировано');
		console.log('Архитектура: MVP с EventEmitter');
		console.log('API URL:', API_URL);

		// Инициализация презентера
		this.presenter.init();

		// Настройка обработчиков событий
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		// Обработчик клика по корзине в шапке
		const basketButton = document.querySelector('.header__basket');
		if (basketButton) {
			basketButton.addEventListener('click', () => {
				this.presenter.openBasketModal();
			});
		}

		// Слушаем все события для отладки
		this.events.onAll((event) => {
			console.log('Событие:', event);
		});
	}
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
	new App(events, api, mainPresenter);
});

// Экспорт для использования в других модулях
export { events, api, mainPresenter };
