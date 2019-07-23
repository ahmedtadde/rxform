export default () => null;
// import { isFunctionOrPromise, getValueFromObject } from '@utils/object';
// import { Emitter } from 'mitt';
// import { nonEmptyString } from '@utils/string';
// import { throwError } from '@utils/errors';
// export default (
//   $formEl: HTMLFormElement,
//   emitter$: Emitter,
//   formErrorOptionObj: any
// ) => {
//   // {
//   //   dispatch: '',
//   //   selector
//   //   input(values) { },
//   //   predicate(values, errors) { },
//   //   validator(input) { },
//   //   error(input, values, errors) { }
//   // }

//   const helpers = {
//     input: getInput(formErrorOptionObj)
//     // hooksListeners: getHookListeners(formValueOption),
//     // parser: getParser(formValueOption),
//     // transformer: getTransformer(formValueOption)
//   };

//   const listener = (emitterInstance$: Emitter, optionsObj: any) => (
//     evt: Event
//   ) =>
//     handler(
//       evt,
//       Object.assign({}, optionsObj, {
//         emitter$: emitterInstance$
//       })
//     );

//   emitter$.on(
//     'form@values',
//     listener(emitter$, Object.assign({}, $formEl, formErrorOptionObj, helpers))
//   );
//   return true;
// };

// function handler(evt: Event, ctx: any) {}

// function getInput(options: any) {
//   const inputType = (obj: any) => {
//     if (isFunctionOrPromise(obj)) return 'is-function-or-promise';
//     if (nonEmptyString(obj)) return 'is-string';
//     if (
//       Array.isArray(obj) &&
//       obj.length &&
//       obj.every((item: any) => nonEmptyString(item))
//     ) {
//       return 'is-array-of-string';
//     }
//   };

//   switch (inputType(options.input)) {
//     case 'is-string': {
//     }
//   }
// }
