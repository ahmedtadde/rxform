import { getFormElement } from '@utils/dom';
import { not, toBool } from '@utils/logic';
import {
  isBoolean,
  isFunction,
  isPlainObject,
  nonEmptyArray,
  nonEmptyPlainObject,
  nonEmptyString
} from '@utils/object';
export default function formOptionsValidator(model: any) {
  return model;
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
    return { errors: null, target: target.trim() };
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
      if (nonEmptyPlainObject(obj)) return 'is-plain-object';
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
        return { errors: null, provider: { selector: input } };
      }

      case 'is-plain-object': {
        return { errors: null, provider: input };
      }

      case 'is-array': {
        if (input.length === 1) {
          return { errors: null, provider: { selector: input[0] } };
        } else if (input.length === 2) {
          return {
            errors: null,
            provider: Object.assign(
              {},
              { selector: input[0] },
              nonEmptyString(input[1])
                ? { dispatch: input[1] }
                : { multiple: toBool(input[1]) }
            )
          };
        } else if (input.length === 3) {
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
            `In values config, provider ${providerIdx} is invalid. Expected a  non empty string, a non empty array, or non empty plain object`
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
