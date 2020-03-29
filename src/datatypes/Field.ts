import { FORM_FIELD_TAG } from "@/config";
import { FormFieldType } from "@/util/types";
import { Option, match as optionmatch, is } from "@datatypes/Option";
import { string, $el } from "@util/operators";

export type FormFieldValidity = Readonly<Error>[];
export type FormFieldValueObject =
  | TextField
  | TextareaField
  | HiddenField
  | SearchField
  | NumberField
  | EmailField
  | PasswordField
  | CheckboxField
  | RadioField
  | ColorField
  | DateField
  | DatetimeLocalField
  | TimeField
  | WeekField
  | MonthField
  | RangeField
  | FileField
  | URLField
  | TelephoneField
  | SingleSelectField
  | MultipleSelectField
  | NilField;

export const FieldFactoryMap = new Map<string, FormFieldValueObject>();

export class TextField {
  readonly tag = FORM_FIELD_TAG.INPUT_TEXT;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class TextareaField {
  readonly tag = FORM_FIELD_TAG.TEXTAREA;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class HiddenField {
  readonly tag = FORM_FIELD_TAG.INPUT_HIDDEN;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class SearchField {
  readonly tag = FORM_FIELD_TAG.INPUT_SEARCH;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class NumberField {
  readonly tag = FORM_FIELD_TAG.INPUT_NUMBER;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class EmailField {
  readonly tag = FORM_FIELD_TAG.INPUT_EMAIL;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class PasswordField {
  readonly tag = FORM_FIELD_TAG.INPUT_PASSWORD;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class CheckboxField {
  readonly tag = FORM_FIELD_TAG.INPUT_CHECKBOX;
  constructor(
    readonly name: string,
    readonly value: ReadonlyArray<string>,
    readonly validity: FormFieldValidity
  ) {}
}

export class RadioField {
  readonly tag = FORM_FIELD_TAG.INPUT_RADIO;
  constructor(
    readonly name: string,
    readonly value: ReadonlyArray<string>,
    readonly validity: FormFieldValidity
  ) {}
}

export class ColorField {
  readonly tag = FORM_FIELD_TAG.INPUT_RADIO;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class DateField {
  readonly tag = FORM_FIELD_TAG.INPUT_DATE;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class DatetimeLocalField {
  readonly tag = FORM_FIELD_TAG.INPUT_DATETIME_LOCAL;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class MonthField {
  readonly tag = FORM_FIELD_TAG.INPUT_MONTH;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class WeekField {
  readonly tag = FORM_FIELD_TAG.INPUT_WEEK;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class TimeField {
  readonly tag = FORM_FIELD_TAG.INPUT_TIME;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class FileField {
  readonly tag = FORM_FIELD_TAG.INPUT_FILE;
  constructor(
    readonly name: string,
    readonly value: ReadonlyArray<File>,
    readonly validity: FormFieldValidity
  ) {}
}

export class TelephoneField {
  readonly tag = FORM_FIELD_TAG.INPUT_TEL;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class URLField {
  readonly tag = FORM_FIELD_TAG.INPUT_URL;
  constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class RangeField {
  readonly tag = FORM_FIELD_TAG.INPUT_RANGE;
  constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class SingleSelectField {
  readonly tag = FORM_FIELD_TAG.SELECT_SINGLE;
  constructor(
    readonly name: string,
    readonly value: ReadonlyArray<string>,
    readonly validity: FormFieldValidity
  ) {}
}
export class MultipleSelectField {
  readonly tag = FORM_FIELD_TAG.SELECT_MULTIPLE;
  constructor(
    readonly name: string,
    readonly value: ReadonlyArray<string>,
    readonly validity: FormFieldValidity
  ) {}
}

export class NilField {
  readonly tag = FORM_FIELD_TAG.NIL;
  readonly name = "";
  readonly value = "";
  readonly validity: FormFieldValidity = [];
}

function getvalidity($target: FormFieldType): FormFieldValidity {
  const message = $target.validationMessage;
  return string.is.nonempty(message)
    ? ([new Error(message.trim())] as FormFieldValidity)
    : ([] as FormFieldValidity);
}

function getvalue(
  $form: HTMLFormElement,
  $target: FormFieldType
): string | number | ReadonlyArray<string> | ReadonlyArray<File> {
  const fieldname = optionmatch<string, string, string>(
    () => "",
    (value) => value
  )($el.fieldname($target));

  const fieldtag = `${$target.tagName.toLowerCase()}:${$target.type}`;

  switch (fieldtag) {
    case FORM_FIELD_TAG.INPUT_TEXT:
    case FORM_FIELD_TAG.INPUT_SEARCH:
    case FORM_FIELD_TAG.INPUT_EMAIL:
    case FORM_FIELD_TAG.INPUT_COLOR:
    case FORM_FIELD_TAG.TEXTAREA:
    case FORM_FIELD_TAG.INPUT_HIDDEN: {
      return $target.value.trim();
    }
    case FORM_FIELD_TAG.INPUT_PASSWORD: {
      return $target.value;
    }
    case FORM_FIELD_TAG.SELECT_SINGLE:
    case FORM_FIELD_TAG.SELECT_MULTIPLE: {
      if ($el.is.select($target)) {
        return Object.freeze(
          Array.from($target.selectedOptions).map(
            (opt: HTMLOptionElement) => opt.value
          )
        );
      }
      return Object.freeze([]);
    }
    case FORM_FIELD_TAG.INPUT_NUMBER:
    case FORM_FIELD_TAG.INPUT_RANGE: {
      return Number($target.value.trim());
    }
    case FORM_FIELD_TAG.INPUT_URL: {
      try {
        return new URL($target.value.trim()).href.trim();
      } catch (error) {
        console.warn(
          "[RxForm] Failed to decode url input field value into URL object",
          $target.value,
          error
        );
        return $target.value.trim();
      }
    }
    case FORM_FIELD_TAG.INPUT_TEL: {
      return $target.value.trim().replace(/\D/g, "");
    }
    case FORM_FIELD_TAG.INPUT_FILE: {
      if ($el.is.inputof($target, "file")) {
        const files = $target.files;
        return files
          ? Object.freeze(
              Array.from(Array(files.length).keys()).reduce(
                (list: File[], fileidx: number) => {
                  const file = files.item(fileidx);
                  if (file) {
                    return list.concat(file);
                  }
                  return list;
                },
                [] as File[]
              )
            )
          : Object.freeze([] as File[]);
      }
      return Object.freeze([] as File[]);
    }
    case FORM_FIELD_TAG.INPUT_DATE:
    case FORM_FIELD_TAG.INPUT_DATETIME_LOCAL:
    case FORM_FIELD_TAG.INPUT_TIME:
    case FORM_FIELD_TAG.INPUT_WEEK: {
      if ($el.is.input($target)) {
        return $target.valueAsNumber;
      }
      return Number.NaN;
    }
    case FORM_FIELD_TAG.INPUT_MONTH: {
      try {
        return new Date(`${$target.value}-1`).getTime();
      } catch (error) {
        console.error(
          "[RxForm] Failed to decode month input field value into number",
          error
        );
        return Number.NaN;
      }
    }
    case FORM_FIELD_TAG.INPUT_RADIO:
    case FORM_FIELD_TAG.INPUT_CHECKBOX: {
      const fieldtype = fieldtag.split(":")[1];

      if ($el.is.inputof($target, fieldtype)) {
        const $checked = $form.querySelectorAll(
          `input[type='${fieldtype}'][name='${fieldname}']:checked`
        );

        return Object.freeze(
          Array.from($checked).reduce((checkedlist: string[], $node, idx) => {
            if ($el.is.inputof($node, fieldtype)) {
              return checkedlist.concat(
                string.is.nonempty($node.value)
                  ? $node.value
                  : `${fieldname}[${idx}]`
              );
            }
            return checkedlist;
          }, [])
        );
      }
      return Object.freeze([]) as ReadonlyArray<string>;
    }
    default: {
      return "";
    }
  }
}

export function create(
  $form: Option<HTMLFormElement>,
  $target: Option<FormFieldType>
): FormFieldValueObject {
  if (is.none($form)) return new NilField();
  const _$form = $el.is.form($form.value) ? $form.value : false;
  if (!_$form) return new NilField();
  if (is.none($target)) return new NilField();
  const _$target = $el.is.field($target.value) ? $target.value : false;
  if (!_$target) return new NilField();

  const name = _$target.name;
  const tag = `${_$target.tagName.toLowerCase()}:${_$target.type}`;
  const value = getvalue(_$form, _$target);
  const validity = getvalidity(_$target);

  console.debug(
    "field creation... name, tag, value, validity",
    name,
    tag,
    value,
    validity
  );

  switch (tag) {
    case FORM_FIELD_TAG.INPUT_TEXT: {
      return new TextField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_SEARCH: {
      return new SearchField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_EMAIL: {
      return new EmailField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_COLOR: {
      return new ColorField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.TEXTAREA: {
      return new TextareaField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_HIDDEN: {
      return new HiddenField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_PASSWORD: {
      return new PasswordField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.SELECT_SINGLE: {
      return new SingleSelectField(
        name,
        value as ReadonlyArray<string>,
        validity
      );
    }
    case FORM_FIELD_TAG.SELECT_MULTIPLE: {
      return new MultipleSelectField(
        name,
        value as ReadonlyArray<string>,
        validity
      );
    }
    case FORM_FIELD_TAG.INPUT_NUMBER: {
      return new NumberField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_RANGE: {
      return new RangeField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_URL: {
      return new URLField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_TEL: {
      return new TelephoneField(name, value as string, validity);
    }
    case FORM_FIELD_TAG.INPUT_FILE: {
      return new FileField(name, value as Readonly<File[]>, validity);
    }
    case FORM_FIELD_TAG.INPUT_DATE: {
      return new DateField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_DATETIME_LOCAL: {
      return new DatetimeLocalField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_TIME: {
      return new TimeField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_WEEK: {
      return new WeekField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_MONTH: {
      return new MonthField(name, value as number, validity);
    }
    case FORM_FIELD_TAG.INPUT_RADIO: {
      return new RadioField(name, value as ReadonlyArray<string>, validity);
    }
    case FORM_FIELD_TAG.INPUT_CHECKBOX: {
      return new CheckboxField(name, value as ReadonlyArray<string>, validity);
    }
    default: {
      return new NilField();
    }
  }
}
