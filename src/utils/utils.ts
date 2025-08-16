import { VALIDATION, MESSAGES } from './constants';
import type {
	EmailValidator,
	PhoneValidator,
	AddressValidator,
	PriceFormatter,
	PhoneFormatter,
} from '../types';

// ============================================================================
// ВАЛИДАЦИЯ
// ============================================================================

/**
 * Валидация email
 */
export const validateEmail: EmailValidator = (email: string): boolean => {
	return VALIDATION.EMAIL_REGEX.test(email.trim());
};

/**
 * Валидация телефона
 */
export const validatePhone: PhoneValidator = (phone: string): boolean => {
	return VALIDATION.PHONE_REGEX.test(phone.trim());
};

/**
 * Валидация адреса
 */
export const validateAddress: AddressValidator = (address: string): boolean => {
	return address.trim().length >= VALIDATION.MIN_ADDRESS_LENGTH;
};

/**
 * Получение сообщения об ошибке валидации
 */
export const getValidationMessage = (field: string, value: string): string => {
	switch (field) {
		case 'email':
			if (!value.trim()) return MESSAGES.EMAIL_REQUIRED;
			if (!validateEmail(value)) return MESSAGES.EMAIL_INVALID;
			break;
		case 'phone':
			if (!value.trim()) return MESSAGES.PHONE_REQUIRED;
			if (!validatePhone(value)) return MESSAGES.PHONE_INVALID;
			break;
		case 'address':
			if (!value.trim()) return MESSAGES.ADDRESS_REQUIRED;
			if (!validateAddress(value)) return MESSAGES.ADDRESS_TOO_SHORT;
			break;
		case 'payment':
			if (!value) return MESSAGES.PAYMENT_REQUIRED;
			break;
	}
	return '';
};

// ============================================================================
// ФОРМАТИРОВАНИЕ
// ============================================================================

/**
 * Форматирование цены
 */
export const formatPrice: PriceFormatter = (price: number | null): string => {
	if (price === null || price === undefined) {
		return 'Цена не указана';
	}
	return `${price.toLocaleString()} синапсов`;
};

/**
 * Форматирование телефона
 */
export const formatPhone: PhoneFormatter = (phone: string): string => {
	// Удаляем все нецифровые символы
	const digits = phone.replace(/\D/g, '');

	// Если номер начинается с 8, заменяем на +7
	let formatted = digits;
	if (digits.startsWith('8')) {
		formatted = '7' + digits.slice(1);
	}

	// Форматируем в виде +7 (XXX) XXX-XX-XX
	if (formatted.length === 11 && formatted.startsWith('7')) {
		return `+7 (${formatted.slice(1, 4)}) ${formatted.slice(
			4,
			7
		)}-${formatted.slice(7, 9)}-${formatted.slice(9)}`;
	}

	return phone;
};

/**
 * Форматирование категории товара
 */
export const formatCategory = (category: string): string => {
	const categoryMap: Record<string, string> = {
		soft: 'софт-скил',
		hard: 'хард-скил',
		other: 'другое',
	};
	return categoryMap[category] || category;
};

// ============================================================================
// РАБОТА С DOM
// ============================================================================

/**
 * Создание элемента с классом
 */
export const createElement = <K extends keyof HTMLElementTagNameMap>(
	tag: K,
	className?: string
): HTMLElementTagNameMap[K] => {
	const element = document.createElement(tag);
	if (className) {
		element.className = className;
	}
	return element;
};

/**
 * Получение элемента по селектору
 */
export const ensureElement = <T extends HTMLElement>(
	parentElement: HTMLElement,
	selector: string
): T => {
	const element = parentElement.querySelector<T>(selector);
	if (!element) {
		throw new Error(`Элемент с селектором "${selector}" не найден`);
	}
	return element;
};

/**
 * Клонирование шаблона
 */
export const cloneTemplate = (templateId: string): HTMLElement => {
	const template = document.getElementById(templateId) as HTMLTemplateElement;
	if (!template) {
		throw new Error(`Шаблон с id "${templateId}" не найден`);
	}
	return template.content.cloneNode(true) as HTMLElement;
};

/**
 * Установка текстового содержимого
 */
export const setText = (element: HTMLElement, text: string): void => {
	element.textContent = text;
};

/**
 * Установка атрибута src для изображения
 */
export const setImage = (
	element: HTMLImageElement,
	src: string,
	alt?: string
): void => {
	element.src = src;
	if (alt) {
		element.alt = alt;
	}
};

/**
 * Добавление/удаление класса
 */
export const toggleClass = (
	element: HTMLElement,
	className: string,
	force?: boolean
): void => {
	element.classList.toggle(className, force);
};

/**
 * Проверка наличия класса
 */
export const hasClass = (element: HTMLElement, className: string): boolean => {
	return element.classList.contains(className);
};

// ============================================================================
// РАБОТА С СОБЫТИЯМИ
// ============================================================================

/**
 * Добавление обработчика события
 */
