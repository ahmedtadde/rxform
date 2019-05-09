export function isInputElement(value: any) {
  return value instanceof HTMLInputElement;
}

export function isSelectElement(value: any) {
  return value instanceof HTMLSelectElement;
}

export function isTextAreaElement(value: any) {
  return value instanceof HTMLTextAreaElement;
}

export function isInputElementOfType(type: string, value: any) {
  return isInputElement(value) && value.type === type;
}

export function isFormElement(value: any) {
  return value instanceof HTMLFormElement;
}

export function isFormFieldElement(value: any) {
  return (
    isInputElement(value) || isSelectElement(value) || isTextAreaElement(value)
  );
}
