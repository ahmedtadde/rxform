import modelValidation from '@/model/validation';
import buildEmitter from '@emitter/builder';
import { throwError } from '@utils/errors';
import { deepClone, nonEmptyArray } from '@utils/object';
import EventEmitter, { Emitter } from 'mitt';

interface RxFormConfig {
  target: string | HTMLFormElement
}

const RxForm = (config: RxFormConfig) => {
  const { model, errors: err = null } = modelValidation(deepClone(config));
  if (nonEmptyArray(err)) {
    throwError((err as string[]).join('; '));
  }

  let emitter$: Emitter = buildEmitter(model);
  let form$: Emitter = EventEmitter();

  emitter$.on('form@values', (values: any) => {
    form$.emit('form@values', values);
  });

  emitter$.on('form@errors', (errors: any) => {
    form$.emit('form@errors', errors);
  });

  emitter$.on('form@status', (status: any) => {
    form$.emit('form@status', status);
  });

  const destroy = () => {
    if (form$) {
      form$.emit('destroy');
      setTimeout(() => {
        // @ts-ignore
        form$ = null;
      }, 1000);
    }

    if (emitter$) {
      emitter$.emit('form@remove-dom-listeners');
      emitter$.emit('destroy');
      setTimeout(() => {
        // @ts-ignore
        emitter$ = null;
      }, 1000);
    }
  };

  return { stream$: form$, destroy };
};

export default RxForm;
module.exports = RxForm;