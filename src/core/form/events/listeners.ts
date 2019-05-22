import {
  DOMEvents,
  DOMEventsType,
  DOMFieldElementsType,
  EventEmitterListerner
} from '@lib-types';
import { isFormFieldElement } from '@utils/dom';
import { EventEmitter } from 'events';

interface FieldConfigParam {
  name: string;
  selector: string;
  events: DOMEventsType[];
  emitter$: EventEmitter;
}

interface EventEmitterListernerCollection {
  [event: string]: EventEmitterListerner;
}

export const domEvents = (
  $el: HTMLFormElement,
  fields: FieldConfigParam[]
): EventEmitterListernerCollection => {
  const formEvents: DOMEventsType[] = [
    DOMEvents.FOCUS,
    DOMEvents.INPUT,
    DOMEvents.CHANGE,
    DOMEvents.BLUR,
    DOMEvents.SUBMIT
  ];

  const listener = (fieldsCollection: FieldConfigParam[]) => (e: Event) => {
    const $target = e.target as DOMFieldElementsType;
    if ($target && isFormFieldElement($target)) {
      const field = fieldsCollection.find(fieldItem => {
        return $target.matches(fieldItem.selector);
      });

      if (field && field.events.includes(e.type as DOMEventsType)) {
        field.emitter$.emit(`@${e.type}(field[${field.name}])`, e);
      }
    }
  };

  const reducer = (
    $formEl: HTMLFormElement,
    fieldsCollection: FieldConfigParam[]
  ) => (
    listenersAccumulator: EventEmitterListernerCollection,
    event: DOMEventsType
  ) => {
    return Object.assign({}, listenersAccumulator, {
      [`@${event}(form[${$formEl.name}])`]: listener(
        fieldsCollection
      ) as EventEmitterListerner
    });
  };

  return formEvents.reduce(reducer($el, fields), {});
};
