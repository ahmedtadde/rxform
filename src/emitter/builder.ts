import registerDOMEvents from '@emitter/dom-events';
import setupValueResolversRouter from '@emitter/value-resolvers-router';
import EventEmitter, { Emitter } from 'mitt';
export default (formOptions: any) => {
  const emitter$: Emitter = new EventEmitter();
  const registrationFns = [registerDOMEvents, setupValueResolversRouter];
  registrationFns.forEach((fn: any) => fn(emitter$, formOptions));
  return emitter$;
};
