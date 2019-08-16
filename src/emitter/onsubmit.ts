import { FormStatusData } from "@lib-types";
import { K as Kcombinator } from "@utils/combinators";
import { throwError } from "@utils/errors";
import { log } from "@utils/logger";
import {
  deepFreeze,
  getValueFromObject,
  isFunctionOrPromise,
  isPlainObject,
  promisifyFunction
} from "@utils/object";
import { Emitter } from "mitt";
export default (
  _: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  const update = (target: "values" | "errors" | "status") => (payload: any) => {
    isPlainObject(payload) || throwError(`Invalid ${target}' state object`);
    emitter$.emit(`set-${target}`, payload);
  };

  const context = {
    dispatch: deepFreeze({
      errors: update("errors"),
      status: update("status"),
      values: update("values")
    }),
    errors: getFormErrorsStateFn(emitter$),
    handler: getFormSubmissionHandler(formOptions),
    status: getFormStatusStateFn(emitter$),
    values: getFormValuesStateFn(emitter$, formOptions)
  };

  const listener = (ctx: any) => (evt: Event) => handler(evt, ctx);
  emitter$.on(`form@submit`, listener(context));
  return emitter$;
};

function handler(_: any, ctx: any) {
  promisifyFunction(
    ctx.handler,
    ctx.values(),
    ctx.errors(),
    ctx.status(),
    ctx.dispatch
  )
    .then(() => true)
    .catch((error: Error) => {
      log.error("unexpected error occurred while running form submission");
      throwError(error);
    });
}

function getFormSubmissionHandler(options: any) {
  isFunctionOrPromise(options.onsubmit) ||
    throwError("Invalid form submission handler");
  return options.onsubmit;
}

function getFormValuesStateFn(formEmitterInstance$: Emitter, options: any) {
  let values = getInitialState(options);
  formEmitterInstance$.on("form@values", (payload: any) => {
    values = payload;
  });

  return Kcombinator(values);
}

function getFormErrorsStateFn(formEmitterInstance$: Emitter) {
  let errors = deepFreeze({});
  formEmitterInstance$.on("form@errors", (payload: any) => {
    errors = payload;
  });

  return Kcombinator(errors);
}

function getFormStatusStateFn(formEmitterInstance$: Emitter) {
  let status = deepFreeze({ fields: {}, submitting: false }) as Readonly<
    FormStatusData
  >;

  formEmitterInstance$.on("form@status", (payload: FormStatusData) => {
    status = payload;
  });

  return Kcombinator(status);
}

function getInitialState(options: any) {
  const state = getValueFromObject(options, "values.state");
  return isPlainObject(state)
    ? deepFreeze(state)
    : throwError("Invalid initial values' state");
}
