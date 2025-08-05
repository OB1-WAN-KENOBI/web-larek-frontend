import { ISuccess } from '../types';
import { CSS_CLASSES, TEMPLATES } from '../utils/constants';
import {
	cloneTemplate,
	setText,
	addListener,
	removeListener,
	formatPrice,
} from '../utils/utils';

export class Success implements ISuccess {
	protected element: HTMLElement;
	protected total: number = 0;
	protected closeButton: HTMLButtonElement | null = null;

	constructor() {
		this.element = cloneTemplate(TEMPLATES.SUCCESS);
		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		this.closeButton = this.element.querySelector(
			`.${CSS_CLASSES.ORDER_SUCCESS_CLOSE}`
		);
		if (this.closeButton) {
			addListener(this.closeButton, 'click', this.handleClose.bind(this));
		}
	}

	/**
	 * Обработчик закрытия
	 */
	protected handleClose(event: Event): void {
		const customEvent = new CustomEvent('success:close', {
			bubbles: true,
		});
		this.element.dispatchEvent(customEvent);
	}

	/**
	 * Установить общую сумму
	 */
	setTotal(total: number): void {
		this.total = total;
		this.renderSuccess();
	}

	/**
	 * Рендер компонента
	 */
	protected renderSuccess(): void {
		// Устанавливаем заголовок
		const title = this.element.querySelector(
			`.${CSS_CLASSES.ORDER_SUCCESS_TITLE}`
		) as HTMLElement;
		if (title) {
			setText(title, 'Заказ оформлен');
		}

		// Устанавливаем описание с суммой
		const description = this.element.querySelector(
			`.${CSS_CLASSES.ORDER_SUCCESS_DESCRIPTION}`
		) as HTMLElement;
		if (description) {
			setText(description, `Списано ${formatPrice(this.total)}`);
		}
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
		if (this.closeButton) {
			removeListener(this.closeButton, 'click', this.handleClose.bind(this));
		}
	}
}
