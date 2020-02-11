(WIP)

<a href="https://www.codacy.com/manual/ahmedt/rxform?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=metronlabsllc/rxform&amp;utm_campaign=Badge_Grade">
  <img src="https://api.codacy.com/project/badge/Grade/18033391cf154b35839fa2a377c44370"/>
</a>
<a href="https://snyk.io/test/github/metronlabsllc/rxform">
  <img src="https://snyk.io/test/github/metronlabsllc/rxform/badge.svg" alt="Known Vulnerabilities">
</a>
<a href="https://david-dm.org/metronlabsllc/rxform">
  <img src="https://david-dm.org/metronlabsllc/rxform.svg" alt="Dependency Status">
</a>
<a href="https://david-dm.org/metronlabsllc/rxform/?type=dev">
  <img src="https://david-dm.org/metronlabsllc/rxform/dev-status.svg" alt="devDependency Status">
</a>

[![gzip size](http://img.badgesize.io/https://unpkg.com/rxform@latest/dist/rxform.umd.js?compression=gzip)](https://unpkg.com/rxform@latest/dist/rxform.umd.js) [![license](https://badgen.now.sh/badge/license/MIT)](./LICENSE)

# RxForm

> Minimal , declarative, and event driven form handling library

- **Declarative:** flexible options to handle simple and complex form logic
- **Reactive:** form element => stream of `values`, `status`, and `errors` records
- **Framework Agnostic:** can be used on any JS frontend application.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Examples](#examples)
- [Configuration](#configuration)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Go check them out if you don't have them locally installed.

```sh
npm install --save rxform
```

Then with a module bundler like [rollup](http://rollupjs.org/) or [webpack](https://webpack.js.org/), use as you would anything else:

```javascript
// using ES6 modules
import RxForm from 'rxform'

// using CommonJS modules
const RxForm = require('rxform')
```

The [UMD](https://github.com/umdjs/umd) build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/rxform/dist/rxform.umd.js"></script>
```

You can find the library on `window.RxForm`.  

**Note**: The lovely package [`mitt`](https://github.com/developit/mitt) is used for event handling. However, `rxform` does not require installation of `mitt`.

## Usage

```typescript
import rxform from 'rxform';

const config: RxFormConfig = ...
const form: RxForm  = rxform(config);

form.stream$.on('form@values', (values: any) => {
  //Inspect new form values state...
  //Then, update UI or someting...
});

form.stream$.on('form@status', (status: any) => {
  //Inspect new form fields' intercation statuses...
  //Then, update UI or someting...
});

form.stream$.on('form@errors', (errors: any) => {
  //Inspect new form errors generated from computed form values...
  //Then, update UI or someting...
});

//... When done, clean up
form.destroy();


```

## Examples

```TO DO```

## Configuration

- `target: string | HTMLFormElement`
DOM selector or element of the form. Required.
<br/>
- `onsubmit: (values: FormValues, errors: FormErrors, status: FormStatus, dispatch: FormDispatch) => void`
Form submission handler. Required.

  ```typescript
  type FormValues = Record<string, Readonly<any>>;
  type FormErrors = Record<string, Readonly<any>>;
  type FormStatus = {
    /*
    - A form field is labelled as `touched` when after its first blur event is triggered.
    - A form field is `modified` when after the first time its input value changed.
    */
    fields: { [name: string]: Record<'touched' | 'modified', boolean> };
    submitting: boolean;
  };
  ```

<br/>

- `values.state: Record<string, Readonly<any>>`
Initial form values state object. Required.
<br/>

- `values.providers: FormValuesProvider[]`
Array of objects that act as an instruction manuals on how to compute form values based on user inputs. Required.

  ```typescript

  type FormValuesProvider = string | [string, string | boolean] | [string, string, boolean] | {

     /* some DOM selector string used to capture some form field elements.*/
    selector: string;

    /* after provider fn completes computation, it uses this value as the type of the payload passed to the `values.reducer` function. Uses `selector` as default */
    dispatch?: string;

    /* whether `selector` is meant to capture one or many form field elements. Is `false` by default. */
    multiple?: boolean;

    /* For the form field elements matched by the `selector`, list of form events that trigger this provider. If `false`, provider never runs. Defaults to ["change", "blur"] */
    events?: false | DOMEvents[];

    /* Custom function to extract data from each form field element capured by `selector`. Defaults to standard parsing  */
    parser?: ($field: DOMFieldElementsType) => any;

    /* Custom function provided to transform extracted data from a form field element. No default behavior. */
    transformer?: (resultFromParser: any) => any;
  }

  enum DOMEvents {
    FOCUS = "focus",
    INPUT = "input",
    CHANGE = "change",
    BLUR = "blur",
    SUBMIT = "submit",
    RESET = "reset"
  }


  type DOMFieldElementsType =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;
  ```

  Besides passing an object, here are other ways to specify a form values provider:

  - `string => selector`
  - `[string, string] => [selector, dispatch]`
  - `[string, boolean] => [selector, multiple]`
  - `[string, string, boolean] => [selector, dispatch, multiple]`

<br/>

- `values.reducer: FormValuesReducer`
  A typical state reducer function. Takes the previous/current form values and an action object where the `type` is some provider's `dispatch` option.

  ```typescript
  type FormValuesReducer = (previousState: FormValues, action: FormValuesReducerPayload) => FormValues;

  type FormValuesReducerPayload = {
    type: string;
    value: any,
  }
  ```

<br/>

- `errors.state: Record<string, Readonly<any>>`
Initial form errors state object. Defaults to plain empty object `{}`.
<br/>

- `errors.providers: FormValuesProvider[]`
Array of objects that act as an instruction manuals on how to compute form values based on user inputs. Required.

  ```typescript

  type FormErrorsProvider = string | [string, (...args: any[]) => boolean] | [string, (...args: any[]) => boolean, string | ((...args: any[]) => string)] | {

    /* after provider fn completes computation, it uses this value as the type of the payload passed to the `errors.reducer` function. Required. */
    dispatch: string;


     /* Error message for validation failure. Defaults to a generic error message */
    message?: string | ((input?: any, values?: FormValues, errors?: FormErrors, status?: FormStatus) => string);

    /*
    Custom function to build input passed to validator function.
      case string => formValues[key];
      case string[key1, key2, key3, ....] => [formValues[key1], formValues[key2], formValues[key3], ...];
    Defaults to a function returning the whole form values object.
    */
    input?: string | string[] | ((values?: FormValues, errors?: FormErrors, status?: FormStatus) => any);

    /* Custom function to determine whether error provider should run or not. Defaults to a function that always returns `true` */
    predicate?: (values?: FormValues, errors?: FormErrors, status?: FormStatus) => boolean;

    /* Custom function to validate result from `input` function. Defaults to a function that returns `true` => no errors. */
    validator?: (input?: any, values?: FormValues, errors?: FormErrors, status?: FormStatus) => boolean;
  }

  ```

  Besides passing an object, here are other ways to specify a form errors provider:

  - `string => dispatch`
  - `[string, function] => [dispatch, validator]`
  - `[string, function, string] => [dispatch, validator, message]`
  - `[string, function, function] => [dispatch, validator, message]`

<br/>

- `errors.reducer: FormErrorsReducer`
  A typical state reducer function. Takes the previous/current form errors and an action object where the `type` is some provider's `dispatch` option.

  ```typescript
  type FormErrorsReducer = (previousState: FormErrors, payload: FormErrorsReducerPayload) => FormErrors;

   type FormErrorsReducerPayload = {
    type: string;
    error: {
        context: {
            errors: FormErrors,
            input: any,
            status: FormStatus,
            values: FormValues
        },
        message: string
    } | null,  /* is `null` when validation result is ok */
  }
  ```

## TO DO

- Examples
- Tests
- Remove `lodash.clonedeep` dependency... adds 3.3kB (minified + gzipped) to library size

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all see if your issue or idea has [already been reported](../../issues).
If don't, just open a [new clear and descriptive issue](../../issues/new).

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope, and do avoid unrelated commits.

- Fork it!
- Clone your fork: `git clone https://github.com/<your-username>/rxform`
- Navigate to the newly cloned directory: `cd rxform`
- Create a new branch for the new feature: `git checkout -b my-new-feature`
- Install the tools necessary for development: `npm install`
- Make your changes.
- Commit your changes: `git commit -am 'Add some feature'`
- Push to the branch: `git push origin my-new-feature`
- Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://opensource.org/licenses/MIT) © [Ahmed Tadde](https://ahmedtadde.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice aTd this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
