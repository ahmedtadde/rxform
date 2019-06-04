import { DOMEventsEmitterEventConfig } from '@core/typings';
import {
  domEventsEmitter,
  getFormElement,
  isFormElement
} from '@core/utils/dom';
import { throwError } from '@core/utils/errors';
import { EventEmitter } from 'events';

export default function config(options: any) {
  const { target = '', events = {} } = options;
  const $form = getFormElement(target);
  const getEvents = (eventsOption: any) => {
    const mergedEvents = Object.assign(
      {},
      { input: false, change: true, blur: true },
      eventsOption
    );

    const eventsFilter = (mergedEventsObj: any) => (eventName: string) => {
      const isValidName = ['input', 'change', 'blur'].includes(eventName);
      const isEnabled = mergedEventsObj[eventName] !== false;
      return isValidName && isEnabled;
    };

    return Object.keys(mergedEvents)
      .filter(eventsFilter(mergedEvents))
      .map((eventName: string) => {
        const eventConfig: DOMEventsEmitterEventConfig = {
          register: `_${eventName}`,
          type: eventName
        };
        return eventName === 'blur'
          ? Object.assign({}, eventConfig, { options: true }) // sets useCapture option to true
          : eventConfig;
      });
  };

  if ($form && isFormElement($form)) {
    const eventsConig: DOMEventsEmitterEventConfig[] = getEvents(events);
    const emitter$: EventEmitter = domEventsEmitter($form, eventsConig);
    return Object.assign(
      {},
      {
        $el: $form,
        emitter$,
        events: {
          dom: eventsConig
        }
      }
    );
  }

  throwError('Invalid form element from target option');
}
