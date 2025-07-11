import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';

// Инициализация базовых компонентов
const events = new EventEmitter();
const api = new Api(API_URL);

// Базовый класс приложения
class App {
	private events: EventEmitter;
	private api: Api;

	constructor(events: EventEmitter, api: Api) {
		this.events = events;
		this.api = api;
		this.init();
	}

	private init(): void {
		console.log('WEB-ларёк: Приложение инициализировано');
		console.log('Архитектура: MVP с EventEmitter');
		console.log('API URL:', API_URL);

		// Здесь будет инициализация компонентов в следующем спринте
		this.setupEventListeners();
	}

	private setupEventListeners(): void {
		// Слушаем все события для отладки
		this.events.onAll((event) => {
			console.log('Событие:', event);
		});
	}
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
	new App(events, api);
});

// Экспорт для использования в других модулях
export { events, api };
