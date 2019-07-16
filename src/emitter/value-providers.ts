import valueProviderFn from '@src/providers/value';
import { Emitter } from 'mitt';
export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  formOptions.values.providers.forEach((formValueOptionObj: any) => {
    valueProviderFn($formEl, emitter$, formValueOptionObj);
  });

  return emitter$;
};
