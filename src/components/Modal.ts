import { IModal, IComponent } from '../types';
import { CSS_CLASSES } from '../utils/constants';
import { ensureElement, addListener, removeListener } from '../utils/utils';

export class Modal implements IModal {
	protected container: HTMLElement;
	protected content: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(container: HTMLElement) {
		this.container = container;
		this.content = ensureElement<HTMLElement>(
			container,
			`.${CSS_CLASSES.MODAL_CONTENT}`
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			container,
			`.${CSS_CLASSES.MODAL_CLOSE}`
		);

		this.bindEvents();
	}

	/**
	 * Привязать события
	 */
	protected bindEvents(): void {
		// Закрытие по клику на крестик
		addListener(this.closeButton, 'click', this.close.bind(this));

		// Закрытие по клику вне модального окна
		addListener(this.container, 'click', (event: Event) => {
			if (event.target === this.container) {
				this.close();
			}
		});
	}

	/**
	 * Открыть модальное окно
	 */
	open(data?: any): void {
		this.container.classList.add(CSS_CLASSES.MODAL_ACTIVE);
		// lock body scroll while modal is open
		document.body.style.overflow = 'hidden';
	}

	/**
	 * Закрыть модальное окно
	 */
	close(): void {
		this.container.classList.remove(CSS_CLASSES.MODAL_ACTIVE);
		// restore body scroll
		document.body.style.overflow = '';
	}

	/**
	 * Установить содержимое
	 */
	setContent(content: HTMLElement): void {
		this.content.innerHTML = '';
		this.content.appendChild(content);
	}

	/**
	 * Рендер компонента
	 */
	render(): HTMLElement {
		return this.container;
	}

	/**
	 * Уничтожить компонент
	 */
	destroy(): void {
		removeListener(this.closeButton, 'click', this.close.bind(this));
		removeListener(this.container, 'click', this.close.bind(this));
	}
}
