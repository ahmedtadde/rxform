export enum DOMEvents {
  FOCUS = 'focus',
  INPUT = 'input',
  CHANGE = 'change',
  BLUR = 'blur',
  SUBMIT = 'submit'
}

export type DOMFieldElementsType =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type DOMEventsType =
  | DOMEvents.FOCUS
  | DOMEvents.INPUT
  | DOMEvents.BLUR
  | DOMEvents.CHANGE
  | DOMEvents.SUBMIT;

export type DOMFieldEventsType =
  | DOMEvents.INPUT
  | DOMEvents.CHANGE
  | DOMEvents.BLUR;

export interface DOMEventsEmitterEventConfig {
  type: string;
  register: string;
  options?: EventListenerOptions | boolean;
}

export type EventEmitterListerner = (...args: any[]) => any;
