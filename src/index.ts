// import buildEmitter from '@emitter/builder';
// import { log } from '@utils/logger';
import { getValueFromObject } from '@utils/object';
const RxForm = (formOptions: any) => {
  // const emitter$ = buildEmitter(formOptions);
  // emitter$.on('form@values', log.info);
  return { config: formOptions, util: { get: getValueFromObject } };
};

export default RxForm;
