import { Either, right, left } from "@datatypes/Either";
import {
  FormEventType,
  FormInstanceUpdateFn,
  FormFieldType
} from "@util/types";
import { string, array, isRegExp, struct, $el } from "@util/operators";
import {
  FORM_INSTANCE_UPDATE_TYPE,
  PROVIDER_FIELD_MATCHING_MODE,
  FORM_EVENT_TYPE
} from "@/config";
import { Option, is, from, none, some, match } from "@datatypes/Option";
import { Form } from "@datatypes/Form";

export type FormFieldSelectorExpression = string | RegExp;
export type ProviderFieldMatchingMode = keyof typeof PROVIDER_FIELD_MATCHING_MODE;
export type Decoder = <T>(data: T) => Either<Error, T>;

export interface Provider {
  readonly tag: string;
  readonly include: FormFieldSelectorExpression[];
  readonly events: FormEventType[];
  readonly mode: ProviderFieldMatchingMode;
  readonly exclude: string[];
  readonly decoders: Decoder[];
}

export const base: Provider = {
  tag: "base",
  include: [],
  exclude: [],
  decoders: [],
  events: [FORM_EVENT_TYPE.CHANGE, FORM_EVENT_TYPE.SUBMIT],
  mode: PROVIDER_FIELD_MATCHING_MODE.DISJUNCTION
};

export function equals(x: Provider, y: Provider): boolean {
  return string.equals(x.tag, y.tag);
}

export function concat(x: Provider, y: Partial<Provider>): Provider {
  const tag = is.none(string.optional(y.tag, true)) ? x.tag : (y.tag as string);

  const decoders = x.decoders.concat(
    is.none(array.optional(y.decoders)) ? [] : (y.decoders as Decoder[])
  );

  const exclude = Array.from(
    new Set(
      x.exclude
        .concat(
          is.none(array.optional(y.exclude)) ? [] : (y.exclude as string[])
        )
        .filter(string.is.nonempty)
    )
  );

  const events = Array.from(
    new Set(
      x.events
        .concat(
          is.none(array.optional(y.events)) ? [] : (y.events as FormEventType[])
        )
        .filter(string.is.nonempty)
    )
  );

  const include = Array.from(
    new Set(
      x.include
        .concat(
          is.none(array.optional(y.include))
            ? []
            : (y.include as FormFieldSelectorExpression[])
        )
        .filter((x) => string.is.nonempty(x) || isRegExp(x))
    )
  );

  const mode = is.none(string.optional(y.mode, true))
    ? x.mode
    : Object.keys(PROVIDER_FIELD_MATCHING_MODE).includes(
        (y.mode as string).trim()
      )
    ? ((y.mode as string).trim() as ProviderFieldMatchingMode)
    : x.mode;

  return Object.assign({}, x, {
    tag: tag,
    mode,
    exclude,
    decoders,
    events,
    include
  });
}

export function create(
  tag: string,
  options?: Decoder[] | Omit<Partial<Provider>, "tag">
): Option<Provider> {
  const config = Object.assign(
    { tag },
    options && array.type(options)
      ? { decoders: options }
      : struct.type(options)
      ? options
      : {}
  );

  return from.nullable(concat(base, config));
}

export type ProviderRegistrationFn = (
  f: Option<Form>,
  update: FormInstanceUpdateFn,
  tag: string,
  options?: Decoder[] | Omit<Partial<Provider>, "tag">
) => {
  commit: (instance: Option<Form>) => Form;
  destroy: (
    f: Option<Form>,
    update: FormInstanceUpdateFn
  ) => (instance: Option<Form>) => Form;
};

export function register(
  f: Option<Form>,
  update: FormInstanceUpdateFn,
  tag: string,
  options?: Decoder[] | Omit<Partial<Provider>, "tag">
): ReturnType<ProviderRegistrationFn> {
  const provider = struct.type(options) ? create(tag, options) : create(tag);
  if (is.none(provider)) {
    const err = new Error("Invalid provider params");
    throw err;
  }

  const form = match(
    () => new Error("Invalid form instance for provider registration."),
    (value: Form) => value
  )(f);

  if (form instanceof Error) {
    throw form;
  }

  if (form.providers.has(provider.value.tag)) {
    const err = new Error("Provider tag name already exist");
    throw err;
  }

  const destroy = (
    f: Option<Form>,
    update: FormInstanceUpdateFn
  ): ((instance: Option<Form>) => Form) => {
    const form = match(
      () => new Error("Invalid form instance for provider deactivation."),
      (value: Form) => value
    )(f);

    if (!(form instanceof Error)) {
      return update(
        FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER,
        provider.value.tag
      );
    }

    return update(
      FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER,
      provider.value.tag
    );
  };

  return {
    destroy,
    commit: update(FORM_INSTANCE_UPDATE_TYPE.REGISTER_PROVIDER, provider.value)
  };
}

export async function run(
  provider: Option<Provider>,
  data: Option<FormData>
): Promise<Either<Error, Option<FormData>>> {
  return new Promise((resolve) => {
    provider;
    resolve(right(data));
  });
}

export async function dispatch(
  form: Form,
  providers: Map<string, Provider>
): Promise<Either<Error[], Option<FormData>>> {
  return new Promise((resolve) => {
    const formdata = is.none(form.$form)
      ? none
      : some(new FormData(form.$form.value));

    Promise.all(
      Array.from(providers.values()).map((provider) => {
        run(some(provider), formdata);
      })
    )
      .then(() => {
        resolve(right(formdata));
      })
      .catch((err: Error) => resolve(left([err])));
  });
}

export function matchfield(
  provider: Provider,
  eventtype: FormEventType,
  fieldname: Option<string>
): boolean {
  if (
    !(provider.events as string[])
      .map((e) => e.toLowerCase())
      .includes(eventtype.toLowerCase())
  )
    return false;

  const target = match(
    () => "",
    (str: string) => (string.is.nonempty(str) ? str.trim() : "")
  )(fieldname);

  if (target && provider.exclude.includes(target)) return false;

  if (
    !target &&
    ([FORM_EVENT_TYPE.RESET, FORM_EVENT_TYPE.SUBMIT] as string[])
      .map((e) => e.toLowerCase())
      .includes(eventtype.toLowerCase())
  )
    return true;

  const strictmode = provider.mode === PROVIDER_FIELD_MATCHING_MODE.CONJUNCTION;

  const tests = provider.include.map((expression): boolean => {
    if (expression instanceof RegExp) return expression.test(target);

    if (expression.trim() === target) return true;

    const $target = match<FormFieldType, false, FormFieldType>(
      () => false,
      ($value) => $value
    )($el.$field(target));

    if (!$target) return false;

    return $target.matches(expression);
  });

  return strictmode
    ? tests.every((testresult) => testresult)
    : tests.some((testresult) => testresult);
}
