import { I as Icombinator, K as Kcombinator } from '@utils/combinators';
import { throwError } from '@utils/errors';
import {
  getValueFromObject,
  isFunctionOrPromise,
  isPlainObject,
  promisifyFunction
} from '@utils/object';
import { nonEmptyString } from '@utils/string';
import { Emitter } from 'mitt';
export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formErrorOptionObj: any
) => {
  const helpers = {
    errorMessage: getErrorMessageFn(formErrorOptionObj),
    formErrors: getErrorBagFn(emitter$),
    hookListeners: getHookListeners(formErrorOptionObj),
    noop: () => Symbol.for('form@error-provider[no-validation]'),
    ok: () => Symbol.for('form@error-provider[no-errors]'),
    validator: getValidatorFn(formErrorOptionObj),
    validatorInput: getInputFn(formErrorOptionObj),
    validatorPredicate: getPredicateFn(formErrorOptionObj)
  };

  const listener = (emitterInstance$: Emitter, optionsObj: any) => (
    formValues: any
  ) =>
    handler(
      formValues,
      Object.assign({}, optionsObj, {
        emitter$: emitterInstance$
      })
    );

  emitter$.on(
    'form@values',
    listener(emitter$, Object.assign({}, $formEl, formErrorOptionObj, helpers))
  );
  return true;
};

function handler(formValues: any, ctx: any) {
  isPlainObject(formValues) ||
    throwError('Invalid form values state obj; expected plain object');

  promisifyFunction(ctx.hooksListeners.start, formValues)
    .then(() => {
      return promisifyFunction(
        ctx.validatorPredicate,
        formValues,
        ctx.formErrors()
      );
    })
    .then((predicateResult?: any) => {
      return predicateResult
        ? promisifyFunction(ctx.validatorInput, formValues)
        : Promise.resolve(ctx.noop());
    })
    .then((validatorInput: any) => {
      return validatorInput === ctx.noop()
        ? Promise.resolve(ctx.noop())
        : promisifyFunction(ctx.validator, validatorInput, formValues);
    })
    .then((validationResult?: any) => {
      return validationResult === ctx.noop() || validationResult
        ? Promise.resolve(ctx.ok())
        : promisifyFunction(ctx.errorMessage, formValues, ctx.formErrors());
    })
    .then((validationErrorMessage?: any) => {
      if (validationErrorMessage !== ctx.ok()) {
        nonEmptyString(ctx.dispatch) ||
          throwError(
            "Invalid error provider 'dispatch' option value: expected a string"
          );
        const payload = {
          error: validationErrorMessage,
          type: ctx.dispatch
        };
        ctx.emitter$.emit('form@error', payload);
        return promisifyFunction(ctx.hooksListeners.end, payload.error);
      }
      return promisifyFunction(ctx.hooksListeners.end);
    })
    .then(() => true)
    .catch((error: Error) => {
      throwError(error);
    });
}

function getInputFn(options: any) {
  const valueType = (obj: any) => {
    if (isFunctionOrPromise(obj)) return 'is-function-or-promise';
    if (nonEmptyString(obj)) return 'is-string';
    if (
      Array.isArray(obj) &&
      obj.length &&
      obj.every((item: any) => nonEmptyString(item))
    ) {
      return 'is-array-of-string';
    }
  };

  switch (valueType(options.input)) {
    case 'is-string': {
      return (stateValues: any) =>
        getValueFromObject(stateValues, options.input);
    }
    case 'is-array-of-string': {
      return (stateValues: any) =>
        options.input.map((pathSelector: string) =>
          getValueFromObject(stateValues, pathSelector)
        );
    }
    case 'is-function-or-promise': {
      return options.input;
    }

    default: {
      throwError("Invalid error provider 'input' option value");
      return false;
    }
  }
}

function getPredicateFn(options: any) {
  return isFunctionOrPromise(options.predicate)
    ? options.predicate
    : Kcombinator(true);
}

function getValidatorFn(options: any) {
  return isFunctionOrPromise(options.validator)
    ? options.validator
    : Kcombinator(true);
}

function getErrorMessageFn(options: any) {
  const valueType = (obj: any) => {
    if (isFunctionOrPromise(obj)) return 'is-function-or-promise';
    if (nonEmptyString(obj)) return 'is-string';
  };

  switch (valueType(options.message)) {
    case 'is-string': {
      return Kcombinator(options.message);
    }

    case 'is-function-or-promise': {
      return options.message;
    }

    default: {
      throwError("Invalid error provider 'message' option value");
      return false;
    }
  }
}

function getErrorBagFn(formEmitterInstance$: Emitter) {
  let errorBag = null;
  formEmitterInstance$.on('form@errors', (payload: any) => {
    errorBag = payload;
  });

  return Kcombinator(errorBag);
}

function getHookListeners(options: any) {
  const hooks = Object.assign(
    {},
    { start: Icombinator, end: Icombinator },
    isPlainObject(options.hooks) || {}
  );

  return {
    end: isFunctionOrPromise(hooks.end) ? hooks.end : Icombinator,
    start: isFunctionOrPromise(hooks.start) ? hooks.start : Icombinator
  };
}
