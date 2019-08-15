import { DOMEvents, DOMEventsType } from "@lib-types";
import { throwError } from "@utils/errors";
import {
  isBoolean,
  isPlainObject,
  nonEmptyArray,
  nonEmptyString
} from "@utils/object";
import { Emitter } from "mitt";
export const router = (
  $formElement: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  type SimplifiedProviderOptionsObj = { events: string[]; selector: string };
  const formDOMEvents = [
    DOMEvents.BLUR,
    DOMEvents.CHANGE,
    DOMEvents.FOCUS,
    DOMEvents.INPUT,
    DOMEvents.SUBMIT
  ];
  const providers: SimplifiedProviderOptionsObj[] = formOptions.values.providers
    .map(standardizeValueProviderOptionsObj)
    .map(
      (providerOptionObj: any): SimplifiedProviderOptionsObj => {
        return {
          events: getProviderEventSources(providerOptionObj, formDOMEvents),
          selector: nonEmptyString(providerOptionObj.selector)
            ? providerOptionObj.selector
            : throwError("Invalid value provider DOM selector value")
        };
      }
    );

  const routeFormEventToProvider = (
    emitterInstance$: Emitter,
    simplifiedProvidersOptionObjs: SimplifiedProviderOptionsObj[]
  ) => (evt: Event) => {
    const matchedProviderIndex = simplifiedProvidersOptionObjs.findIndex(
      (simplifiedProviderOptionObj: SimplifiedProviderOptionsObj) => {
        return (
          simplifiedProviderOptionObj.events.includes(evt.type) &&
          evt.target instanceof Element &&
          evt.target.matches(
            `form${formOptions.target} ${simplifiedProviderOptionObj.selector}`
          )
        );
      }
    );

    if (matchedProviderIndex !== -1) {
      const matchedProvider =
        simplifiedProvidersOptionObjs[matchedProviderIndex];
      emitterInstance$.emit(
        `form@provider[selector="${matchedProvider.selector}"]`,
        evt
      );
    }
  };

  formDOMEvents.forEach((formDOMEventType: DOMEventsType) =>
    emitter$.on(
      `form@${formDOMEventType}`,
      routeFormEventToProvider(emitter$, providers)
    )
  );

  emitter$.on(`form@${DOMEvents.RESET}`, () => $formElement.reset());
  return emitter$;
};

function getProviderEventSources(
  formOptions: any,
  allowedEvents: Array<string | DOMEvents>
) {
  const extractEvents = (
    optionsObj: any,
    eventsFilter: Array<string | DOMEvents>
  ) => {
    const { events: providedEvents } = optionsObj;
    if (providedEvents === false) return ["submit"];

    const events =
      Array.isArray(providedEvents) && providedEvents.length
        ? providedEvents
        : [];
    return events.reduce((collectedEvents: string[], evt: string) => {
      const shouldCollect = eventsFilter.includes(evt);
      if (shouldCollect) {
        return collectedEvents.concat(evt);
      }

      return collectedEvents;
    }, []);
  };

  const resolver = (extractedEvents: Array<string | DOMEvents>) => {
    if (Array.isArray(extractedEvents) && extractedEvents.length) {
      return extractedEvents.concat("submit");
    } else if (Array.isArray(extractedEvents)) {
      return ["blur", "change", "submit"];
    }

    throwError(
      `Invalid events extracted from value provider option object: ${JSON.stringify(
        extractedEvents
      )}`
    );

    return [];
  };

  return resolver(extractEvents(formOptions, allowedEvents));
}

function standardizeValueProviderOptionsObj(options: any) {
  const optionsType = (obj: any) => {
    if (nonEmptyString(obj)) return "is-string";
    if (isPlainObject(obj)) return "is-plain-object";
    if (
      Array.isArray(obj) &&
      nonEmptyArray(
        obj
          .slice(0, 3)
          .filter((item: any) => nonEmptyString(item) || isBoolean(item))
      )
    ) {
      return "is-array";
    }
  };

  switch (optionsType(options)) {
    case "is-string": {
      return { selector: options };
    }

    case "is-plain-object": {
      return options;
    }

    case "is-array": {
      if (options.length === 1) {
        return { selector: options[0] };
      } else if (options.length === 2) {
        return Object.assign(
          {},
          { selector: options[0] },
          nonEmptyString(options[1])
            ? { dispatch: options[1] }
            : { multiple: Boolean(options[1]) }
        );
      } else if (options.length === 3) {
        return {
          dispatch: options[1],
          multiple: Boolean(options[2]),
          selector: options[0]
        };
      } else {
        throwError(`Invalid value provider option`);
      }
    }
  }
}

export default router;
