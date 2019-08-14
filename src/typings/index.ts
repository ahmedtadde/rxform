export enum DOMEvents {
  FOCUS = "focus",
  INPUT = "input",
  CHANGE = "change",
  BLUR = "blur",
  SUBMIT = "submit",
  RESET = "reset"
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
  | DOMEvents.SUBMIT
  | DOMEvents.RESET;

export type DOMFieldEventsType =
  | DOMEvents.INPUT
  | DOMEvents.CHANGE
  | DOMEvents.BLUR;

export interface EmitterDOMEventConfig {
  type: DOMEventsType;
  registerAs: string;
  options?: EventListenerOptions | boolean;
}

export type EventEmitterListener = (...args: any[]) => any;

export interface FormStatusData {
  fields: { [fieldName: string]: any };
  submitting: boolean;
}
