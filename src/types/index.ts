// ============================================================================
// API ТИПЫ
// ============================================================================

/**
 * Товар с сервера
 */
export interface IProduct {
	id: string;
	title: string;
	description: string;
	image: string;
	category: ProductCategory;
	price: number | null;
}

/**
 * Категории товаров
 */
export type ProductCategory = 'soft' | 'hard' | 'other';

/**
 * Заказ для отправки на сервер
 */
export interface IOrder {
	payment: PaymentMethod;
	address: string;
	email: string;
	phone: string;
	total: number;
	items: string[]; // ID товаров
}

/**
 * Способ оплаты
 */
export type PaymentMethod = 'online' | 'card';

/**
 * Ответ API с товарами
 */
export interface IProductsResponse {
	total: number;
	items: IProduct[];
}

// ============================================================================
// МОДЕЛЬ ДАННЫХ
// ============================================================================

/**
 * Товар в приложении (с дополнительными полями)
 */
export interface IProductModel extends IProduct {
	inBasket: boolean;
}

/**
 * Корзина покупок
 */
export interface IBasketModel {
	items: IProductModel[];
	total: number;
	count: number;
}

/**
 * Заказ в процессе оформления
 */
export interface IOrderModel {
	payment: PaymentMethod | null;
	address: string;
	email: string;
	phone: string;
	isValid: boolean;
}

/**
 * Состояние приложения
 */
export interface IAppState {
	products: IProductModel[];
	basket: IBasketModel;
	order: IOrderModel;
	isLoading: boolean;
	error: string | null;
}

// ============================================================================
// СОБЫТИЯ
// ============================================================================

/**
 * События приложения
 */
export type AppEvent =
	| 'products:loaded'
	| 'product:add'
	| 'product:remove'
	| 'basket:update'
	| 'order:start'
	| 'order:submit'
	| 'order:success'
	| 'modal:open'
	| 'modal:close'
	| 'form:validate'
	| 'error:show';

/**
 * Данные события добавления товара
 */
export interface IProductAddEvent {
	product: IProductModel;
}

/**
 * Данные события удаления товара
 */
export interface IProductRemoveEvent {
	productId: string;
}

/**
 * Данные события обновления корзины
 */
export interface IBasketUpdateEvent {
	basket: IBasketModel;
}

/**
 * Данные события открытия модального окна
 */
export interface IModalOpenEvent {
	type: 'product' | 'basket' | 'order' | 'success';
	data?: any;
}

/**
 * Данные события валидации формы
 */
export interface IFormValidateEvent {
	form: 'order';
	isValid: boolean;
}

/**
 * Данные события ошибки
 */
export interface IErrorEvent {
	message: string;
}

// ============================================================================
// ИНТЕРФЕЙСЫ КОМПОНЕНТОВ
// ============================================================================

/**
 * Базовый интерфейс для всех компонентов
 */
export interface IComponent {
	render(): HTMLElement;
	destroy(): void;
}

/**
 * Интерфейс для компонентов с событиями
 */
