import { Option, none, some, is, from } from "@/datatypes/Option";
import { FormFieldType, Primitive } from "./types";

export const isString = (x: unknown): x is string => typeof x === "string";
export const isNonEmptyString = (x: unknown): x is string =>
  Boolean(isString(x) && x.trim().length);

export const isRegExp = (x: unknown): x is RegExp =>
  Object.prototype.toString.call(x) === "[object RegExp]";

export const string = {
  type: isString,
  optional: (x: unknown, strict?: boolean): Option<string> => {
    if (isString(x)) {
      return strict ? (isNonEmptyString(x) ? some(x) : none) : some(x);
    }
    return none;
  },
  is: {
    nonempty: isNonEmptyString,
    empty: (x: unknown): boolean => !isNonEmptyString(x)
  },
  equals: (x: unknown, y: unknown): boolean => {
    const _x = string.optional(x, true);
    const _y = string.optional(y, true);
    return (
      (is.none(_x) && is.none(_y)) ||
      (is.some(_x) && is.some(_y) && _x.value === _y.value)
    );
  }
};

export const array = {
  type: Array.isArray,
  optional: (x: unknown, strict?: boolean): Option<unknown[]> => {
    if (Array.isArray(x)) {
      return strict ? (array.is.nonempty(x) ? some(x) : none) : some(x);
    }
    return none;
  },
  is: {
    empty: (x: unknown[]): boolean => Boolean(x.length),
    nonempty: (x: unknown[]): boolean => !x.length
  }
};

export const struct = {
  type: (x: unknown): boolean => {
    return (
      typeof x === "object" &&
      x !== null &&
      !array.type(x) &&
      x.constructor.name === "Object"
    );
  }
};

export const $el = {
  $form: (x: unknown): Option<HTMLFormElement> => {
    if ($el.is.form(x)) return some(x);
    if (is.none(string.optional(x, true))) return none;
    const $form = from.nullable(
      document.querySelector(`form#${(x as string).trim()}`)
    );
    if (is.none($form)) return none;
    if (!$el.is.form($form.value)) return none;

    return some($form.value);
  },
  $field: (x: unknown, y?: unknown): Option<FormFieldType> => {
    if ($el.is.field(x)) return some(x);
    if (is.none(string.optional(x, true))) return none;
    const _y = string.is.nonempty(y) ? `form#${y.trim()}` : "form";

    const $field = from.nullable(
      document.querySelector(`${_y} input[name="${(x as string).trim()}"]`) ||
        document.querySelector(
          `${_y} select[name="${(x as string).trim()}"]`
        ) ||
        document.querySelector(`${_y} textarea[name="${(x as string).trim()}"]`)
    );
    if (is.none($field)) return none;
    if (!$el.is.field($field.value)) return none;

    return some($field.value);
  },
  $fieldform: (x: unknown): Option<HTMLFormElement> => {
    if ($el.is.form(x)) return some(x);
    const $field = $el.$field(x);
    if (is.none($field)) return none;
    if (!$el.is.field($field.value)) return none;
    if (!$el.is.form($field.value.form)) return none;
    return some($field.value.form);
  },
  fieldname: (x: unknown): Option<string> => {
    return $el.is.field(x) && is.some(string.optional(x.name, true))
      ? some(x.name.trim())
      : none;
  },
  fieldvalue: (x: unknown): Option<Primitive | Primitive[]> => {
    return $el.is.field(x) && is.none(string.optional(x.value, true))
      ? some(x.value)
      : none;
  },
  is: {
    form: (x: unknown): x is HTMLFormElement => x instanceof HTMLFormElement,
    field: (x: unknown): x is FormFieldType =>
      $el.is.input(x) || $el.is.select(x) || $el.is.textarea(x),
    input: (x: unknown): x is HTMLInputElement => x instanceof HTMLInputElement,
    inputof: (x: unknown, type: string): x is HTMLInputElement =>
      x instanceof HTMLInputElement && x.type === type.trim(),
    fileinput: (x: unknown): x is HTMLInputElement =>
      x instanceof HTMLInputElement && x.type === "file",
    select: (x: unknown): x is HTMLSelectElement =>
      x instanceof HTMLSelectElement,
    singleselect: (x: unknown): x is HTMLSelectElement =>
      $el.is.select(x) && !x.multiple,
    multiselect: (x: unknown): x is HTMLSelectElement =>
      $el.is.select(x) && x.multiple,
    textarea: (x: unknown): x is HTMLTextAreaElement =>
      x instanceof HTMLTextAreaElement
  }
};

export const fn = {
  type: (x: unknown): x is Function =>
    typeof x === "function" && x instanceof Function
};
