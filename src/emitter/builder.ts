import registerDOMEvents from '@emitter/dom-events';
import EventEmitter, { Emitter } from 'mitt';
export default ($el: HTMLFormElement) => {
  const emitter$: Emitter = new EventEmitter();
  const eventRegistrationFns = [registerDOMEvents];
  eventRegistrationFns.forEach((fn: any) => fn(emitter$, $el));
  return emitter$;
};
