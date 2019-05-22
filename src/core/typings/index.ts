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
  | DOMEvents.FOCUS
  | DOMEvents.INPUT
  | DOMEvents.CHANGE
  | DOMEvents.BLUR;

export interface DOMEventsEmitterEventConfig {
  domEvent: string;
  emitterEvent: string;
  options?: EventListenerOptions | boolean;
}

export type EventEmitterListerner = (...args: any[]) => any;

export interface EventEmitterListernerConfig {
  listener: EventEmitterListerner;
  map: (...args: any[]) => any;
  filter: (...args: any[]) => boolean;
  options?: any;
}
