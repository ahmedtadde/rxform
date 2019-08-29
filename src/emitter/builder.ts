import registerDOMEvents from '@emitter/dom-events';
import registerErrorProviders from '@emitter/error-providers';
import registerErrorsStateStreamingFn from '@emitter/errors-state';
import registerFormSubmissionHandler from '@emitter/onsubmit';
import registerStatusStateStreamingFn from '@emitter/status-state';
import registerValueProviders from '@emitter/value-providers';
import registerValueProvidersRouter from '@emitter/value-providers-router';
import registerValuesStateStreamingFn from '@emitter/values-state';
import { getFormElement } from '@utils/dom';
import EventEmitter, { Emitter } from 'mitt';
export default (formOptions: any) => {
  const $formEl = getFormElement(formOptions.target);
  const emitter$: Emitter = new EventEmitter();
  const registrationFns = [
    registerDOMEvents,
    registerValueProvidersRouter,
    registerValueProviders,
    registerValuesStateStreamingFn,
    registerErrorProviders,
    registerErrorsStateStreamingFn,
    registerStatusStateStreamingFn,
    registerFormSubmissionHandler
  ];
  registrationFns.forEach((fn: any) =>
    fn($formEl as HTMLFormElement, emitter$, formOptions)
  );
  return emitter$;
};
