import buildEmitter from "@emitter/builder";
import { log } from "@utils/logger";
import { deepFreeze } from "@utils/object";
const RxForm = (formOptions: any) => {
  const emitter$ = buildEmitter(deepFreeze(formOptions));
  emitter$.on("form@values", (values: any) => {
    log.info("[FORM VALUES] ", values, Object.isFrozen(values));
  });

  emitter$.on("form@errors", (errors: any) => {
    log.info("[FORM ERRORS] ", errors, Object.isFrozen(errors));
  });

  emitter$.on("form@status", (status: any) => {
    log.info("[FORM STATUS] ", status, Object.isFrozen(status));
  });
};

export default RxForm;
