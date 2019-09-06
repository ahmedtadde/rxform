import {
  DOMEvents,
  DOMEventsType,
  DOMFieldElementsType,
  FormStatusData
} from '@lib-types';
import { throwError } from '@utils/errors';
import { log } from '@utils/logger';
import { not } from '@utils/logic';
import {
  deepClone,
  isBoolean,
  isPlainObject,
  nonEmptyString
} from '@utils/object';
import { Emitter } from 'mitt';
export default (emitter$: Emitter) => {
  let status: FormStatusData = {
    fields: {},
    submitting: false
  };

  const formDOMEvents = [
    DOMEvents.BLUR,
    DOMEvents.CHANGE,
    DOMEvents.SUBMIT,
    DOMEvents.RESET
  ];

  const handler = (formEmitter$: Emitter) => (evt: Event) => {
    if (
      not(
        [DOMEvents.SUBMIT, DOMEvents.RESET].includes(evt.type as DOMEventsType)
      )
    ) {
      log.info('form status event handler triggered', evt);
      const $el = evt.target as DOMFieldElementsType | HTMLFormElement;
      nonEmptyString($el.name) ||
        throwError(
          `Target element has no name attribute: ${JSON.stringify($el)}`
        );

      const mapEventToFieldStatus = (fieldDOMEvent: Event) => {
        switch (fieldDOMEvent.type) {
          case 'blur':
            return ['touched'];
          case 'change':
            return ['modified'];
          case 'submit':
            return ['touched', 'modified'];
          default:
            return [];
        }
      };

      const fieldStatusObj = isPlainObject(status.fields[$el.name.trim()])
        ? status.fields[$el.name.trim()]
        : {};

      status.fields[$el.name.trim()] = mapEventToFieldStatus(evt).reduce(
        (
          updatedFieldStatusObj: { [statusType: string]: boolean },
          statusType: string
        ) => {
          return fieldStatusObj[statusType]
            ? updatedFieldStatusObj
            : Object.assign({}, updatedFieldStatusObj, { [statusType]: true });
        },
        fieldStatusObj
      );
    }

    if (evt.type === 'submit') {
      status.submitting = true;
    } else if (evt.type === 'reset') {
      status = {
        fields: {},
        submitting: false
      };
    }

    formEmitter$.emit('form@status', deepClone(status));
  };

  formDOMEvents.forEach((formDOMEventType: DOMEventsType) =>
    emitter$.on(`form@${formDOMEventType}`, handler(emitter$))
  );

  emitter$.on('set-status', (payload: any) => {
    isPlainObject(payload) || throwError("Invalid status' state object");
    isPlainObject(payload.fields) ||
      throwError(
        "Invalid status' state object; 'fields' prop is required and its value must be a plain object"
      );
    isBoolean(payload.submitting) ||
      throwError(
        "Invalid status' state object; 'submitting' prop is required and its value must be boolean"
      );
    status = payload;
    emitter$.emit('form@status', deepClone(status));
  });

  return emitter$;
};
