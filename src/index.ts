import buildEmitter from '@emitter/builder';
import { log } from '@utils/logger';
const RxForm = (formOptions: any) => {
  const emitter$ = buildEmitter(formOptions);
  emitter$.on('form@values', log.info);
};

export default RxForm;
