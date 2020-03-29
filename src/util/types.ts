import { FORM_EVENT_TYPE, FORM_INSTANCE_UPDATE_TYPE } from "@/config";
import { Provider } from "@/datatypes/Provider";
import { Form } from "@datatypes/Form";
// import { Either } from "@datatypes/Either";
import { Option } from "@datatypes/Option";

export type Predicate<T> = (x: T) => boolean;

export type Primitive = string | number | boolean;

// export interface Serializer {
//   decode: <I, O>(i: Option<I>) => Either<Error[], O>;
//   encode: <I, O>(o: Option<O>) => Either<Error[], I>;
// }

export interface FormFieldRepository<T> {
  readonly store: Map<T, T>;
  readonly get: () => T;
  readonly set: (providers: string[], fieldname: string) => T;
  readonly remove: (provider: string) => T;
}

export type FormFieldType =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type FormEventType = keyof typeof FORM_EVENT_TYPE;
export type FormFielEventType = keyof Omit<
  typeof FORM_EVENT_TYPE,
  typeof FORM_EVENT_TYPE.SUBMIT | typeof FORM_EVENT_TYPE.RESET
>;

export type FormInstanceUpdateFn = (
  type: keyof typeof FORM_INSTANCE_UPDATE_TYPE,
  payload: Provider | string
) => (instance: Option<Form>) => Form;
