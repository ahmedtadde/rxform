import { ACTION_TAG, FORM_FIELD_EVENT_TYPE, FORM_EVENT_TYPE } from "@/config";
import {
  FormFielEventType,
  FormEventType,
  FormFieldRepository
} from "@util/types";
import { Option, some, none, is, match } from "@datatypes/Option";
import { $el } from "@util/operators";
import { Form, router } from "@datatypes/Form";
import { dispatch as dispatchProviders } from "@datatypes/Provider";
import { match as matchEither } from "@datatypes/Either";

export type Msg = FormFieldEvent | FormSubmissionEvent | FormResetEvent;
export type Sub = (errors: Record<string, Error>, touched: string[]) => void;

export class FormFieldEvent {
  readonly _tag = ACTION_TAG.FORM_FIELD_EVENT;
  private constructor(
    readonly type: Option<FormFielEventType>,
    readonly name: Option<string>
  ) {}
  static create(evt: Event): Option<Msg> {
    const type = (Object.values(FORM_FIELD_EVENT_TYPE) as string[]).includes(
      evt.type
    )
      ? some(evt.type.toUpperCase() as FormFielEventType)
      : none;

    const $field = $el.$field(evt.target);

    const fieldname = is.none($field) ? none : $el.fieldname($field.value);

    return some(new FormFieldEvent(type, fieldname));
  }
}

export class FormSubmissionEvent {
  readonly _tag = ACTION_TAG.FORM_SUBMISSION_EVENT;
  readonly type: FormEventType = FORM_EVENT_TYPE.SUBMIT;
  private constructor(readonly data: Option<FormData>) {}

  static create(evt: Event): Option<Msg> {
    const $form = $el.$form(evt.target);
    if (is.none($form)) return none;
    return some(new FormSubmissionEvent(some(new FormData($form.value))));
  }
}

export class FormResetEvent {
  readonly _tag = ACTION_TAG.FORM_RESET_EVENT;
  readonly type: FormEventType = FORM_EVENT_TYPE.RESET;
  private constructor(readonly data: Option<FormData>) {}

  static create(evt: Event): Option<Msg> {
    const $form = $el.$form(evt.target);
    if (is.none($form)) return none;
    return some(new FormResetEvent(some(new FormData($form.value))));
  }
}

export function dispatcher(
  $form: Option<HTMLFormElement>,
  msg: Option<Msg>
): void {
  if (!is.none($form) && !is.none(msg)) {
    const event = new CustomEvent(msg.value._tag.toLowerCase(), {
      detail: msg
    });
    $form.value.dispatchEvent(event);
  }
}

