import valueResolverFn from '@src/resolvers/value';
import { Emitter } from 'mitt';
export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  formOptions.values.update.resolvers.forEach((formValueOptionObj: any) => {
    valueResolverFn($formEl, emitter$, formValueOptionObj);
  });

  return emitter$;
};
