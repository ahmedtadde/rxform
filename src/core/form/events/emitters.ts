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
    { domEvent: 'focus', emitterEvent: `@focus(form[${$el.name}])` },
    { domEvent: 'input', emitterEvent: `@input(form[${$el.name}])` },
    { domEvent: 'change', emitterEvent: `@change(form[${$el.name}])` },
    {
      domEvent: 'blur',
      emitterEvent: `@blur(form[${$el.name}])`,
      options: true // useCapture: true
    }
  ];
  const emitter$: EventEmitter = domEventsEmitter($el, events);
  events.forEach(event => {
    const { emitterEvent } = event;
    emitter$.on(
      emitterEvent,
      domEventsEmitterListeners($el, fields)[emitterEvent]
    );
  });

  return emitter$;
};