export interface IEventEmitter {
	on<T extends object>(event: string, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	off<T extends object>(event: string, callback: (data: T) => void): void;
}

/**
 * Интерфейс для модальных окон
 */
export interface IModal extends IComponent {
	open(data?: any): void;
	close(): void;
	setContent(content: HTMLElement): void;
}

/**
 * Интерфейс для компонентов модальных окон
 */
export interface IModalContent extends IComponent {
	render(): HTMLElement;
}

/**
 * Интерфейс для карточки товара
 */
export interface IProductCard extends IComponent {
	setProduct(product: IProductModel): void;
	setInBasket(inBasket: boolean): void;
}

/**
 * Интерфейс для корзины
 */
export interface IBasket extends IComponent {
	addItem(product: IProductModel): void;
	removeItem(productId: string): void;
	updateTotal(): void;
	clear(): void;
}

/**
 * Интерфейс для формы заказа
 */
export interface IOrderForm extends IComponent {
	setStep(step: 1 | 2): void;
	validate(): boolean;
	getData(): IOrderModel;
	setData(data: Partial<IOrderModel>): void;
}

// ============================================================================
// ИНТЕРФЕЙСЫ API
// ============================================================================

/**
 * Интерфейс API клиента
 */
export interface IApiClient {
	get<T>(url: string): Promise<T>;
	post<T>(url: string, data: any): Promise<T>;
	put<T>(url: string, data: any): Promise<T>;
	delete<T>(url: string): Promise<T>;
}

/**
 * Интерфейс для работы с товарами
 */
export interface IProductApi {
	getProducts(): Promise<IProductsResponse>;
	getProduct(id: string): Promise<IProduct>;
}

/**
 * Интерфейс для работы с заказами
 */
export interface IOrderApi {
	createOrder(order: IOrder): Promise<{ id: string }>;
}

// ============================================================================
// ИНТЕРФЕЙСЫ МОДЕЛЕЙ
// ============================================================================

/**
 * Интерфейс модели товаров
 */
export interface IProductModelManager {
	getProducts(): IProductModel[];
	getProduct(id: string): IProductModel | null;
	setProducts(products: IProduct[]): void;
	addToBasket(productId: string): void;
	removeFromBasket(productId: string): void;
	isInBasket(productId: string): boolean;
}

/**
 * Интерфейс модели корзины
 */
export interface IBasketModelManager {
	getItems(): IProductModel[];
	getTotal(): number;
	getCount(): number;
	addItem(product: IProductModel): void;
	removeItem(productId: string): void;
	clear(): void;
	isEmpty(): boolean;
}

/**
 * Интерфейс модели заказа
 */
export interface IOrderModelManager {
	getData(): IOrderModel;
	setPayment(payment: PaymentMethod): void;
	setAddress(address: string): void;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	validate(): boolean;
	reset(): void;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ПРЕДСТАВЛЕНИЙ
// ============================================================================

/**
 * Интерфейс для главной страницы
 */
export interface IMainView extends IComponent {
	renderProducts(products: IProductModel[]): void;
	updateBasketCount(count: number): void;
	showLoading(): void;
	hideLoading(): void;
	showError(message: string): void;
}

/**
 * Интерфейс для компонента товара в модальном окне
 */
export interface IProduct extends IModalContent {
	setProduct(product: IProductModel): void;
	setInBasket(inBasket: boolean): void;
}

/**
 * Интерфейс для модального окна корзины
 */
export interface IBasketModal extends IModal {
	setItems(items: IProductModel[]): void;
	setTotal(total: number): void;
}

/**
 * Интерфейс для модального окна заказа
 */
export interface IOrderModal extends IModal {
	setStep(step: 1 | 2): void;
	setData(data: IOrderModel): void;
	setValid(isValid: boolean): void;
}

/**
 * Интерфейс для компонента успешного заказа
 */
export interface ISuccess extends IModalContent {
	setTotal(total: number): void;
}

// ============================================================================
// ИНТЕРФЕЙСЫ ПРЕЗЕНТЕРОВ
// ============================================================================

/**
 * Интерфейс главного презентера
 */
export interface IMainPresenter {
	init(): void;
	loadProducts(): void;
	openProductModal(productId: string): void;
	openBasketModal(): void;
	addToBasket(productId: string): void;
	removeFromBasket(productId: string): void;
	startOrder(): void;
	submitOrder(): void;
}

/**
 * Интерфейс презентера товара
 */
export interface IProductPresenter {
	setProduct(productId: string): void;
	addToBasket(): void;
	removeFromBasket(): void;
	openModal(): void;
}

/**
 * Интерфейс презентера корзины
 */
export interface IBasketPresenter {
	loadItems(): void;
	removeItem(productId: string): void;
	startOrder(): void;
	close(): void;
}

/**
 * Интерфейс презентера заказа
 */
export interface IOrderPresenter {
	setStep(step: 1 | 2): void;
	setPayment(payment: PaymentMethod): void;
	setAddress(address: string): void;
	setEmail(email: string): void;
	setPhone(phone: string): void;
	validateStep(): boolean;
	submitOrder(): void;
	close(): void;
}

// ============================================================================
// УТИЛИТЫ
// ============================================================================

/**
 * Функция валидации email
 */
export type EmailValidator = (email: string) => boolean;

/**
 * Функция валидации телефона
 */
export type PhoneValidator = (phone: string) => boolean;

/**
 * Функция валидации адреса
 */
export type AddressValidator = (address: string) => boolean;

/**
 * Функция форматирования цены
 */
export type PriceFormatter = (price: number | null) => string;

/**
 * Функция форматирования телефона
 */
export type PhoneFormatter = (phone: string) => string;
