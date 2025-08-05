import { IOrderForm, IOrderModel, PaymentMethod } from '../types';
import { CSS_CLASSES, PAYMENT_METHODS } from '../utils/constants';
import {
	cloneTemplate,
	addListener,
	removeListener,
	setText,
	validateEmail,
	validatePhone,
	validateAddress,
	formatPhone,
} from '../utils/utils';

export class OrderForm implements IOrderForm {
	protected element: HTMLElement;
	protected currentStep: 1 | 2 = 1;
	protected data: IOrderModel = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		isValid: false,
	};
	protected paymentButtons: HTMLButtonElement[] = [];
	protected addressInput: HTMLInputElement | null = null;
	protected emailInput: HTMLInputElement | null = null;
	protected phoneInput: HTMLInputElement | null = null;
	protected submitButton: HTMLButtonElement | null = null;
	protected errorsElement: HTMLElement | null = null;

	constructor() {
		this.element = this.createForm();
		this.bindEvents();
	}

	/**
	 * Создать форму
	 */
	protected createForm(): HTMLElement {
		const form = document.createElement('form');
		form.className = CSS_CLASSES.FORM;
		form.name = 'order';

		// Первый шаг
		const step1 = document.createElement('div');
		step1.className = 'order';
		step1.innerHTML = `
            <div class="${CSS_CLASSES.ORDER_FIELD}">
                <h2 class="${CSS_CLASSES.MODAL_TITLE}">Способ оплаты</h2>
                <div class="${CSS_CLASSES.ORDER_BUTTONS}">
                    <button name="online" type="button" class="${CSS_CLASSES.BUTTON} ${CSS_CLASSES.BUTTON_ALT}">Онлайн</button>
                    <button name="card" type="button" class="${CSS_CLASSES.BUTTON} ${CSS_CLASSES.BUTTON_ALT}">При получении</button>
                </div>
            </div>
            <label class="${CSS_CLASSES.ORDER_FIELD}">
                <span class="${CSS_CLASSES.FORM_LABEL} ${CSS_CLASSES.MODAL_TITLE}">Адрес доставки</span>
                <input name="address" class="${CSS_CLASSES.FORM_INPUT}" type="text" placeholder="Введите адрес" />
            </label>
        `;

		// Второй шаг
		const step2 = document.createElement('div');
		step2.className = 'order';
		step2.style.display = 'none';
		step2.innerHTML = `
            <label class="${CSS_CLASSES.ORDER_FIELD}">
                <span class="${CSS_CLASSES.FORM_LABEL} ${CSS_CLASSES.MODAL_TITLE}">Email</span>
                <input name="email" class="${CSS_CLASSES.FORM_INPUT}" type="email" placeholder="Введите Email" />
            </label>
            <label class="${CSS_CLASSES.ORDER_FIELD}">
                <span class="${CSS_CLASSES.FORM_LABEL} ${CSS_CLASSES.MODAL_TITLE}">Телефон</span>
                <input name="phone" class="${CSS_CLASSES.FORM_INPUT}" type="tel" placeholder="+7 (" />
            </label>
        `;

		// Кнопки действий
		const actions = document.createElement('div');
		actions.className = CSS_CLASSES.MODAL_ACTIONS;
		actions.innerHTML = `
            <button type="submit" disabled class="${CSS_CLASSES.BUTTON}">Далее</button>
            <span class="form__errors"></span>
        `;

		form.appendChild(step1);
		form.appendChild(step2);
		form.appendChild(actions);

		return form;
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Получаем элементы
		this.paymentButtons = Array.from(
			this.element.querySelectorAll(`button[name]`)
		);
		this.addressInput = this.element.querySelector('input[name="address"]');
		this.emailInput = this.element.querySelector('input[name="email"]');
		this.phoneInput = this.element.querySelector('input[name="phone"]');
		this.submitButton = this.element.querySelector('button[type="submit"]');
		this.errorsElement = this.element.querySelector('.form__errors');

		// Обработчики для кнопок оплаты
		this.paymentButtons.forEach((button) => {
			addListener(button, 'click', this.handlePaymentClick.bind(this));
		});

		// Обработчики для полей ввода
		if (this.addressInput) {
			addListener(
				this.addressInput,
				'input',
				this.handleAddressInput.bind(this)
			);
		}
		if (this.emailInput) {
			addListener(this.emailInput, 'input', this.handleEmailInput.bind(this));
		}
		if (this.phoneInput) {
			addListener(this.phoneInput, 'input', this.handlePhoneInput.bind(this));
		}

		// Обработчик отправки формы
		addListener(this.element, 'submit', this.handleSubmit.bind(this));
	}

	/**
	 * Обработчик клика по кнопке оплаты
	 */
	protected handlePaymentClick(event: Event): void {
		const button = event.target as HTMLButtonElement;
		const payment = button.name as PaymentMethod;

		// Убираем активный класс у всех кнопок
		this.paymentButtons.forEach((btn) =>
			btn.classList.remove(CSS_CLASSES.BUTTON_ALT)
		);

		// Добавляем активный класс к выбранной кнопке
		button.classList.add(CSS_CLASSES.BUTTON_ALT);

		this.data.payment = payment;
		this.validate();
	}

	/**
	 * Обработчик ввода адреса
	 */
	protected handleAddressInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.data.address = input.value;
		this.validate();
	}

	/**
	 * Обработчик ввода email
	 */
	protected handleEmailInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.data.email = input.value;
		this.validate();
	}

	/**
	 * Обработчик ввода телефона
	 */
	protected handlePhoneInput(event: Event): void {
		const input = event.target as HTMLInputElement;
		const formatted = formatPhone(input.value);
		input.value = formatted;
		this.data.phone = formatted;
		this.validate();
	}

	/**
	 * Обработчик отправки формы
	 */
	protected handleSubmit(event: Event): void {
		event.preventDefault();

		if (this.currentStep === 1 && this.validateStep1()) {
			this.setStep(2);
		} else if (this.currentStep === 2 && this.validateStep2()) {
			// Отправляем заказ
			const customEvent = new CustomEvent('order:submit', {
				detail: { data: this.data },
				bubbles: true,
			});
			this.element.dispatchEvent(customEvent);
		}
	}

	/**
	 * Установить шаг
	 */
	setStep(step: 1 | 2): void {
		this.currentStep = step;

		const step1 = this.element.querySelector('.order') as HTMLElement;
		const step2 = step1.nextElementSibling as HTMLElement;

		if (step === 1) {
			step1.style.display = 'block';
			step2.style.display = 'none';
			if (this.submitButton) {
				this.submitButton.textContent = 'Далее';
			}
		} else {
			step1.style.display = 'none';
			step2.style.display = 'block';
			if (this.submitButton) {
				this.submitButton.textContent = 'Оплатить';
			}
		}

		this.validate();
	}

	/**
	 * Валидация
	 */
	validate(): boolean {
		let isValid = false;

		if (this.currentStep === 1) {
			isValid = this.validateStep1();
		} else {
			isValid = this.validateStep2();
		}

		if (this.submitButton) {
			this.submitButton.disabled = !isValid;
		}

		this.showErrors();

		return isValid;
	}

	/**
	 * Валидация первого шага
	 */
	protected validateStep1(): boolean {
		return this.data.payment !== null && validateAddress(this.data.address);
	}

	/**
	 * Валидация второго шага
	 */
	protected validateStep2(): boolean {
		return validateEmail(this.data.email) && validatePhone(this.data.phone);
	}

	/**
	 * Показать ошибки
	 */
	protected showErrors(): void {
		if (!this.errorsElement) return;

		const errors: string[] = [];

		if (this.currentStep === 1) {
			if (!this.data.payment) {
				errors.push('Выберите способ оплаты');
			}
			if (!validateAddress(this.data.address)) {
				errors.push('Введите корректный адрес (минимум 10 символов)');
			}
		} else {
			if (!validateEmail(this.data.email)) {
				errors.push('Введите корректный email');
			}
			if (!validatePhone(this.data.phone)) {
				errors.push('Введите корректный телефон');
			}
		}

		setText(this.errorsElement, errors.join(', '));
	}

	/**
	 * Получить данные
	 */
	getData(): IOrderModel {
		return { ...this.data };
	}

	/**
	 * Установить данные
	 */
	setData(data: Partial<IOrderModel>): void {
		this.data = { ...this.data, ...data };
		this.renderForm();
	}

	/**
	 * Рендер формы
	 */
	protected renderForm(): void {
		// Устанавливаем значения полей
		if (this.addressInput) {
			this.addressInput.value = this.data.address;
		}
		if (this.emailInput) {
			this.emailInput.value = this.data.email;
		}
		if (this.phoneInput) {
			this.phoneInput.value = this.data.phone;
		}

		// Устанавливаем выбранный способ оплаты
		if (this.data.payment) {
			this.paymentButtons.forEach((button) => {
				if (button.name === this.data.payment) {
					button.classList.add(CSS_CLASSES.BUTTON_ALT);
				} else {
					button.classList.remove(CSS_CLASSES.BUTTON_ALT);
				}
			});
		}

		this.validate();
	}

	/**
	 * Рендер компонента
	 */
	render(): HTMLElement {
		return this.element;
	}

	/**
	 * Уничтожить компонент
	 */
	destroy(): void {
		this.paymentButtons.forEach((button) => {
			removeListener(button, 'click', this.handlePaymentClick.bind(this));
		});

		if (this.addressInput) {
			removeListener(
				this.addressInput,
				'input',
				this.handleAddressInput.bind(this)
			);
		}
		if (this.emailInput) {
			removeListener(
				this.emailInput,
				'input',
				this.handleEmailInput.bind(this)
			);
		}
		if (this.phoneInput) {
			removeListener(
				this.phoneInput,
				'input',
				this.handlePhoneInput.bind(this)
			);
		}

		removeListener(this.element, 'submit', this.handleSubmit.bind(this));
	}
}
