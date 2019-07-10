import registerDOMEvents from '@emitter/dom-events';
import registerValueResolvers from '@emitter/value-resolvers';
import registerValueResolversRouter from '@emitter/value-resolvers-router';
import registerValuesStateStreamingFn from '@emitter/values-state';
import { getFormElement } from '@utils/dom';
import EventEmitter, { Emitter } from 'mitt';
export default (formOptions: any) => {
  const $formEl = getFormElement(formOptions.target);
  const emitter$: Emitter = new EventEmitter();
  const registrationFns = [
    registerDOMEvents,
    registerValueResolversRouter,
    registerValueResolvers,
    registerValuesStateStreamingFn
  ];
  registrationFns.forEach((fn: any) =>
    fn($formEl as HTMLFormElement, emitter$, formOptions)
  );
  return emitter$;
};
