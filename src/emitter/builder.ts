import registerDOMEvents from '@emitter/dom-events';
import EventEmitter, { Emitter } from 'mitt';
export default ($el: HTMLFormElement, opts?: any) => {
  const emitter$: Emitter = new EventEmitter();
  const eventRegistrationFns = [registerDOMEvents];
  eventRegistrationFns.forEach((fn: any) => fn(emitter$, $el));
  return emitter$;
};
