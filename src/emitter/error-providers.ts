import errorProviderFn from '@src/providers/error';
import { Emitter } from 'mitt';
export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  formOptions.errors.providers.forEach((formErrorOptionObj: any) => {
    errorProviderFn($formEl, emitter$, formErrorOptionObj);
  });

  return emitter$;
};
