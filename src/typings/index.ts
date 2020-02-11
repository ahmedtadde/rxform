import { Emitter } from 'mitt';

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

export type TargetElement = string | HTMLFormElement;

export type FormValues = Record<string, Readonly<any>>;
export type FormValuesProvider = string | [string, string | boolean] | [string, string, boolean] | {
  selector: string;
  dispatch?: string;
  multiple?: boolean;
  events?: false | DOMEvents[]
  parser?: ($field: DOMFieldElementsType) => any;
  transformer?: (resultFromParser: any) => any;
}
export type FormValuesReducerPayload = {
  type: string;
  value: any,
}
export type FormValuesReducer = (previousState: FormValues, payload: FormValuesReducerPayload) => FormValues;


export type FormErrors = Record<string, Readonly<any>>;
export type FormErrorsProvider = string | [string, (...args: any[]) => boolean] | [string, (...args: any[]) => boolean, string | ((...args: any[]) => string)] | {
  dispatch: string;
  message?: string | ((input?: any, values?: FormValues, errors?: FormErrors, status?: FormStatus) => string);
  validator?: (input?: any, values?: FormValues, errors?: FormErrors, status?: FormStatus) => boolean;
  predicate?: (values?: FormValues, errors?: FormErrors, status?: FormStatus) => boolean;
  input?: string | string[] | ((values?: FormValues, errors?: FormErrors, status?: FormStatus) => any);
}

export type FormErrorsReducerPayload = {
  type: string;
  error: {
    context: {
      errors: FormErrors,
      input: any,
      status: FormStatus,
      values: FormValues
    },
    message: string
  } | null,
}
export type FormErrorsReducer = (previousState: FormErrors, payload: FormErrorsReducerPayload) => FormErrors;


export type FormStatus = {
  fields: { [name: string]: Record<string, boolean> };
  submitting: boolean;
};

export type FormDispatch = {
  errors: (payload: FormErrors) => void;
  status: (payload: FormStatus) => void;
  values: (payload: FormValues) => void;
}

export type SubmissionHandler = (values: FormValues, errors: FormErrors, status: FormStatus, dispatch: FormDispatch) => void;

export interface RxFormConfig {
  target: TargetElement,
  onsubmit: SubmissionHandler,
  values: {
    state: FormValues,
    providers: FormValuesProvider[],
    reducer: FormValuesReducer,
    events: DOMEventsType
    hooks?: {
      start?: (evt: Event) => void;
      end?: (payload?: FormValuesReducerPayload) => void;
    }
  },
  errors: {
    state: FormErrors,
    providers: FormErrorsProvider[],
    reducer: FormErrorsReducer,
    hooks?: {
      start?: (values?: FormValues, errors?: FormErrors, status?: FormStatus) => void;
      end?: (payload?: { error: string; input: any; type: string }) => void;
    }
  }
}

export interface RxForm {
  stream$: Emitter,
  destroy: () => void
}