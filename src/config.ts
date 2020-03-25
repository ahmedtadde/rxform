export const FORM_EVENT_TYPE = {
  INPUT: "input" as "INPUT",
  CHANGE: "change" as "CHANGE",
  BLUR: "blur" as "BLUR",
  SUBMIT: "submit" as "SUBMIT",
  RESET: "reset" as "RESET"
} as const;

export const FORM_FIELD_EVENT_TYPE = {
  FOCUS: "focus" as "FOCUS",
  INPUT: "input" as "INPUT",
  CHANGE: "change" as "CHANGE",
  BLUR: "blur" as "BLUR"
};

export const EVENT_TOPIC = Object.assign({} as const, FORM_EVENT_TYPE);

// export const FORM_FIELD_INPUT_ELEMENT_TYPE = {
//   CHECKBOX: "checkbox" as "CHECKBOX",
//   COLOR: "colore" as "COLOR",
//   DATE: "date" as "DATE",
//   DATE_TIME_LOCAL: "datetime-local" as "DATE_TIME_LOCAL"
// } as const;

export const ACTION_TAG = {
  FORM_FIELD_EVENT: "FORM_FIELD_EVENT",
  FORM_SUBMISSION_EVENT: "FORM_SUBMISSION_EVENT",
  FORM_RESET_EVENT: "FORM_RESET_EVENT"
} as const;

export const FORM_INSTANCE_UPDATE_TYPE = {
  REGISTER_PROVIDER: "providers:create" as "REGISTER_PROVIDER",
  DESTROY_PROVIDER: "providers:delete" as "DESTROY_PROVIDER",
  SET_TOUCHED_FIELD: "touched-fields:add" as "SET_TOUCHED_FIELD",
  SET_UNTOUCHED_FIELD: "touched-fields:delete" as "SET_UNTOUCHED_FIELD",
  CLEAR_PROVIDERS: "providers:clear" as "CLEAR_PROVIDERS",
  CLEAR_TOUCHED_FIELDS: "touched-fields:clear" as "CLEAR_TOUCHED_FIELDS",
  CLEAR: "and(providers:clear, touched-fields:clear)" as "CLEAR",
  NOOP: "" as "NOOP"
};

// export const FORM_STATUS_TYPE = {
//   TOUCHED: "touched" as "TOUCHED",
//   MODIFIED: "modified" as "MODIFIED",
//   SUBMISSIONS: "submissions" as "SUBMISSIONS"
// } as const;

// export const FORM_SUBMISSION_STATUS = {
//   ONGOING: "ongoing" as "ongoing",
//   SUCCESS: "success" as "success",
//   FAILURE: "failure" as "failure"
// } as const;

export const PROVIDER_FIELD_MATCHING_MODE = {
  CONJUNCTION: "conjuction" as "CONJUNCTION",
  DISJUNCTION: "disjunction" as "DISJUNCTION"
} as const;
