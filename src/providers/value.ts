import { DOMFieldElementsType, FormStatus } from '@lib-types';
import { throwError } from '@src/utils/errors';
import { I as Icombinator, K as Kcombinator } from '@utils/combinators';
import {
  domSelectorAll,
  getFormFieldElementValue,
  isFormFieldElement
} from '@utils/dom';
import { not } from '@utils/logic';
import {
  isBoolean,
  isFunctionOrPromise,
  isPlainObject,
  nonEmptyArray,
  nonEmptyString,
  promisifyFunction
} from '@utils/object';

import { Emitter } from 'mitt';

export default (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  formValueOptions: any
) => {
  const standardizedFormValueOptions = standardizeFormValueOptions(
    formValueOptions
  );
  const helpers = {
    formStatus: getStatusFn(emitter$),
    hookListeners: getHookListeners(standardizedFormValueOptions),
    parseAsArray: isValuesArray(standardizedFormValueOptions),
    parser: getParser(standardizedFormValueOptions),
    transformer: getTransformer(standardizedFormValueOptions)
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
    `form@provider[selector="${ standardizedFormValueOptions.selector }"]`,
    listener(
      emitter$,
      Object.assign({}, $formEl, standardizedFormValueOptions),
      helpers
    )
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
    throwError(`Invalid target element(s) for selector ${ ctx.selector }`);
  }

  if (!ctx.parseAsArray() && $targetElements.length !== 1) {
    throwError(
      `Invalid selector ${ ctx.selector }; must target single form field element`
    );
  }

  const formStatus = ctx.formStatus();
  if (not(formStatus.submitting)) {
    promisifyFunction(ctx.hookListeners.start, evt)
      .then(() => {
        return parseValues(
          ctx.parser,
          $targetElements as DOMFieldElementsType[]
        );
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
        return promisifyFunction(ctx.hookListeners.end, payload);
      })
      .then(() => true)
      .catch((error: Error) => {
        throwError(error);
      });
  }
}

async function parseValues(parserFn: any, $elements: DOMFieldElementsType[]) {
  return Promise.all(
    $elements.map($el => {
      return promisifyFunction(parserFn, $el).then((extractedValue: any) => {
        const name =
          $el.name ||
          throwError(
            `Target element has no name attribute: ${ JSON.stringify($el) }`
          );
        return { name, value: extractedValue };
      });
    })
  );
}

async function transformValues(transformerFn: any, extractedValues: any[]) {
  return Promise.all(
    extractedValues.map((extractedValue: any) => {
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

function isValuesArray(options: any) {
  return Kcombinator(options.multiple === true);
}

function standardizeFormValueOptions(options: any) {
  const optionsType = (obj: any) => {
    if (nonEmptyString(obj)) return 'is-string';
    if (isPlainObject(obj)) return 'is-plain-object';
    if (
      Array.isArray(obj) &&
      nonEmptyArray(
        obj
          .slice(0, 3)
          .filter((item: any) => nonEmptyString(item) || isBoolean(item))
      )
    ) {
      return 'is-array';
    }
  };

  switch (optionsType(options)) {
    case 'is-string': {
      return { selector: options };
    }

    case 'is-plain-object': {
      return options;
    }

    case 'is-array': {
      if (options.length === 1) {
        return { selector: options[0] };
      } else if (options.length === 2) {
        return Object.assign(
          {},
          { selector: options[0] },
          nonEmptyString(options[1])
            ? { dispatch: options[1] }
            : { multiple: Boolean(options[1]) }
        );
      } else if (options.length === 3) {
        return {
          dispatch: options[1],
          multiple: Boolean(options[2]),
          selector: options[0]
        };
      } else {
        throwError(`Invalid value provider option`);
      }
    }
  }
}

function getStatusFn(formEmitterInstance$: Emitter) {
  let status = {
    fields: {},
    submitting: false
  };
  formEmitterInstance$.on('form@status', (payload: FormStatus) => {
    status = payload;
  });

  return () => status;
}
