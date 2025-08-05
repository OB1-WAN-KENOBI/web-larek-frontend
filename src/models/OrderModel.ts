import { IOrderModel, PaymentMethod, IOrderModelManager } from '../types';
import { EventEmitter } from '../components/base/events';
import { EVENTS, VALIDATION } from '../utils/constants';
import { validateEmail, validatePhone, validateAddress } from '../utils/utils';

export class OrderModel implements IOrderModelManager {
	private order: IOrderModel = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		isValid: false,
	};
	private events: EventEmitter;

	constructor(events: EventEmitter) {
		this.events = events;
	}

	/**
	 * Получить данные заказа
	 */
	getData(): IOrderModel {
		return { ...this.order };
	}

	/**
	 * Установить способ оплаты
	 */
	setPayment(payment: PaymentMethod): void {
		this.order.payment = payment;
		this.validate();
	}

	/**
	 * Установить адрес доставки
	 */
	setAddress(address: string): void {
		this.order.address = address;
		this.validate();
	}

	/**
	 * Установить email
	 */
	setEmail(email: string): void {
		this.order.email = email;
		this.validate();
	}

	/**
	 * Установить телефон
	 */
	setPhone(phone: string): void {
		this.order.phone = phone;
		this.validate();
	}

	/**
	 * Валидация заказа
	 */
	validate(): boolean {
		const isPaymentValid = this.order.payment !== null;
		const isAddressValid = validateAddress(this.order.address);
		const isEmailValid = validateEmail(this.order.email);
		const isPhoneValid = validatePhone(this.order.phone);

		this.order.isValid =
			isPaymentValid && isAddressValid && isEmailValid && isPhoneValid;

		this.events.emit(EVENTS.FORM_VALIDATE, {
			form: 'order',
			isValid: this.order.isValid,
		});

		return this.order.isValid;
	}

	/**
	 * Валидация первого шага (оплата и адрес)
	 */
	validateStep1(): boolean {
		const isPaymentValid = this.order.payment !== null;
		const isAddressValid = validateAddress(this.order.address);

		return isPaymentValid && isAddressValid;
	}

	/**
	 * Валидация второго шага (email и телефон)
	 */
	validateStep2(): boolean {
		const isEmailValid = validateEmail(this.order.email);
		const isPhoneValid = validatePhone(this.order.phone);

		return isEmailValid && isPhoneValid;
	}

	/**
	 * Сбросить данные заказа
	 */
	reset(): void {
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			isValid: false,
		};
	}

	/**
	 * Получить сообщения об ошибках валидации
	 */
	getValidationErrors(): Record<string, string> {
		const errors: Record<string, string> = {};

		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.order.address.trim()) {
			errors.address = 'Введите адрес доставки';
		} else if (!validateAddress(this.order.address)) {
			errors.address = 'Адрес должен содержать минимум 10 символов';
		}

		if (!this.order.email.trim()) {
			errors.email = 'Введите email';
		} else if (!validateEmail(this.order.email)) {
			errors.email = 'Введите корректный email';
		}

		if (!this.order.phone.trim()) {
			errors.phone = 'Введите телефон';
		} else if (!validatePhone(this.order.phone)) {
			errors.phone = 'Введите корректный телефон';
		}

		return errors;
	}
}
