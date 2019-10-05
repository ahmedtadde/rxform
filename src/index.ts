import modelValidation from '@/model/validation';
import buildEmitter from '@emitter/builder';
import { deepClone } from '@utils/object';
import EventEmitter, { Emitter } from 'mitt';
const RxForm = (options: any) => {
  const formOptions = modelValidation(deepClone(options));
  let emitter$: Emitter = buildEmitter(formOptions);
  let form$: Emitter = new EventEmitter();

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

  return { form$, destroy };
};

export default RxForm;
