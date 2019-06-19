import { Emitter } from 'mitt';
export const router = (emitter$: Emitter, formOptions: any): Emitter => {
  type SimplifiedResolverOptionObj = { events: string[]; selector: string };
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
          (evt.target as Element).matches(
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
  emitter$.on('*', routeFormEventToResolver(emitter$, resolvers));
  return emitter$;
};

export default router;
