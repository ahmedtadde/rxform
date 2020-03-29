import { FORM_FIELD_TAG } from "@/config";
import { FormFieldType } from "@/util/types";
import {
  Option,
  match as optionmatch,
  // none as optionnonone,
  is
} from "@datatypes/Option";

import { string, $el } from "@util/operators";
// import { FormFieldType } from "@util/types";

// function HTMLFormFieldNativeValidition($target: FormFieldType) {
//   // const isvalid = $target.checkValidity();
//   // return isvalid ? [new Error($target.validationMessage)] : [];
// }

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

export class TextField {
  readonly _tag = FORM_FIELD_TAG.INPUT_TEXT;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class TextareaField {
  readonly _tag = FORM_FIELD_TAG.TEXTAREA;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class HiddenField {
  readonly _tag = FORM_FIELD_TAG.INPUT_HIDDEN;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class SearchField {
  readonly _tag = FORM_FIELD_TAG.INPUT_SEARCH;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class NumberField {
  readonly _tag = FORM_FIELD_TAG.INPUT_NUMBER;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class EmailField {
  readonly _tag = FORM_FIELD_TAG.INPUT_EMAIL;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class PasswordField {
  readonly _tag = FORM_FIELD_TAG.INPUT_PASSWORD;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class CheckboxField {
  readonly _tag = FORM_FIELD_TAG.INPUT_CHECKBOX;
  private constructor(
    readonly name: string,
    readonly value: string[],
    readonly validity: FormFieldValidity
  ) {}
}

export class RadioField {
  readonly _tag = FORM_FIELD_TAG.INPUT_RADIO;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class ColorField {
  readonly _tag = FORM_FIELD_TAG.INPUT_RADIO;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class DateField {
  readonly _tag = FORM_FIELD_TAG.INPUT_DATE;
  private constructor(
    readonly name: string,
    readonly value: Date,
    readonly validity: FormFieldValidity
  ) {}
}

export class DatetimeLocalField {
  readonly _tag = FORM_FIELD_TAG.INPUT_DATETIME_LOCAL;
  private constructor(
    readonly name: string,
    readonly value: Date,
    readonly validity: FormFieldValidity
  ) {}
}

export class MonthField {
  readonly _tag = FORM_FIELD_TAG.INPUT_MONTH;
  private constructor(
    readonly name: string,
    readonly value: Date,
    readonly validity: FormFieldValidity
  ) {}
}

export class WeekField {
  readonly _tag = FORM_FIELD_TAG.INPUT_WEEK;
  private constructor(
    readonly name: string,
    readonly value: Date,
    readonly validity: FormFieldValidity
  ) {}
}

export class TimeField {
  readonly _tag = FORM_FIELD_TAG.INPUT_TIME;
  private constructor(
    readonly name: string,
    readonly value: Date,
    readonly validity: FormFieldValidity
  ) {}
}

export class FileField {
  readonly _tag = FORM_FIELD_TAG.INPUT_FILE;
  private constructor(
    readonly name: string,
    readonly value: File[],
    readonly validity: FormFieldValidity
  ) {}
}

export class TelephoneField {
  readonly _tag = FORM_FIELD_TAG.INPUT_TEL;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class URLField {
  readonly _tag = FORM_FIELD_TAG.INPUT_URL;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}

export class RangeField {
  readonly _tag = FORM_FIELD_TAG.INPUT_RANGE;
  private constructor(
    readonly name: string,
    readonly value: number,
    readonly validity: FormFieldValidity
  ) {}
}

export class SingleSelectField {
  readonly _tag = FORM_FIELD_TAG.SINGLE_SELECT;
  private constructor(
    readonly name: string,
    readonly value: string,
    readonly validity: FormFieldValidity
  ) {}
}
export class MultipleSelectField {
  readonly _tag = FORM_FIELD_TAG.MULTIPLE_SELECT;
  private constructor(
    readonly name: string,
    readonly value: string[],
    readonly validity: FormFieldValidity
  ) {}
}

export class NilField {
  readonly _tag = FORM_FIELD_TAG.NIL;
  readonly name = "";
  readonly value = "";
  readonly validity: FormFieldValidity = [];
}

function getvalidity($target: Option<FormFieldType>): FormFieldValidity {
  return optionmatch(
    () => [] as FormFieldValidity,
    ($value: FormFieldType) => {
      const message = $value.validationMessage;
      return string.is.nonempty(message)
        ? ([new Error(message.trim())] as FormFieldValidity)
        : ([] as FormFieldValidity);
    }
  )($target);
}

function getvalue($form: HTMLFormElement, $target: FormFieldType) {
  const fieldtag = `${$target.tagName}:${$target.type}`;
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
      return $target.value.trim();
    }
    case FORM_FIELD_TAG.SINGLE_SELECT:
    case FORM_FIELD_TAG.MULTIPLE_SELECT: {
      if ($el.is.select($target)) {
        return Array.from($target.selectedOptions).map(
          (opt: HTMLOptionElement) => opt.value
        );
      }
      return [];
    }
    case FORM_FIELD_TAG.INPUT_NUMBER:
    case FORM_FIELD_TAG.INPUT_RANGE: {
      return Number($target.value.trim());
    }
    case FORM_FIELD_TAG.INPUT_URL: {
      try {
        return new URL($target.value.trim()).href;
      } catch (error) {
        console.error(
          "[RxForm] Failed to decode url input field value into URL object",
          $target.value,
          error
        );
        return "";
      }
    }
    case FORM_FIELD_TAG.INPUT_TEL: {
      return $target.value.trim().replace(/\D/g, "");
    }
    // case FORM_FIELD_TAG.INPUT_RADIO: {
    //   if ($el.is.inputof($target, "radio")) {
    //     return $target.checked ? $target.value.trim() : "";
    //   }
    //   return "";
    // }
    // case FORM_FIELD_TAG.INPUT_CHECKBOX: {
    //   if ($el.is.inputof($target, "checkbox")) {
    //     return $target.checked ? $target.value.trim() : "";
    //   }
    //   return "";
    // }
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
  return new NilField();
}
