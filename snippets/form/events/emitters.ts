import { domEvents as domEventsEmitterListeners } from '@core/form/events/listeners';
import { DOMEventsEmitterEventConfig, DOMEventsType } from '@lib-types';
import { domEventsEmitter } from '@utils/dom';
import { EventEmitter } from 'events';

interface FieldConfigParam {
  name: string;
  selector: string;
  events: DOMEventsType[];
  emitter$: EventEmitter;
}

export const domEvents = (
  $el: HTMLFormElement,
  fields: FieldConfigParam[]
): EventEmitter => {
  const events: DOMEventsEmitterEventConfig[] = [
    { type: 'input', register: `@input(form[${$el.name}])` },
    { type: 'change', register: `@change(form[${$el.name}])` },
    {
      options: true, // useCapture: true
      register: `@blur(form[${$el.name}])`,
      type: 'blur'
    }
  ];
  const emitter$: EventEmitter = domEventsEmitter($el, events);
  events.forEach(event => {
    const { register: emitterEvent } = event;
    emitter$.on(
      emitterEvent,
      domEventsEmitterListeners($el, fields)[emitterEvent]
    );
  });

  return emitter$;
};
