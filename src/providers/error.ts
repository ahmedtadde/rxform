import { FormStatusData } from "@lib-types";
import { I as Icombinator, K as Kcombinator } from "@utils/combinators";
import { throwError } from "@utils/errors";
import { not } from "@utils/logic";
import {
  deepFreeze,
  getValueFromObject,
  isFunctionOrPromise,
  isPlainObject,
  nonEmptyArray,
  nonEmptyString,
  promisifyFunction
} from "@utils/object";
import { Emitter } from "mitt";
export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formErrorOptionObj: any
) => {
  const helpers = {
    errorMessage: getErrorMessageFn(formErrorOptionObj),
    formErrors: getErrorBagFn(emitter$),
    formStatus: getStatusFn(emitter$),
    hookListeners: getHookListeners(formErrorOptionObj),
    noop: () => Symbol.for("form@error-provider[no-validation]"),
    ok: () => Symbol.for("form@error-provider[no-errors]"),
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
    "form@values",
    listener(emitter$, Object.assign({}, $formEl, formErrorOptionObj, helpers))
  );
  return true;
};

function handler(formValues: any, ctx: any) {
  isPlainObject(formValues) ||
    throwError("Invalid form values state obj; expected plain object");
  const formErrors = ctx.formErrors();
  const formStatus = ctx.formStatus();
  if (not(formStatus.submitting)) {
    let validatorInput: any;
    promisifyFunction(
      ctx.hookListeners.start,
      formValues,
      formErrors,
      formStatus
    )
      .then(() => {
        return promisifyFunction(
          ctx.validatorPredicate,
          formValues,
          formErrors,
          formStatus
        );
      })
      .then((predicateResult?: any) => {
        return predicateResult
          ? promisifyFunction(
              ctx.validatorInput,
              formValues,
              formErrors,
              formStatus
            )
          : Promise.resolve(ctx.noop());
      })
      .then((input: any) => {
        validatorInput = deepFreeze(input);
        return validatorInput === ctx.noop()
          ? Promise.resolve(ctx.noop())
          : promisifyFunction(
              ctx.validator,
              validatorInput,
              formValues,
              formErrors,
              formStatus
            );
      })
      .then((validationResult?: any) => {
        return validationResult === ctx.noop() ||
          Boolean(validationResult) === true
          ? Promise.resolve(ctx.ok())
          : promisifyFunction(
              ctx.errorMessage,
              validatorInput,
              formValues,
              formErrors,
              formStatus
            );
      })
      .then((validationErrorMessage?: any) => {
        nonEmptyString(ctx.dispatch) ||
          throwError(
            "Invalid error provider 'dispatch' option value: expected a string"
          );
        if (validationErrorMessage === ctx.ok()) {
          const payload = deepFreeze({
            error: null,
            type: ctx.dispatch
          });
          ctx.emitter$.emit("form@error", payload);
          return promisifyFunction(ctx.hookListeners.end, payload);
        } else {
          const payload = deepFreeze({
            error: {
              context: {
                errors: formErrors,
                input: validatorInput,
                status: formStatus,
                values: formValues
              },
              message: validationErrorMessage
            },
            type: ctx.dispatch
          });
          ctx.emitter$.emit("form@error", payload);
          return promisifyFunction(ctx.hookListeners.end, payload);
        }
      })
      .then(() => true)
      .catch((error: Error) => {
        throwError(error);
      });
  }
}

function getInputFn(options: any) {
  const valueType = (obj: any) => {
    if (isFunctionOrPromise(obj)) return "is-function-or-promise";
    if (nonEmptyString(obj)) return "is-string";
    if (
      Array.isArray(obj) &&
      nonEmptyArray(obj.filter((item: any) => nonEmptyString(item)))
    ) {
      return "is-array-of-string";
    }
  };

  switch (valueType(options.input)) {
    case "is-string": {
      return (stateValues: any) =>
        getValueFromObject(stateValues, options.input);
    }
    case "is-array-of-string": {
      return (stateValues: any) =>
        options.input.map((pathSelector: string) =>
          getValueFromObject(stateValues, pathSelector)
        );
    }
    case "is-function-or-promise": {
      return options.input;
    }

    default: {
      return Icombinator;
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
    if (isFunctionOrPromise(obj)) return "is-function-or-promise";
    if (nonEmptyString(obj)) return "is-string";
  };

  switch (valueType(options.message)) {
    case "is-string": {
      return Kcombinator(options.message);
    }

    case "is-function-or-promise": {
      return options.message;
    }

    default: {
      nonEmptyString(options.dispatch) ||
        throwError(
          "Invalid error provider 'dispatch' option value: expected a string"
        );

      return Kcombinator(`"${options.dispatch}" error(s)`);
    }
  }
}

function getErrorBagFn(formEmitterInstance$: Emitter) {
  let errorBag = deepFreeze({});
  formEmitterInstance$.on("form@errors", (payload: any) => {
    errorBag = payload;
  });

  return Kcombinator(errorBag);
}

function getStatusFn(formEmitterInstance$: Emitter) {
  let status = deepFreeze({
    fields: {},
    submitting: false
  }) as Readonly<FormStatusData>;

  formEmitterInstance$.on("form@status", (payload: FormStatusData) => {
    status = payload;
  });

  return Kcombinator(status);
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
