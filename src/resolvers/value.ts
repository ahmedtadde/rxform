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
    hooksListeners: getHookListeners(formValueOption),
    parseAsArray: isValuesArray(formValueOption),
    parser: getParser(formValueOption),
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

  promisifyFunction(ctx.hooksListeners.start, evt)
    .then(() => {
      return parseValues(ctx.parser, $targetElements as DOMFieldElementsType[]);
    })
    .then(extractedValues => {
      return transformValues(ctx.transformer, extractedValues);
    })
    .then(transformedValues => {
      const payload = {
        type: ctx.dispatch || ctx.selector,
        value: ctx.parseAsArray() ? transformedValues : transformedValues[0]
      };
      ctx.emitter$.emit('form@value', payload);
      return promisifyFunction(ctx.hooksListeners.end, payload.value);
    })
    .then(() => true)
    .catch((error: Error) => {
      throwError(error);
    });
}

async function parseValues(parserFn: any, $elements: DOMFieldElementsType[]) {
  return Promise.all(
    $elements.map($el => {
      return promisifyFunction(parserFn, $el).then((extractedValue: any) => {
        const name =
          $el.name ||
          throwError(
            `Target element has no name attribute: ${JSON.stringify($el)}`
          );
        return { name, value: extractedValue };
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
    : (extractedValue: { name: string; value: any }) => extractedValue.value;
}

function getHookListeners(options: any) {
  return Object.keys(options.hooks).reduce((listeners: any, hook: string) => {
    const listener = isFunctionOrPromise(options.hooks[hook])
      ? options.hooks[hook]
      : Icombinator;
    return Object.assign({}, listeners, { [hook]: listener });
  }, {});
}

function isValuesArray(options: any) {
  return Kcombinator(options.multiple === true);
}
