import { DOMEventsEmitterEventConfig, EventEmitterListerner } from '@lib-types';
import { throwError } from '@utils/errors';
import { not } from '@utils/logic';
import { nonEmptyString } from '@utils/string';
import { EventEmitter } from 'events';

export function isInputElement(value: any) {
  return value instanceof HTMLInputElement;
}

export function isSelectElement(value: any) {
  return value instanceof HTMLSelectElement;
}

export function isTextAreaElement(value: any) {
  return value instanceof HTMLTextAreaElement;
}

export function isInputElementOfType(type: string, value: any) {
  return isInputElement(value) && value.type === type;
}

export function isFormElement(value: any) {
  return value instanceof HTMLFormElement;
}

export function isFormFieldElement(value: any) {
  return (
    isInputElement(value) || isSelectElement(value) || isTextAreaElement(value)
  );
}

export function domSelector(selector: string, from?: Element): Element | void {
  const queryString = nonEmptyString(selector) ? selector : '';
  if (from instanceof Element) {
    return (
      from.querySelector(queryString) || throwError('Invalid query selector')
    );
  }
  return (
    document.querySelector(queryString) || throwError('Invalid query selector')
  );
}

export const getFormElement = (
  target: string | HTMLFormElement | Element
): HTMLFormElement | void => {
  if (target instanceof HTMLFormElement) {
    return target;
  } else if (target instanceof Element) {
    if (not(isFormElement(target))) {
      throwError('Invalid form target value');
    }
    return target as HTMLFormElement;
  } else if (nonEmptyString(target)) {
    const $el = domSelector(target);
    if (not(isFormElement($el))) {
      throwError('Invalid form target value');
    }
    return $el as HTMLFormElement;
  }
};

export function addDOMListener(
  target: Element | string,
  event: string,
  listener: EventListenerOrEventListenerObject,
  options?: EventListenerOptions | boolean
): EventEmitterListerner {
  const $el = target instanceof Element ? target : domSelector(target);
  if (not($el instanceof Element)) {
    throwError('Invalid target param... resolved to non DOM element');
  }

  ($el as Element).addEventListener(event, listener, options || {});
  return (...args: any[]): void =>
    ($el as Element).removeEventListener(event, listener, options || {});
}

export function domEventsEmitter(
  element: Element,
  events: DOMEventsEmitterEventConfig[]
): EventEmitter {
  const emitter$: EventEmitter = new EventEmitter();
  events.forEach(
    (event: DOMEventsEmitterEventConfig): void => {
      const { domEvent, emitterEvent, options = {} } = event;
      const listener: EventListenerOrEventListenerObject = (e: Event) =>
        emitter$.emit(emitterEvent, e);
      const cleanup = addDOMListener(element, domEvent, listener, options);
      emitter$.on('remove-dom-listeners', cleanup);
    }
  );

  return emitter$;
}
