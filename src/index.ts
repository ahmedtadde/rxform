import {
  base as BaseForm,
  create as createForm,
  Form,
  concat,
  $getform
} from "@datatypes/Form";
import {
  Provider,
  Decoder,
  register as registerProvider,
  FormFieldRepository
} from "@datatypes/Provider";
import { init as eventbindings, Msg, FormFieldEvent } from "@/events";
import { is, Option, match, from } from "@datatypes/Option";
import { FORM_INSTANCE_UPDATE_TYPE, FORM_FIELD_EVENT_TYPE } from "@/config";
import { string, array } from "@util/operators";

function getupdatefn(
  type: keyof typeof FORM_INSTANCE_UPDATE_TYPE,
  payload: string | Provider
): (instance: Option<Form>) => Form {
  return (instance: Option<Form>): Form => {
    if (is.some(instance)) {
      switch (type) {
        case FORM_INSTANCE_UPDATE_TYPE.REGISTER_PROVIDER: {
          if (!string.is.nonempty(payload)) {
            const providers = new Map<string, Provider>().set(
              payload.tag,
              payload
            );

            return concat(instance.value, { providers });
          }
          return instance.value;
        }
        case FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER: {
          if (string.is.nonempty(payload)) {
            const providers = new Map(instance.value.providers.entries());
            providers.delete(payload.trim());
            return concat(BaseForm, {
              $form: instance.value.$form,
              touched: instance.value.touched,
              providers
            });
          }
          return instance.value;
        }
        case FORM_INSTANCE_UPDATE_TYPE.SET_TOUCHED_FIELD: {
          if (string.is.nonempty(payload)) {
            const touched = new Set<string>().add(payload);
            return concat(instance.value, { touched });
          }
          return instance.value;
        }
        case FORM_INSTANCE_UPDATE_TYPE.SET_UNTOUCHED_FIELD: {
          if (string.is.nonempty(payload)) {
            const touched = new Set(instance.value.touched.keys());
            touched.delete(payload);
            return concat(BaseForm, {
              $form: instance.value.$form,
              providers: instance.value.providers,
              touched
            });
          }
          return instance.value;
        }
        case FORM_INSTANCE_UPDATE_TYPE.CLEAR_PROVIDERS: {
          const providers = new Map<string, Provider>();
          return concat(BaseForm, {
            $form: instance.value.$form,
            providers: providers,
            touched: instance.value.touched
          });
        }
        case FORM_INSTANCE_UPDATE_TYPE.CLEAR_TOUCHED_FIELDS: {
          const touched = new Set<string>();
          return concat(BaseForm, {
            $form: instance.value.$form,
            providers: instance.value.providers,
            touched
          });
        }
        case FORM_INSTANCE_UPDATE_TYPE.CLEAR: {
          return concat(BaseForm, {
            $form: instance.value.$form
          });
        }
        default: {
          return instance.value;
        }
      }
    } else {
      return BaseForm;
    }
  };
}

export default function rxform(formid: string): Record<string, Function> {
  const ref = match(
    () =>
      new Error(
        "Inititalization failure. Form id provided did not match any form"
      ),
    (f: Form) => f
  )(createForm(formid));

  if (ref instanceof Error) {
    throw ref;
  }

  const instance = new Map<Form, Form>().set(ref, ref);

  const form = (): Option<Form> => {
    return from.nullable(instance.get(ref));
  };

  const updatetouched = (msg: Option<Msg>): void => {
    if (
      is.some(msg) &&
      msg.value instanceof FormFieldEvent &&
      is.some(msg.value.type) &&
      [
        FORM_FIELD_EVENT_TYPE.FOCUS.toLowerCase(),
        FORM_FIELD_EVENT_TYPE.CHANGE.toLowerCase(),
        FORM_FIELD_EVENT_TYPE.BLUR.toLowerCase()
      ].includes(msg.value.type.value.toLowerCase()) &&
      is.some(msg.value.name)
    ) {
      const update = getupdatefn(
        FORM_INSTANCE_UPDATE_TYPE.SET_TOUCHED_FIELD,
        msg.value.name.value
      );
      instance.set(ref, update(form()));
    }
  };

  const formfieldsref = new Map<string, Set<string>>();
  const formfields: FormFieldRepository<Map<string, Set<string>>> = {
    store: new Map<Map<string, Set<string>>, Map<string, Set<string>>>().set(
      formfieldsref,
      formfieldsref
    ),
    get: (): Map<string, Set<string>> => {
      const store = formfields.store.get(formfieldsref);
      return store ? store : formfieldsref;
    },
    set: (providers: string[], fieldname: string): Map<string, Set<string>> => {
      const store = formfields.get();
      if (array.type(providers) && string.is.nonempty(fieldname)) {
        providers.forEach((provider) => {
          const collection = match<Set<string>, Set<string>, Set<string>>(
            () => new Set<string>(),
            (value) => value
          )(from.nullable(store.get(provider)));

          store.set(provider, collection.add(fieldname));
        });
      }
      formfields.store.set(formfieldsref, store);
      return store;
    },
    remove: (provider: string): Map<string, Set<string>> => {
      const store = formfields.get();
      if (string.is.nonempty(provider)) {
        store.delete(provider);
      }
      formfields.store.set(formfieldsref, store);
      return store;
    }
  } as const;

  const { subscription, unbindevents } = eventbindings(
    form,
    formfields,
    $getform,
    updatetouched
  );

  const destroy = (): void => {
    const f = form();
    unbindevents(f);
    if (is.some(f)) {
      const update = getupdatefn(
        FORM_INSTANCE_UPDATE_TYPE.CLEAR,
        FORM_INSTANCE_UPDATE_TYPE.CLEAR
      );
      instance.set(ref, update(f));
      console.warn("rxform instance rendered useless", form());
    }
  };

  return {
    subscription,
    provider: (
      name: string,
      options?: Decoder[] | Omit<Partial<Provider>, "tag">
    ): { destroy: () => void } => {
      const provider = options
        ? registerProvider(form(), getupdatefn, name, options)
        : registerProvider(form(), getupdatefn, name);

      instance.set(ref, provider.commit(form()));

      return {
        destroy(): void {
          const commit = provider.destroy(form(), getupdatefn);
          instance.set(ref, commit(form()));
          formfields.remove(name);
        }
      };
    },
    destroy
  };
}
