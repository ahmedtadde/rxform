import buildEmitter from '@emitter/builder';
import { getFormElement } from '@utils/dom';
import { log } from '@utils/logger';
const RxForm = (formOptions: any) => {
  const $form = getFormElement(formOptions.target);
  const emitter$ = buildEmitter($form as HTMLFormElement);
  emitter$.on('*', log.info);
};

export default RxForm;
