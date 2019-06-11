import {
  DOMEventsEmitterEventConfig,
  DOMFieldElementsType,
  EventEmitterListerner
} from '@lib-types';
import { throwError } from '@utils/errors';
import { isNil, not } from '@utils/logic';
import { isNumber } from '@utils/number';
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
  const assertFormElement = (value: any): void => {
    if (not(isFormElement(value))) {
      throwError('Invalid form target value');
    }
  };

  if (target instanceof HTMLFormElement) {
    return target;
  } else if (target instanceof Element) {
    assertFormElement(target);
    return target as HTMLFormElement;
  } else if (nonEmptyString(target)) {
    const $el = domSelector(target);
    assertFormElement($el);
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
      const { type: domEvent, register: emitterEvent, options = {} } = event;
      const listener: EventListenerOrEventListenerObject = (e: Event) =>
        emitter$.emit(emitterEvent, e);
      const cleanup = addDOMListener(element, domEvent, listener, options);
      emitter$.on('form@remove-dom-listeners', cleanup);
    }
  );

  return emitter$;
}

export function getFormFieldElementValue($el: DOMFieldElementsType) {
  if (isNil($el) || not(isFormFieldElement($el))) {
    throwError('Invalid form field element param');
  }

  if ($el instanceof HTMLInputElement) {
    return getInputFieldElementValue($el);
  }

  if ($el instanceof HTMLSelectElement) {
    return getSelectFieldElementValue($el);
  }

  if ($el instanceof HTMLTextAreaElement) {
    return getTextAreaFieldElementValue($el);
  }
}

export function getInputFieldElementValue($el: HTMLInputElement) {
  if (not($el instanceof HTMLInputElement)) {
    throwError('Invalid form field element param');
  }
  const parser = ($field: HTMLInputElement) => {
    switch ($field.type) {
      case 'image':
      case 'file':
      case 'button':
      case 'reset':
      case 'submit':
        return null;
      case 'number':
        return Number($field.value);
      case 'checkbox':
        return $field.checked ? $field.value : null;
      case 'radio':
        return $field.checked ? $field.value : null;
      default:
        return $field.value;
    }
  };
  return parser($el);
}

export function getSelectFieldElementValue($el: HTMLSelectElement) {
  if (not($el instanceof HTMLSelectElement)) {
    throwError('Invalid form field element param');
  }
  const parser = ($field: HTMLSelectElement) => {
    const singleValue = ($target: HTMLSelectElement) => {
      return (
        (Array.isArray($target.options) &&
          isNumber($target.selectedIndex) &&
          $target.options[$target.selectedIndex] &&
          not(isNil($target.options[$target.selectedIndex].value)) &&
          $target.options[$target.selectedIndex].value) ||
        null
      );
    };

    const multipleValues = ($target: HTMLSelectElement) => {
      const options = Array.isArray($target.options) ? $target.options : [];
      return Array.from(options)
        .filter((option: HTMLOptionElement) => option.selected)
        .map((option: HTMLOptionElement) => {
          if (isNil(option.value) && isNil(option.text)) {
            return null;
          }
          return isNil(option.value) ? option.text : option.value;
        });
    };
    switch ($field.multiple) {
      case false:
        return singleValue($field);
      default:
        return multipleValues($field);
    }
  };
  return parser($el);
}

export function getTextAreaFieldElementValue($el: HTMLTextAreaElement) {
  if (not($el instanceof HTMLTextAreaElement)) {
    throwError('Invalid form field element param');
  }
  return $el.value;
}
