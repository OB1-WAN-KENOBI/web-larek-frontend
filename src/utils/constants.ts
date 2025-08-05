// ============================================================================
// API КОНСТАНТЫ
// ============================================================================

// Реальный API сервер
export const API_URL = 'https://larek-api.nomoreparties.co/api/weblarek';
export const CDN_URL = 'https://larek-api.nomoreparties.co/content/weblarek';

// ============================================================================
// КАТЕГОРИИ ТОВАРОВ
// ============================================================================

export const PRODUCT_CATEGORIES = {
	SOFT: 'soft',
	HARD: 'hard',
	OTHER: 'other',
} as const;

export const CATEGORY_LABELS = {
	[PRODUCT_CATEGORIES.SOFT]: 'софт-скил',
	[PRODUCT_CATEGORIES.HARD]: 'хард-скил',
	[PRODUCT_CATEGORIES.OTHER]: 'другое',
} as const;

// ============================================================================
// СПОСОБЫ ОПЛАТЫ
// ============================================================================

export const PAYMENT_METHODS = {
	ONLINE: 'online',
	CARD: 'card',
} as const;

export const PAYMENT_LABELS = {
	[PAYMENT_METHODS.ONLINE]: 'Онлайн',
	[PAYMENT_METHODS.CARD]: 'При получении',
} as const;

// ============================================================================
// СОБЫТИЯ
// ============================================================================

export const EVENTS = {
	// Товары
	PRODUCTS_LOADED: 'products:loaded',
	PRODUCT_ADD: 'product:add',
	PRODUCT_REMOVE: 'product:remove',

	// Корзина
	BASKET_UPDATE: 'basket:update',
	BASKET_CLEAR: 'basket:clear',

	// Заказ
	ORDER_START: 'order:start',
	ORDER_SUBMIT: 'order:submit',
	ORDER_SUCCESS: 'order:success',

	// Модальные окна
	MODAL_OPEN: 'modal:open',
	MODAL_CLOSE: 'modal:close',

	// Формы
	FORM_VALIDATE: 'form:validate',

	// Ошибки
	ERROR_SHOW: 'error:show',
} as const;

// ============================================================================
// ТИПЫ МОДАЛЬНЫХ ОКОН
// ============================================================================

export const MODAL_TYPES = {
	PRODUCT: 'product',
	BASKET: 'basket',
	ORDER: 'order',
	SUCCESS: 'success',
} as const;

// ============================================================================
// ШАБЛОНЫ
// ============================================================================

export const TEMPLATES = {
	CARD_CATALOG: 'card-catalog',
	CARD_PREVIEW: 'card-preview',
	CARD_BASKET: 'card-basket',
	BASKET: 'basket',
	SUCCESS: 'success',
} as const;

// ============================================================================
// CSS КЛАССЫ
// ============================================================================

export const CSS_CLASSES = {
	// Модальные окна
	MODAL: 'modal',
	MODAL_ACTIVE: 'modal_active',
	MODAL_CONTAINER: 'modal__container',
	MODAL_CLOSE: 'modal__close',
	MODAL_CONTENT: 'modal__content',
	MODAL_TITLE: 'modal__title',
	MODAL_ACTIONS: 'modal__actions',

	// Карточки
	CARD: 'card',
	CARD_FULL: 'card_full',
	CARD_COMPACT: 'card_compact',
	CARD_TITLE: 'card__title',
	CARD_IMAGE: 'card__image',
	CARD_PRICE: 'card__price',
	CARD_CATEGORY: 'card__category',
	CARD_TEXT: 'card__text',
	CARD_ROW: 'card__row',
	CARD_COLUMN: 'card__column',
	CARD_BUTTON: 'card__button',

	// Категории карточек
	CARD_CATEGORY_SOFT: 'card__category_soft',
	CARD_CATEGORY_HARD: 'card__category_hard',
	CARD_CATEGORY_OTHER: 'card__category_other',

	// Корзина
	BASKET: 'basket',
	BASKET_LIST: 'basket__list',
	BASKET_ITEM: 'basket__item',
	BASKET_ITEM_INDEX: 'basket__item-index',
	BASKET_ITEM_DELETE: 'basket__item-delete',
	BASKET_PRICE: 'basket__price',

	// Формы
	FORM: 'form',
	FORM_LABEL: 'form__label',
	FORM_INPUT: 'form__input',

	// Заказ
	ORDER: 'order',
	ORDER_FIELD: 'order__field',
	ORDER_BUTTONS: 'order__buttons',

	// Успешный заказ
	ORDER_SUCCESS: 'order-success',
	ORDER_SUCCESS_TITLE: 'order-success__title',
	ORDER_SUCCESS_DESCRIPTION: 'order-success__description',
	ORDER_SUCCESS_CLOSE: 'order-success__close',

	// Кнопки
	BUTTON: 'button',
	BUTTON_ALT: 'button_alt',

	// Галерея
	GALLERY: 'gallery',
	GALLERY_ITEM: 'gallery__item',

	// Шапка
	HEADER: 'header',
	HEADER_CONTAINER: 'header__container',
	HEADER_LOGO: 'header__logo',
	HEADER_LOGO_IMAGE: 'header__logo-image',
	HEADER_BASKET: 'header__basket',
	HEADER_BASKET_COUNTER: 'header__basket-counter',
} as const;

