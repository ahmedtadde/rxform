import BaseFormConfig from '@core/form-config/base';
import FormFieldsConfig from '@core/form-config/fields';
import { log } from '@utils/logger';

const RxForm = (formOptions: any) => {
  log.info('creating a new RxForm. using options...', formOptions);
  const baseConfig = BaseFormConfig(formOptions);
  log.info("RxForm's base config", baseConfig);
  if (baseConfig) {
    const fieldsConfig = FormFieldsConfig(
      Object.assign({}, formOptions, { $form: baseConfig.$el })
    );
    log.info("RxForm's fields config", fieldsConfig);
    const config = Object.assign({}, baseConfig, { fields: fieldsConfig });
    log.info("RxForm's config", config);
    config.emitter$.on('_input', (e: Event) => {
      log.info('config emitter: "_input" event', e);
    });
    config.emitter$.on('_change', (e: Event) => {
      log.info('config emitter: "_change" event', e);
    });
    config.emitter$.on('_blur', (e: Event) => {
      log.info('config emitter: "_blur" event', e);
    });
  }
};

export default RxForm;
