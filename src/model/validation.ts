import { getFormElement } from '@utils/dom';
import { not, toBool } from '@utils/logic';
import {
  isBoolean,
  isFunction,
  isPlainObject,
  nonEmptyArray,
  nonEmptyPlainObject,
  nonEmptyString,
  trim
} from '@utils/object';

export default function formOptionsValidator(model: any) {
  const validators = [
    { prop: 'target', fn: checkDOMTarget },
    { prop: 'values', fn: checkValues },
    { prop: 'errors', fn: checkErrors },
    { prop: 'onsubmit', fn: checkFormSubmissionHandler }
  ];

  return validators.reduce(
    (validationResult, validator) => {
      const validation = validator.fn(model);

      if (nonEmptyArray(validation.errors)) {
        return Object.assign({}, validationResult, {
          errors: (validationResult.errors as string[]).concat(
            validation.errors as string[]
          )
        });
      }

      const setModelProp = (prop: string) =>
        prop === 'errorsConfig' ? 'errors' : prop;

      return Object.assign({}, validationResult, {
        model: {
          ...model,
          [setModelProp(validator.prop)]:
            // @ts-ignore
            validation[validator.prop]
        }
      });
    },
    { model: {}, errors: [] }
  );
}

function checkDOMTarget(model: any) {
  const { target = '' } = isPlainObject(model) ? model : {};
  if (not(nonEmptyString(target))) {
    return {
      errors: ['Invalid target DOM selector. Expected a non empty string'],
      target: null
    };
  }

  try {
    getFormElement(target);
    return { errors: null, target: trim(target) };
  } catch (error) {
    return {
      errors: ['Invalid target DOM selector. No form element matched.'],
      target: null
    };
  }
}

function checkFormSubmissionHandler(model: any) {
  const { onsubmit = null } = isPlainObject(model) ? model : {};

  if (not(isFunction(onsubmit))) {
    return {
      errors: ['Invalid form submission handler. Expected a function'],
      onsubmit: null
    };
  }

  return {
    errors: null,
    onsubmit
  };
}

