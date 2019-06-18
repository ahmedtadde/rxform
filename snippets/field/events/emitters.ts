import {
  DOMEvents,
  DOMFieldElementsType,
  DOMFieldEventsType
} from '@lib-types';
import { log } from '@utils/logger';
import { EventEmitter } from 'events';

export const domEvents = ($el: DOMFieldElementsType): EventEmitter => {
  const emitter$: EventEmitter = new EventEmitter();
  const fieldEvents: DOMFieldEventsType[] = [
    DOMEvents.FOCUS,
    DOMEvents.INPUT,
    DOMEvents.CHANGE,
    DOMEvents.BLUR
  ];

  const registerEvents = ($fieldElem: DOMFieldElementsType) => (
    event: DOMFieldEventsType
  ) => {
    emitter$.on(`@${event}(field[${$fieldElem.name}])`, (e: Event) => {
      log.info(
        `event -- @${event}(field[${$fieldElem.name}]) -- was triggered`,
        e
      );
    });
  };

  fieldEvents.forEach(registerEvents($el));
  return emitter$;
};
