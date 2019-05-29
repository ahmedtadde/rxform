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
  return {
    [name]: {
      dependencies: getFieldDependencies(options)
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