// tslint:disable-next-line: max-func-body-length
function checkValues(model: any) {
  const { values = {} } = isPlainObject(model) ? model : {};

  const initialStateValidation = checkInitialState(values);
  const providersValidation = checkProviders(values);
  const reducerValidation = checkReducer(values);

  if (
    nonEmptyArray(initialStateValidation.errors) ||
    nonEmptyArray(providersValidation.errors) ||
    nonEmptyArray(reducerValidation.errors)
  ) {
    return {
      errors: ([] as string[])
        .concat(
          nonEmptyArray(initialStateValidation.errors)
            ? (initialStateValidation.errors as string[])
            : []
        )
        .concat(
          nonEmptyArray(providersValidation.errors)
            ? (providersValidation.errors as string[])
            : []
        )
        .concat(
          nonEmptyArray(reducerValidation.errors)
            ? (reducerValidation.errors as string[])
            : []
        ),
      values: null
    };
  }

  return {
    errors: null,
    values: {
      providers: providersValidation.providers,
      reducer: reducerValidation.reducer,
      state: initialStateValidation.state
    }
  };

  function checkInitialState(input: any) {
    const { state = {} } = isPlainObject(input) ? input : {};
    if (not(nonEmptyPlainObject(state))) {
      return {
        errors: [
          'In values config, initial state is invalid. Expected a non empty plain object'
        ],
        state: null
      };
    }

    return {
      errors: null,
      state
    };
  }

  function checkProviders(input: any) {
    const { providers = [] } = isPlainObject(input) ? input : {};
    if (not(nonEmptyArray(providers))) {
      return {
        errors: [
          'In values config, providers is invalid. Expected a non empty array'
        ],
        providers: null
      };
    }

    const validation = providers.reduce(
      (
        result: { errors: string[]; providers: any[] },
        providerConfig: any,
        idx: number
      ) => {
        const { errors, provider } = checkProvider(providerConfig);
        if (errors || !provider) {
          return Object.assign({}, result, {
            errors: result.errors.concat(
              errors
                ? errors(idx + 1)
                : `In values config, provider ${idx + 1} is invalid.`
            )
          });
        }

        return Object.assign({}, result, {
          providers: result.providers.concat(provider)
        });
      },
      { errors: [], providers: [] }
    );

    if (nonEmptyArray(validation.errors)) {
      return {
        errors: validation.errors,
        providers: null
      };
    }

    return {
      errors: null,
      providers: validation.providers
    };
  }

  function checkProvider(input: any) {
    const optionsType = (obj: any) => {
      if (nonEmptyString(obj)) return 'is-string';
      if (nonEmptyPlainObject(obj) && nonEmptyString(obj.selector)) {
        return 'is-plain-object';
      }
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

    switch (optionsType(input)) {
      case 'is-string': {
        return { errors: null, provider: { selector: trim(input) } };
      }

      case 'is-plain-object': {
        return {
          errors: null,
          provider: { ...input, selector: trim(input.selector) }
        };
      }

      case 'is-array': {
        if (input.length === 1 && nonEmptyString(input[0])) {
          return { errors: null, provider: { selector: trim(input[0]) } };
        } else if (input.length === 2 && nonEmptyString(input[0])) {
          return {
            errors: null,
            provider: Object.assign(
              { selector: input[0] },
              nonEmptyString(input[1])
                ? { dispatch: input[1] }
                : { multiple: toBool(input[1]) }
            )
          };
        } else if (
          input.length === 3 &&
          nonEmptyString(input[0]) &&
          nonEmptyString(input[1])
        ) {
          return {
            errors: null,
            provider: {
              dispatch: input[1],
              multiple: toBool(input[2]),
              selector: input[0]
            }
          };
        } else {
          return {
            errors: (providerIdx: number) => [
              `In values config, provider ${providerIdx} is invalid. Array config is malformed`
            ],
            provider: null
          };
        }
      }

      default: {
        return {
          errors: (providerIdx: number) => [
            `In values config, provider ${providerIdx} is invalid. Provider can be declared using a string (selector), an array [selector, (dispatch | multiple)?, multiple?], or a plain object {selector, dispatch?, events?, transformer?}`
          ],
          provider: null
        };
      }
    }
  }

  function checkReducer(input: any) {
    const { reducer = null } = isPlainObject(input) ? input : {};

    if (not(isFunction(reducer))) {
      return {
        errors: ['In values config, reducer is invalid. Expected a function'],
        reducer: null
      };
    }

    return {
      errors: null,
      reducer
    };
  }
}

// tslint:disable-next-line: max-func-body-length
function checkErrors(model: any) {
  const { errors: errorsConfig = {} } = isPlainObject(model) ? model : {};
  const initialStateValidation = checkInitialState(errorsConfig);
  const providersValidation = checkProviders(errorsConfig);
  const reducerValidation = checkReducer(errorsConfig);

  if (
    nonEmptyArray(initialStateValidation.errors) ||
    nonEmptyArray(providersValidation.errors) ||
    nonEmptyArray(reducerValidation.errors)
  ) {
    return {
      errors: ([] as string[])
        .concat(
          nonEmptyArray(initialStateValidation.errors)
            ? (initialStateValidation.errors as string[])
            : []
        )
        .concat(
          nonEmptyArray(providersValidation.errors)
            ? (providersValidation.errors as string[])
            : []
        )
        .concat(
          nonEmptyArray(reducerValidation.errors)
            ? (reducerValidation.errors as string[])
            : []
        ),
      values: null
    };
  }

  return {
    errors: null,
    errorsConfig: {
      providers: providersValidation.providers,
      reducer: reducerValidation.reducer,
      state: initialStateValidation.state
    }
  };

  function checkInitialState(input: any) {
    const { state = {} } = isPlainObject(input) ? input : {};
    if (not(nonEmptyPlainObject(state))) {
      return {
        errors: [
          'In errors config, initial state is invalid. Expected a non empty plain object or nothing at all'
        ],
        state: null
      };
    }

    return {
      errors: null,
      state
    };
  }

  function checkProviders(input: any) {
    const { providers = [] } = isPlainObject(input) ? input : {};
    if (not(nonEmptyArray(providers))) {
      return {
        errors: [
          'In errors config, providers is invalid. Expected a non empty array'
        ],
        providers: null
      };
    }

    const validation = providers.reduce(
      (
        result: { errors: string[]; providers: any[] },
        providerConfig: any,
        idx: number
      ) => {
        const { errors, provider } = checkProvider(providerConfig);
        if (errors || !provider) {
          return Object.assign({}, result, {
            errors: result.errors.concat(
              errors
                ? errors(idx + 1)
                : `In errors config, provider ${idx + 1} is invalid.`
            )
          });
        }

        return Object.assign({}, result, {
          providers: result.providers.concat(provider)
        });
      },
      { errors: [], providers: [] }
    );

    if (nonEmptyArray(validation.errors)) {
      return {
        errors: validation.errors,
        providers: null
      };
    }

    return {
      errors: null,
      providers: validation.providers
    };
  }

  function checkProvider(input: any) {
    const optionsType = (obj: any) => {
      if (nonEmptyString(obj)) return 'is-string';
      if (nonEmptyPlainObject(obj) && nonEmptyString(obj.dispatch)) {
        return 'is-plain-object';
      }

      if (
        Array.isArray(obj) &&
        obj
          .slice(0, 3)
          .filter((item: any) => nonEmptyString(item) || isFunction(item))
          .length === 3
      ) {
        return 'is-array';
      }
    };

    switch (optionsType(input)) {
      case 'is-string': {
        return { errors: null, provider: { dispatch: trim(input) } };
      }

      case 'is-plain-object': {
        return {
          errors: null,
          provider: { ...input, dispatch: trim(input.dispatch) }
        };
      }

      case 'is-array': {
        if (
          nonEmptyString(input[0]) &&
          isFunction(input[1]) &&
          (isFunction(input[2]) || nonEmptyString(input[2]))
        ) {
          return {
            errors: null,
            provider: {
              dispatch: input[0],
              message: input[2],
              validator: input[1]
            }
          };
        } else {
          return {
            errors: (providerIdx: number) => [
              `In errors config, provider ${providerIdx} is invalid. Array config is malformed`
            ],
            provider: null
          };
        }
      }

      default: {
        return {
          errors: (providerIdx: number) => [
            `In errors config, provider ${providerIdx} is invalid. Provider can   be declared using a string (dispatch), an array [dispatch (string), validator (function), message (string | function)], or a plain  object {dispatch, input?, message?, predicate?, validator?}`
          ],
          provider: null
        };
      }
    }
  }

  function checkReducer(input: any) {
    const { reducer = null } = isPlainObject(input) ? input : {};

    if (not(isFunction(reducer))) {
      return {
        errors: ['In errors config, reducer is invalid. Expected a function'],
        reducer: null
      };
    }

    return {
      errors: null,
      reducer
    };
  }
}
