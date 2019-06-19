import registerDOMEvents from '@emitter/dom-events';
import registerValueResolversRouter from '@emitter/value-resolvers-router';
import EventEmitter, { Emitter } from 'mitt';
export default (formOptions: any) => {
  const emitter$: Emitter = new EventEmitter();
  const registrationFns = [registerDOMEvents, registerValueResolversRouter];
  registrationFns.forEach((fn: any) => fn(emitter$, formOptions));
  return emitter$;
};
