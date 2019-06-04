import { I as Icombinator } from '@utils/combinators';
import { getFormFieldElementValue } from '@utils/dom';
import {
  isFunction,
  isFunctionOrPromise,
  promisifyFunction
} from '@utils/object';
import { nonEmptyString, trim } from '@utils/string';

export default function config(options: any) {
  const { fields = {}, $form } = options;
  const reducer = (fieldNames: string[], formEl: HTMLFormElement) => (
    configs: any,
    [fieldName, fieldOptions]: [string, any]
  ) => {
    const fieldConfig = getFieldConfig(
      fieldName,
      Object.assign({}, fieldOptions, {
        $form: formEl,
        fields: fieldNames
      })
    );

    return Boolean(fieldConfig)
      ? Object.assign({}, configs, fieldConfig)
      : configs;
  };
  return Object.entries(fields).reduce(reducer(Object.keys(fields), $form), {});
}

function getFieldConfig(name: string, options: any) {
  const dependencies = getFieldDependencies(options);
  const parser = getFieldParser(options);
  const transformer = getFieldTransformer(options);
  return {
    [name]: {
      dependencies,
      parser,
      transformer
    }
  };
}

function getFieldDependencies(options: any) {
  const fields: string[] = options.fields;
  const dependencies: string[] = options.dependencies || [];
  const resolve = (fieldNames: string[], data: string[]) => {
    const predicate = (allAcceptedIdentifiers: string[]) => (
      identifier: any
    ) => {
      return (
        nonEmptyString(identifier) &&
        allAcceptedIdentifiers.includes(trim(identifier))
      );
    };
    const isValid = Array.isArray(data) && data.some(predicate(fieldNames));
    const result = isValid ? data.filter(predicate(fieldNames)) : [];

    return result.map(name => trim(name));
  };

  return resolve(fields, dependencies);
}

function getFieldParser(options: any) {
  return isFunction(options.parser) ? options.parser : getFormFieldElementValue;
}

function getFieldTransformer(options: any) {
  const transformer = isFunctionOrPromise(options.transformer)
    ? options.transformer
    : Icombinator;
  return (...args: any[]) => promisifyFunction(transformer, ...args);
}
