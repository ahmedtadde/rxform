import { DOMFieldElementsType } from '@lib-types';
import { throwError } from '@src/utils/errors';
import { I as Icombinator, K as Kcombinator } from '@utils/combinators';
import {
  domSelectorAll,
  getFormFieldElementValue,
  isFormFieldElement
} from '@utils/dom';
import { isFunctionOrPromise, promisifyFunction } from '@utils/object';
import { Emitter } from 'mitt';

export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formValueOption: any
) => {
  const helpers = {
    parseAsArray: isValuesArray(formValueOption),
    parser: getParser(formValueOption),
    reducer: getReducer(formValueOption),
    transformer: getTransformer(formValueOption)
  };

  const listener = (
    emitterInstance$: Emitter,
    optionsObj: any,
    helperFnsObj: any
  ) => (evt: Event) =>
    handler(
      evt,
      Object.assign({}, optionsObj, helperFnsObj, {
        emitter$: emitterInstance$
      })
    );

  emitter$.on(
    `form@value-resolver-route[selector="${formValueOption.selector}"]`,
    listener(emitter$, Object.assign({}, $formEl, formValueOption), helpers)
  );

  return listener;
};

function handler(evt: Event, ctx: any) {
  const $targetElements = ctx.parseAsArray()
    ? (domSelectorAll(ctx.selector) as Element[])
    : [evt.target as Element];

  if (
    !$targetElements.length ||
    !$targetElements.every(($e: Element) => isFormFieldElement($e))
  ) {
    throwError(`Invalid target element(s) for selector ${ctx.selector}`);
  }

  if (!ctx.parseAsArray() && $targetElements.length !== 1) {
    throwError(
      `Invalid selector ${ctx.selector}; must target single form field element`
    );
  }

  parseValues(ctx.parser, $targetElements as DOMFieldElementsType[])
    .then(extractedValues => {
      return transformValues(ctx.transformer, extractedValues);
    })
    .then(transformedValues => {
      ctx.emitter$.emit('form@value', {
        path: ctx.path,
        value: ctx.parseAsArray() ? transformedValues : transformedValues[0]
      });
      return true;
    })
    .catch((error: Error) => {
      throwError(error);
    });
}

async function parseValues(parserFn: any, $elements: DOMFieldElementsType[]) {
  return Promise.all(
    $elements.map($el => {
      return promisifyFunction(parserFn, $el).then((extractedValue: any) => {
        const identifier =
          $el.name ||
          $el.id ||
          throwError(
            `Target element has no identifier (name/id on field): ${JSON.stringify(
              $el
            )}`
          );
        return { identifier, value: extractedValue };
      });
    })
  );
}

async function transformValues(transformerFn: any, extractedValues: any[]) {
  return Promise.all(
    extractedValues.map(extractedValue => {
      return promisifyFunction(transformerFn, extractedValue);
    })
  );
}

function getParser(options: any) {
  return isFunctionOrPromise(options.parser)
    ? options.parser
    : getFormFieldElementValue;
}

function getTransformer(options: any) {
  return isFunctionOrPromise(options.transformer)
    ? options.transformer
    : Icombinator;
}

function getReducer(options: any) {
  return isFunctionOrPromise(options.reducer)
    ? options.reducer
    : (formValuesObj: any, _: any) => formValuesObj;
}

function isValuesArray(options: any) {
  return Kcombinator(options.multiple === true);
}
