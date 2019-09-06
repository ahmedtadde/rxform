import buildEmitter from '@emitter/builder';
import { log } from '@utils/logger';
import { deepClone } from '@utils/object';
const RxForm = (formOptions: any) => {
  const emitter$ = buildEmitter(deepClone(formOptions));
  emitter$.on('form@values', (values: any) => {
    log.info('[FORM VALUES] ', values);
  });

  emitter$.on('form@errors', (errors: any) => {
    log.info('[FORM ERRORS] ', errors);
  });

  emitter$.on('form@status', (status: any) => {
    log.info('[FORM STATUS] ', status);
  });

  emitter$.on('form@submit', (evt: Event) => {
    log.info('[FORM SUBMIT] ', evt);
  });
};

export default RxForm;
