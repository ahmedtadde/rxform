import { domEvents as getFieldDOMEventsEmitter } from '@core/field/events/emitters';
import { domEvents as getFormDOMEventsEmitter } from '@core/form/events/emitters';
import {
  domSelector,
  getFormElement,
  isFormElement,
  isFormFieldElement
} from '@core/utils/dom';
import { DOMEventsType, DOMFieldElementsType } from '@lib-types';
import { log } from '@utils/logger';
import { EventEmitter } from 'events';
interface FieldConfigParam {
  name: string;
  selector: string;
  events: DOMEventsType[];
  emitter$: EventEmitter;
}

const RxForm = (config: any) => {
  log.info('creating a new RxForm...', config);
  const fields: FieldConfigParam[] = Object.entries(config.fields).reduce(
    (fieldsAccumulator, field: [string, any]) => {
      const [name, options] = field;
      const { selector, events } = options;
      const $fieldEl = domSelector(selector);
      if ($fieldEl && isFormFieldElement($fieldEl)) {
        const emitter$: EventEmitter = getFieldDOMEventsEmitter(
          $fieldEl as DOMFieldElementsType
        );
        return fieldsAccumulator.concat(
          Object.assign(
            {},
            {
              emitter$,
              events,
              name,
              selector
            }
          )
        );
      }

      return fieldsAccumulator;
    },
    [] as FieldConfigParam[]
  );

  const $formField = getFormElement(config.target);
  if ($formField && isFormElement($formField)) {
    const $formDOMEventsEmitter = getFormDOMEventsEmitter($formField, fields);
    log.warning('form dom events emitter', $formDOMEventsEmitter);
  }
};

export default RxForm;