export const addListener = (
	element: HTMLElement,
	event: string,
	handler: EventListener,
	options?: AddEventListenerOptions
): void => {
	element.addEventListener(event, handler, options);
};

/**
 * Удаление обработчика события
 */
export const removeListener = (
	element: HTMLElement,
	event: string,
	handler: EventListener,
	options?: EventListenerOptions
): void => {
	element.removeEventListener(event, handler, options);
};

/**
 * Предотвращение всплытия события
 */
export const preventDefault = (event: Event): void => {
	event.preventDefault();
};

/**
 * Остановка всплытия события
 */
export const stopPropagation = (event: Event): void => {
	event.stopPropagation();
};

// ============================================================================
// РАБОТА С ЛОКАЛЬНЫМ ХРАНИЛИЩЕМ
// ============================================================================

/**
 * Сохранение данных в localStorage
 */
export const saveToStorage = <T>(key: string, data: T): void => {
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Ошибка сохранения в localStorage:', error);
	}
};

/**
 * Загрузка данных из localStorage
 */
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
	try {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : defaultValue;
	} catch (error) {
		console.error('Ошибка загрузки из localStorage:', error);
		return defaultValue;
	}
};

/**
 * Удаление данных из localStorage
 */
export const removeFromStorage = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error('Ошибка удаления из localStorage:', error);
	}
};

// ============================================================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С МАССИВАМИ
// ============================================================================

/**
 * Группировка массива по ключу
 */
export const groupBy = <T, K extends keyof any>(
	array: T[],
	key: (item: T) => K
): Record<K, T[]> => {
	return array.reduce((groups, item) => {
		const group = key(item);
		groups[group] = groups[group] || [];
		groups[group].push(item);
		return groups;
	}, {} as Record<K, T[]>);
};

/**
 * Удаление дубликатов из массива
 */
export const unique = <T>(array: T[]): T[] => {
	return [...new Set(array)];
};

/**
 * Случайный элемент из массива
 */
export const randomItem = <T>(array: T[]): T | undefined => {
	if (array.length === 0) return undefined;
	return array[Math.floor(Math.random() * array.length)];
};

// ============================================================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ОБЪЕКТАМИ
// ============================================================================

/**
 * Глубокое клонирование объекта
 */
export const deepClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T;
	}

	if (obj instanceof Array) {
		return obj.map((item) => deepClone(item)) as unknown as T;
	}

	if (typeof obj === 'object') {
		const cloned = {} as T;
		for (const key in obj as Record<string, unknown>) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				(cloned as Record<string, unknown>)[key] = deepClone(
					(obj as Record<string, unknown>)[key]
				) as unknown as T[keyof T];
			}
		}
		return cloned;
	}

	return obj;
};

/**
 * Проверка на пустой объект
 */
export const isEmpty = (obj: any): boolean => {
	if (obj == null) return true;
	if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
	return Object.keys(obj).length === 0;
};

// ============================================================================
// УТИЛИТЫ ДЛЯ РАБОТЫ СО СТРОКАМИ
// ============================================================================

/**
 * Капитализация первой буквы
 */
export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Обрезка строки до указанной длины
 */
export const truncate = (
	str: string,
	length: number,
	suffix = '...'
): string => {
	if (str.length <= length) return str;
	return str.slice(0, length) + suffix;
};

/**
 * Замена плейсхолдеров в строке
 */
export const replacePlaceholders = (
	template: string,
	data: Record<string, any>
): string => {
	return template.replace(/\{(\w+)\}/g, (match, key) => {
		return data[key] !== undefined ? String(data[key]) : match;
	});
};

// ============================================================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ЧИСЛАМИ
// ============================================================================

/**
 * Ограничение числа в диапазоне
 */
export const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

/**
 * Проверка на четное число
 */
export const isEven = (num: number): boolean => {
	return num % 2 === 0;
};

/**
 * Округление до указанного количества знаков
 */
export const roundTo = (num: number, decimals: number): number => {
	return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// ============================================================================
// УТИЛИТЫ ДЛЯ РАБОТЫ С ДАТАМИ
// ============================================================================

/**
 * Форматирование даты
 */
export const formatDate = (date: Date, format = 'DD.MM.YYYY'): string => {
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();

	return format
		.replace('DD', day)
		.replace('MM', month)
		.replace('YYYY', year.toString());
};

/**
 * Проверка на сегодняшнюю дату
 */
export const isToday = (date: Date): boolean => {
	const today = new Date();
	return date.toDateString() === today.toDateString();
};

// ============================================================================
// УТИЛИТЫ ДЛЯ ОТЛАДКИ
// ============================================================================

/**
 * Логирование с префиксом
 */
export const log = (message: string, data?: any): void => {
	console.log(`[WEB-LAREK] ${message}`, data);
};

/**
 * Логирование ошибок
 */
export const logError = (message: string, error?: any): void => {
	console.error(`[WEB-LAREK] ERROR: ${message}`, error);
};

/**
 * Проверка на режим разработки
 */
export const isDevelopment = (): boolean => {
	return process.env.NODE_ENV === 'development';
};
