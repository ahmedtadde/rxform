import { DOMEvents, EmitterDOMEventConfig } from '@lib-types';
import { emitterDomEvents } from '@utils/dom';
import { Emitter } from 'mitt';
export const register = (
  $formEl: HTMLFormElement,
  emitter$: Emitter,
  _: any
): Emitter => {
  const events: EmitterDOMEventConfig[] = [
    { type: DOMEvents.FOCUS, registerAs: 'form@focus' },
    { type: DOMEvents.INPUT, registerAs: 'form@input' },
    { type: DOMEvents.CHANGE, registerAs: 'form@change' },
    { type: DOMEvents.BLUR, registerAs: 'form@blur', options: true },
    { type: DOMEvents.SUBMIT, registerAs: 'form@submit' }
  ];

  return emitterDomEvents(emitter$, $formEl, events);
};

export default register;