export function init(
  instance: () => Option<Form>,
  formfields: FormFieldRepository<Map<string, Set<string>>>,
  $getform: (f: Option<Form>) => Option<HTMLFormElement>,
  updatetouched: (msg: Option<Msg>) => void
): {
  readonly subscription: (handler: Sub) => () => void;
  readonly unbindevents: (f: Option<Form>) => void;
} {
  const statesubscribers = new Set<Sub>();

  const internallisteners = {
    formFieldEvents: (evt: Event): void => {
      evt.preventDefault();
      dispatcher($getform(instance()), FormFieldEvent.create(evt));
    },
    formSubmissionOrResetEvents: (evt: Event): void => {
      evt.preventDefault();
      evt.type === FORM_EVENT_TYPE.SUBMIT.toLowerCase()
        ? dispatcher($getform(instance()), FormSubmissionEvent.create(evt))
        : dispatcher($getform(instance()), FormResetEvent.create(evt));
    },
    msg: (evt: Event): void => {
      if (evt instanceof CustomEvent) {
        const msg = evt.detail as Option<Msg>;
        const f = instance();
        if (is.some(f)) {
          const form = f.value;
          updatetouched(msg);

          const providers = router(form, formfields, evt.detail as Option<Msg>);
          console.debug("Providers returned by router", providers);

          dispatchProviders(form, providers).then((result) => {
            const _f = instance();
            const touched = is.some(_f)
              ? Array.from(f.value.touched)
              : ([] as string[]);

            const geterrorbag = matchEither<
              Error[],
              Option<FormData>,
              Record<string, Error>,
              Record<string, Error>
            >(
              (errors: Error[]) => {
                return errors.reduce(
                  (record: Record<string, Error>, err: Error) => {
                    return Object.assign({}, record, {
                      [err.name]: err
                    });
                  },
                  {} as Record<string, Error>
                );
              },
              () => ({} as Record<string, Error>)
            );

            Array.from(statesubscribers.values()).forEach((fn: Sub) => {
              fn(geterrorbag(result), touched);
            });
          });
        }
      }
    }
  };

  const $form = $getform(instance());

  if (is.none($form)) {
    return {
      unbindevents: (f: Option<Form>): void => {
        Object.values(FORM_FIELD_EVENT_TYPE).forEach((eventtype: string) => {
          match(
            () => {
              /** NoOp */
            },
            (value: HTMLFormElement) => {
              value.removeEventListener(
                eventtype.toLowerCase(),
                internallisteners.formFieldEvents,
                true
              );
            }
          )($getform(f));
        });

        [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(
          (eventtype: string) => {
            match(
              () => {
                /** NoOp */
              },
              (value: HTMLFormElement) => {
                value.removeEventListener(
                  eventtype.toLowerCase(),
                  internallisteners.formSubmissionOrResetEvents
                );
              }
            )($getform(f));
          }
        );

        Object.values(ACTION_TAG).forEach((eventtype: string) => {
          match(
            () => {
              /** NoOp */
            },
            (value: HTMLFormElement) => {
              value.removeEventListener(
                eventtype.toLowerCase(),
                internallisteners.msg
              );
            }
          )($getform(f));
        });

        statesubscribers.clear();
      },
      subscription: (handler: Sub): (() => void) => {
        statesubscribers.add(handler);
        return (): void => {
          statesubscribers.delete(handler);
        };
      }
    };
  }

  Object.values(FORM_EVENT_TYPE).forEach((eventtype: string) => {
    // if (!([FORM_EVENT_TYPE.INPUT] as string[]).includes(eventtype)) {
    //   $form.value.addEventListener(
    //     eventtype.toLowerCase(),
    //     internallisteners.formFieldEvents,
    //     true
    //   );
    // }
    $form.value.addEventListener(
      eventtype.toLowerCase(),
      internallisteners.formFieldEvents,
      true
    );
  });

  [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(
    (eventtype: string) => {
      $form.value.addEventListener(
        eventtype.toLowerCase(),
        internallisteners.formSubmissionOrResetEvents
      );
    }
  );

  Object.values(ACTION_TAG).forEach((eventtype: string) => {
    $form.value.addEventListener(
      eventtype.toLowerCase(),
      internallisteners.msg
    );
  });

  return {
    subscription: (handler: Sub): (() => void) => {
      statesubscribers.add(handler);
      return (): void => {
        statesubscribers.delete(handler);
      };
    },
    unbindevents: (f: Option<Form>): void => {
      Object.values(FORM_FIELD_EVENT_TYPE).forEach((eventtype: string) => {
        $form.value.removeEventListener(
          eventtype.toLowerCase(),
          internallisteners.formFieldEvents,
          true
        );
        match(
          () => {
            /** NoOp */
          },
          (value: HTMLFormElement) => {
            value.removeEventListener(
              eventtype.toLowerCase(),
              internallisteners.formFieldEvents,
              true
            );
          }
        )($getform(f));
      });

      [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(
        (eventtype: string) => {
          $form.value.removeEventListener(
            eventtype.toLowerCase(),
            internallisteners.formSubmissionOrResetEvents
          );

          match(
            () => {
              /** NoOp */
            },
            (value: HTMLFormElement) => {
              value.removeEventListener(
                eventtype.toLowerCase(),
                internallisteners.formSubmissionOrResetEvents
              );
            }
          )($getform(f));
        }
      );

      Object.values(ACTION_TAG).forEach((eventtype: string) => {
        $form.value.removeEventListener(
          eventtype.toLowerCase(),
          internallisteners.msg
        );
        match(
          () => {
            /** NoOp */
          },
          (value: HTMLFormElement) => {
            value.removeEventListener(
              eventtype.toLowerCase(),
              internallisteners.msg
            );
          }
        )($getform(f));
      });

      statesubscribers.clear();
    }
  } as const;
}
