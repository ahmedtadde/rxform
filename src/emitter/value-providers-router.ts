import { DOMEvents, DOMEventsType } from '@src/typings';
import { throwError } from '@utils/errors';
import { nonEmptyString } from '@utils/string';
import { Emitter } from 'mitt';
export const router = (
  _: HTMLFormElement,
  emitter$: Emitter,
  formOptions: any
): Emitter => {
  type SimplifiedProviderOptionObj = { events: string[]; selector: string };
  const formDOMEvents = [
    DOMEvents.BLUR,
    DOMEvents.CHANGE,
    DOMEvents.FOCUS,
    DOMEvents.INPUT,
    DOMEvents.SUBMIT
  ];
  const providers: SimplifiedProviderOptionObj[] = formOptions.values.providers.map(
    (providerOptionObj: any): SimplifiedProviderOptionObj => {
      return {
        events: getProviderEventSources(providerOptionObj, formDOMEvents),
        selector: nonEmptyString(providerOptionObj.selector)
          ? providerOptionObj.selector
          : throwError('Invalid value provider DOM selector value')
      };
    }
  );

  const routeFormEventToProvider = (
    emitterInstance$: Emitter,
    simplifiedProvidersOptionObjs: SimplifiedProviderOptionObj[]
  ) => (evt: Event) => {
    const matchedProviderIndex = simplifiedProvidersOptionObjs.findIndex(
      (simplifiedProviderOptionObj: SimplifiedProviderOptionObj) => {
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
    if (providedEvents === false) return ['submit'];

    const events = Array.isArray(providedEvents) ? providedEvents : [];
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
      return extractedEvents.concat('submit');
    } else if (Array.isArray(extractedEvents)) {
      return ['blur', 'change', 'submit'];
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

export default router;