// ============================================================================
// ВАЛИДАЦИЯ
// ============================================================================

export const VALIDATION = {
	EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE_REGEX: /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/,
	MIN_ADDRESS_LENGTH: 10,
	MIN_PHONE_LENGTH: 18,
} as const;

// ============================================================================
// СООБЩЕНИЯ
// ============================================================================

export const MESSAGES = {
	// Ошибки валидации
	EMAIL_REQUIRED: 'Введите email',
	EMAIL_INVALID: 'Введите корректный email',
	PHONE_REQUIRED: 'Введите телефон',
	PHONE_INVALID: 'Введите корректный телефон',
	ADDRESS_REQUIRED: 'Введите адрес доставки',
	ADDRESS_TOO_SHORT: 'Адрес должен содержать минимум 10 символов',
	PAYMENT_REQUIRED: 'Выберите способ оплаты',

	// Успешные сообщения
	ORDER_SUCCESS: 'Заказ оформлен',
	ORDER_SUCCESS_DESCRIPTION: 'Списано {total} синапсов',

	// Ошибки API
	PRODUCTS_LOAD_ERROR: 'Ошибка загрузки товаров',
	ORDER_SUBMIT_ERROR: 'Ошибка оформления заказа',

	// Общие
	LOADING: 'Загрузка...',
	EMPTY_BASKET: 'Корзина пуста',
} as const;

// ============================================================================
// НАСТРОЙКИ
// ============================================================================

export const settings = {
	// API
	API_TIMEOUT: 5000,
	API_RETRY_COUNT: 3,

	// UI
	MODAL_ANIMATION_DURATION: 300,
	DEBOUNCE_DELAY: 300,

	// Валидация
	VALIDATION_DEBOUNCE: 500,

	// Локальное хранилище
	STORAGE_KEY: 'weblarek_basket',

	// Пагинация
	PRODUCTS_PER_PAGE: 20,
} as const;

// ============================================================================
// МОК-ДАННЫЕ ДЛЯ РАЗРАБОТКИ
// ============================================================================

export const MOCK_PRODUCTS = [
	{
		id: '1',
		title: 'Бэкенд-антистресс',
		description: 'Если планируете решать задачи в тренажёре, берите два.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.SOFT,
		price: 1000,
	},
	{
		id: '2',
		title: 'Фронтенд-антистресс',
		description: 'Для тех, кто любит создавать красивые интерфейсы.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.SOFT,
		price: 1200,
	},
	{
		id: '3',
		title: 'Хард-скилс',
		description: 'Продвинутые техники программирования.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.HARD,
		price: 1500,
	},
	{
		id: '4',
		title: 'Другое',
		description: 'Различные полезные инструменты и ресурсы.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.OTHER,
		price: 800,
	},
	{
		id: '5',
		title: 'Алгоритмы и структуры данных',
		description: 'Основы алгоритмического мышления.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.HARD,
		price: 2000,
	},
	{
		id: '6',
		title: 'Веб-разработка',
		description: 'Современные технологии веб-разработки.',
		image: '/src/images/Subtract.png',
		category: PRODUCT_CATEGORIES.SOFT,
		price: 1800,
	},
] as const;
