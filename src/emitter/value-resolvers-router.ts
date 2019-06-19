import { DOMEvents, DOMEventsType } from '@src/typings';
import { Emitter } from 'mitt';
export const router = (emitter$: Emitter, formOptions: any): Emitter => {
  type SimplifiedResolverOptionObj = { events: string[]; selector: string };
  const formDOMEvents = [
    DOMEvents.BLUR,
    DOMEvents.CHANGE,
    DOMEvents.FOCUS,
    DOMEvents.INPUT,
    DOMEvents.SUBMIT
  ];
  const resolvers: SimplifiedResolverOptionObj[] = formOptions.values.map(
    (resolverOptionObj: any): SimplifiedResolverOptionObj => {
      return {
        events: resolverOptionObj.events,
        selector: resolverOptionObj.selector
      };
    }
  );
  const routeFormEventToResolver = (
    emitterInstance$: Emitter,
    simplifiedResolversOptionObjs: SimplifiedResolverOptionObj[]
  ) => (evt: Event) => {
    const matchedResolverIndex = simplifiedResolversOptionObjs.findIndex(
      (simplifiedResolverOptionObj: SimplifiedResolverOptionObj) => {
        return (
          simplifiedResolverOptionObj.events.includes(evt.type) &&
          evt.target instanceof Element &&
          evt.target.matches(
            `form${formOptions.target} ${simplifiedResolverOptionObj.selector}`
          )
        );
      }
    );

    if (matchedResolverIndex !== -1) {
      const matchedResolver =
        simplifiedResolversOptionObjs[matchedResolverIndex];
      emitterInstance$.emit(
        `form@value-resolver-route[selector="${matchedResolver.selector}"]`,
        evt
      );
    }
  };

  formDOMEvents.forEach((formDOMEventType: DOMEventsType) =>
    emitter$.on(
      `form@${formDOMEventType}`,
      routeFormEventToResolver(emitter$, resolvers)
    )
  );
  return emitter$;
};

export default router;
