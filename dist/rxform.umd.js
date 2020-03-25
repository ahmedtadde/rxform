(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.RxForm = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function left(x) {
        return { _is: "Left", value: x };
    }
    function right(x) {
        return { _is: "Right", value: x };
    }
    function match(onleft, onright) {
        return function (x) { return (x._is === "Left" ? onleft(x.value) : onright(x.value)); };
    }

    var none = { _is: "None" };
    function some(x) {
        return { _is: "Some", value: x };
    }
    var is = {
        some: function (x) {
            return x._is === "Some";
        },
        none: function (x) {
            return x._is === "None";
        }
    };
    function match$1(none, some) {
        return function (x) { return (is.none(x) ? none() : some(x.value)); };
    }
    function concat(x, y) {
        if (is.none(x) && is.none(y))
            return none;
        if (is.some(x) && is.some(y))
            return y;
        if (is.some(x) && is.none(y))
            return x;
        if (is.none(x) && is.some(y))
            return y;
        return none;
    }
    var from = {
        nullable: function (x) {
            var isnull = x === null;
            var isundefined = typeof x === "undefined";
            return isnull || isundefined ? none : some(x);
        },
        nan: function (x) {
            return isNaN(Number(x)) ? none : some(Number(x));
        },
        falsy: function (x) {
            return !x ? none : some(x);
        },
        predicate: function (fn) {
            return function (x) { return (fn(x) ? some(x) : none); };
        }
    };

    var isString = function (x) { return typeof x === "string"; };
    var isNonEmptyString = function (x) {
        return Boolean(isString(x) && x.trim().length);
    };
    var isRegExp = function (x) {
        return Object.prototype.toString.call(x) === "[object RegExp]";
    };
    var string = {
        type: isString,
        optional: function (x, strict) {
            if (isString(x)) {
                return strict ? (isNonEmptyString(x) ? some(x) : none) : some(x);
            }
            return none;
        },
        is: {
            nonempty: isNonEmptyString,
            empty: function (x) { return !isNonEmptyString(x); }
        },
        equals: function (x, y) {
            var _x = string.optional(x, true);
            var _y = string.optional(y, true);
            return ((is.none(_x) && is.none(_y)) ||
                (is.some(_x) && is.some(_y) && _x.value === _y.value));
        }
    };
    var array = {
        type: Array.isArray,
        optional: function (x, strict) {
            if (Array.isArray(x)) {
                return strict ? (array.is.nonempty(x) ? some(x) : none) : some(x);
            }
            return none;
        },
        is: {
            empty: function (x) { return Boolean(x.length); },
            nonempty: function (x) { return !x.length; }
        }
    };
    var struct = {
        type: function (x) {
            return (typeof x === "object" &&
                x !== null &&
                !array.type(x) &&
                x.constructor.name === "Object");
        }
    };
    var $el = {
        $form: function (x) {
            if ($el.is.form(x))
                return some(x);
            if (is.none(string.optional(x, true)))
                return none;
            var $form = from.nullable(document.querySelector("form#" + x.trim()));
            if (is.none($form))
                return none;
            if (!$el.is.form($form.value))
                return none;
            return some($form.value);
        },
        $field: function (x) {
            if ($el.is.field(x))
                return some(x);
            if (is.none(string.optional(x, true)))
                return none;
            var $field = from.nullable(document.querySelector("form input[name=\"" + x.trim() + "\"]") ||
                document.querySelector("form select[name=\"" + x.trim() + "\"]") ||
                document.querySelector("form textarea[name=\"" + x.trim() + "\"]"));
            if (is.none($field))
                return none;
            if (!$el.is.field($field.value))
                return none;
            return some($field.value);
        },
        $fieldform: function (x) {
            if ($el.is.form(x))
                return some(x);
            var $field = $el.$field(x);
            if (is.none($field))
                return none;
            if (!$el.is.field($field.value))
                return none;
            if (!$el.is.form($field.value.form))
                return none;
            return some($field.value.form);
        },
        fieldname: function (x) {
            return $el.is.field(x) && is.some(string.optional(x.name, true))
                ? some(x.name.trim())
                : none;
        },
        fieldvalue: function (x) {
            return $el.is.field(x) && is.none(string.optional(x.value, true))
                ? some(x.value)
                : none;
        },
        is: {
            form: function (x) { return x instanceof HTMLFormElement; },
            field: function (x) {
                return $el.is.input(x) || $el.is.select(x) || $el.is.textarea(x);
            },
            input: function (x) { return x instanceof HTMLInputElement; },
            inputof: function (x, type) {
                return x instanceof HTMLInputElement && x.type === type.trim();
            },
            fileinput: function (x) {
                return x instanceof HTMLInputElement && x.type === "file";
            },
            select: function (x) {
                return x instanceof HTMLSelectElement;
            },
            singleselect: function (x) {
                return $el.is.select(x) && !x.multiple;
            },
            multiselect: function (x) {
                return $el.is.select(x) && x.multiple;
            },
            textarea: function (x) {
                return x instanceof HTMLTextAreaElement;
            }
        }
    };

    var FORM_EVENT_TYPE = {
        INPUT: "input",
        CHANGE: "change",
        BLUR: "blur",
        SUBMIT: "submit",
        RESET: "reset"
    };
    var FORM_FIELD_EVENT_TYPE = {
        FOCUS: "focus",
        INPUT: "input",
        CHANGE: "change",
        BLUR: "blur"
    };
    var EVENT_TOPIC = Object.assign({}, FORM_EVENT_TYPE);
    // export const FORM_FIELD_INPUT_ELEMENT_TYPE = {
    //   CHECKBOX: "checkbox" as "CHECKBOX",
    //   COLOR: "colore" as "COLOR",
    //   DATE: "date" as "DATE",
    //   DATE_TIME_LOCAL: "datetime-local" as "DATE_TIME_LOCAL"
    // } as const;
    var ACTION_TAG = {
        FORM_FIELD_EVENT: "FORM_FIELD_EVENT",
        FORM_SUBMISSION_EVENT: "FORM_SUBMISSION_EVENT",
        FORM_RESET_EVENT: "FORM_RESET_EVENT"
    };
    var FORM_INSTANCE_UPDATE_TYPE = {
        REGISTER_PROVIDER: "providers:create",
        DESTROY_PROVIDER: "providers:delete",
        SET_TOUCHED_FIELD: "touched-fields:add",
        SET_UNTOUCHED_FIELD: "touched-fields:delete",
        CLEAR_PROVIDERS: "providers:clear",
        CLEAR_TOUCHED_FIELDS: "touched-fields:clear",
        CLEAR: "and(providers:clear, touched-fields:clear)",
        NOOP: ""
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
    var PROVIDER_FIELD_MATCHING_MODE = {
        CONJUNCTION: "conjuction",
        DISJUNCTION: "disjunction"
    };

    var base = {
        tag: "base",
        include: [],
        exclude: [],
        decoders: [],
        events: [FORM_EVENT_TYPE.CHANGE, FORM_EVENT_TYPE.SUBMIT],
        mode: PROVIDER_FIELD_MATCHING_MODE.DISJUNCTION
    };
    function concat$1(x, y) {
        var tag = is.none(string.optional(y.tag, true)) ? x.tag : y.tag;
        var decoders = x.decoders.concat(is.none(array.optional(y.decoders)) ? [] : y.decoders);
        var exclude = Array.from(new Set(x.exclude
            .concat(is.none(array.optional(y.exclude)) ? [] : y.exclude)
            .filter(string.is.nonempty)));
        var events = Array.from(new Set(x.events
            .concat(is.none(array.optional(y.events)) ? [] : y.events)
            .filter(string.is.nonempty)));
        var include = Array.from(new Set(x.include
            .concat(is.none(array.optional(y.include))
            ? []
            : y.include)
            .filter(function (x) { return string.is.nonempty(x) || isRegExp(x); })));
        var mode = is.none(string.optional(y.mode, true))
            ? x.mode
            : Object.keys(PROVIDER_FIELD_MATCHING_MODE).includes(y.mode.trim())
                ? y.mode.trim()
                : x.mode;
        return Object.assign({}, x, {
            tag: tag,
            mode: mode,
            exclude: exclude,
            decoders: decoders,
            events: events,
            include: include
        });
    }
    function create(tag, options) {
        var config = Object.assign({ tag: tag }, options && array.type(options)
            ? { decoders: options }
            : struct.type(options)
                ? options
                : {});
        return from.nullable(concat$1(base, config));
    }
    function register(f, update, tag, options) {
        var provider = struct.type(options) ? create(tag, options) : create(tag);
        if (is.none(provider)) {
            var err = new Error("Invalid provider params");
            throw err;
        }
        var form = match$1(function () { return new Error("Invalid form instance for provider registration."); }, function (value) { return value; })(f);
        if (form instanceof Error) {
            throw form;
        }
        if (form.providers.has(provider.value.tag)) {
            var err = new Error("Provider tag name already exist");
            throw err;
        }
        var destroy = function (f, update) {
            var form = match$1(function () { return new Error("Invalid form instance for provider deactivation."); }, function (value) { return value; })(f);
            if (!(form instanceof Error)) {
                return update(FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER, provider.value.tag);
            }
            return update(FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER, provider.value.tag);
        };
        return {
            destroy: destroy,
            commit: update(FORM_INSTANCE_UPDATE_TYPE.REGISTER_PROVIDER, provider.value)
        };
    }
    function run(provider, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        resolve(right(data));
                    })];
            });
        });
    }
    function dispatch(form, providers) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var formdata = is.none(form.$form)
                            ? none
                            : some(new FormData(form.$form.value));
                        Promise.all(Array.from(providers.values()).map(function (provider) {
                            run(some(provider), formdata);
                        }))
                            .then(function () {
                            resolve(right(formdata));
                        })
                            .catch(function (err) { return resolve(left([err])); });
                    })];
            });
        });
    }
    function matchfield(provider, eventtype, fieldname) {
        if (!provider.events
            .map(function (e) { return e.toLowerCase(); })
            .includes(eventtype.toLowerCase()))
            return false;
        var target = match$1(function () { return ""; }, function (str) { return (string.is.nonempty(str) ? str.trim() : ""); })(fieldname);
        if (target && provider.exclude.includes(target))
            return false;
        if (!target &&
            [FORM_EVENT_TYPE.RESET, FORM_EVENT_TYPE.SUBMIT]
                .map(function (e) { return e.toLowerCase(); })
                .includes(eventtype.toLowerCase()))
            return true;
        var strictmode = provider.mode === PROVIDER_FIELD_MATCHING_MODE.CONJUNCTION;
        var tests = provider.include.map(function (expression) {
            if (expression instanceof RegExp)
                return expression.test(target);
            if (expression.trim() === target)
                return true;
            var $target = match$1(function () { return false; }, function ($value) { return $value; })($el.$field(target));
            if (!$target)
                return false;
            return $target.matches(expression);
        });
        return strictmode
            ? tests.every(function (testresult) { return testresult; })
            : tests.some(function (testresult) { return testresult; });
    }

    var FormFieldEvent = /** @class */ (function () {
        function FormFieldEvent(type, name) {
            this.type = type;
            this.name = name;
            this._tag = ACTION_TAG.FORM_FIELD_EVENT;
        }
        FormFieldEvent.create = function (evt) {
            var type = Object.values(FORM_FIELD_EVENT_TYPE).includes(evt.type)
                ? some(evt.type.toUpperCase())
                : none;
            var $field = $el.$field(evt.target);
            var fieldname = is.none($field) ? none : $el.fieldname($field.value);
            return some(new FormFieldEvent(type, fieldname));
        };
        return FormFieldEvent;
    }());
    var FormSubmissionEvent = /** @class */ (function () {
        function FormSubmissionEvent(data) {
            this.data = data;
            this._tag = ACTION_TAG.FORM_SUBMISSION_EVENT;
            this.type = FORM_EVENT_TYPE.SUBMIT;
        }
        FormSubmissionEvent.create = function (evt) {
            var $form = $el.$form(evt.target);
            if (is.none($form))
                return none;
            return some(new FormSubmissionEvent(some(new FormData($form.value))));
        };
        return FormSubmissionEvent;
    }());
    var FormResetEvent = /** @class */ (function () {
        function FormResetEvent(data) {
            this.data = data;
            this._tag = ACTION_TAG.FORM_RESET_EVENT;
            this.type = FORM_EVENT_TYPE.RESET;
        }
        FormResetEvent.create = function (evt) {
            var $form = $el.$form(evt.target);
            if (is.none($form))
                return none;
            return some(new FormResetEvent(some(new FormData($form.value))));
        };
        return FormResetEvent;
    }());
    function dispatcher($form, msg) {
        if (!is.none($form) && !is.none(msg)) {
            var event_1 = new CustomEvent(msg.value._tag.toLowerCase(), {
                detail: msg
            });
            $form.value.dispatchEvent(event_1);
        }
    }
    function init(instance, formfields, $getform, updatetouched) {
        var statesubscribers = new Set();
        var internallisteners = {
            formFieldEvents: function (evt) {
                evt.preventDefault();
                dispatcher($getform(instance()), FormFieldEvent.create(evt));
            },
            formSubmissionOrResetEvents: function (evt) {
                evt.preventDefault();
                evt.type === FORM_EVENT_TYPE.SUBMIT.toLowerCase()
                    ? dispatcher($getform(instance()), FormSubmissionEvent.create(evt))
                    : dispatcher($getform(instance()), FormResetEvent.create(evt));
            },
            msg: function (evt) {
                if (evt instanceof CustomEvent) {
                    var msg = evt.detail;
                    var f_1 = instance();
                    if (is.some(f_1)) {
                        var form = f_1.value;
                        updatetouched(msg);
                        var providers = router(form, formfields, evt.detail);
                        console.debug("Providers returned by router", providers);
                        dispatch(form, providers).then(function (result) {
                            var _f = instance();
                            var touched = is.some(_f)
                                ? Array.from(f_1.value.touched)
                                : [];
                            var geterrorbag = match(function (errors) {
                                return errors.reduce(function (record, err) {
                                    var _a;
                                    return Object.assign({}, record, (_a = {},
                                        _a[err.name] = err,
                                        _a));
                                }, {});
                            }, function () { return ({}); });
                            Array.from(statesubscribers.values()).forEach(function (fn) {
                                fn(geterrorbag(result), touched);
                            });
                        });
                    }
                }
            }
        };
        var $form = $getform(instance());
        if (is.none($form)) {
            return {
                unbindevents: function (f) {
                    Object.values(FORM_FIELD_EVENT_TYPE).forEach(function (eventtype) {
                        match$1(function () {
                            /** NoOp */
                        }, function (value) {
                            value.removeEventListener(eventtype.toLowerCase(), internallisteners.formFieldEvents, true);
                        })($getform(f));
                    });
                    [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(function (eventtype) {
                        match$1(function () {
                            /** NoOp */
                        }, function (value) {
                            value.removeEventListener(eventtype.toLowerCase(), internallisteners.formSubmissionOrResetEvents);
                        })($getform(f));
                    });
                    Object.values(ACTION_TAG).forEach(function (eventtype) {
                        match$1(function () {
                            /** NoOp */
                        }, function (value) {
                            value.removeEventListener(eventtype.toLowerCase(), internallisteners.msg);
                        })($getform(f));
                    });
                    statesubscribers.clear();
                },
                subscription: function (handler) {
                    statesubscribers.add(handler);
                    return function () {
                        statesubscribers.delete(handler);
                    };
                }
            };
        }
        Object.values(FORM_EVENT_TYPE).forEach(function (eventtype) {
            // if (!([FORM_EVENT_TYPE.INPUT] as string[]).includes(eventtype)) {
            //   $form.value.addEventListener(
            //     eventtype.toLowerCase(),
            //     internallisteners.formFieldEvents,
            //     true
            //   );
            // }
            $form.value.addEventListener(eventtype.toLowerCase(), internallisteners.formFieldEvents, true);
        });
        [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(function (eventtype) {
            $form.value.addEventListener(eventtype.toLowerCase(), internallisteners.formSubmissionOrResetEvents);
        });
        Object.values(ACTION_TAG).forEach(function (eventtype) {
            $form.value.addEventListener(eventtype.toLowerCase(), internallisteners.msg);
        });
        return {
            subscription: function (handler) {
                statesubscribers.add(handler);
                return function () {
                    statesubscribers.delete(handler);
                };
            },
            unbindevents: function (f) {
                Object.values(FORM_FIELD_EVENT_TYPE).forEach(function (eventtype) {
                    $form.value.removeEventListener(eventtype.toLowerCase(), internallisteners.formFieldEvents, true);
                    match$1(function () {
                        /** NoOp */
                    }, function (value) {
                        value.removeEventListener(eventtype.toLowerCase(), internallisteners.formFieldEvents, true);
                    })($getform(f));
                });
                [FORM_EVENT_TYPE.SUBMIT, FORM_EVENT_TYPE.RESET].forEach(function (eventtype) {
                    $form.value.removeEventListener(eventtype.toLowerCase(), internallisteners.formSubmissionOrResetEvents);
                    match$1(function () {
                        /** NoOp */
                    }, function (value) {
                        value.removeEventListener(eventtype.toLowerCase(), internallisteners.formSubmissionOrResetEvents);
                    })($getform(f));
                });
                Object.values(ACTION_TAG).forEach(function (eventtype) {
                    $form.value.removeEventListener(eventtype.toLowerCase(), internallisteners.msg);
                    match$1(function () {
                        /** NoOp */
                    }, function (value) {
                        value.removeEventListener(eventtype.toLowerCase(), internallisteners.msg);
                    })($getform(f));
                });
                statesubscribers.clear();
            }
        };
    }

    var base$1 = {
        $form: none,
        providers: new Map(),
        touched: new Set()
    };
    var $getform = function (f) {
        return match$1(function () { return none; }, function (value) { return value.$form; })(f);
    };
    var concat$2 = function (x, y) {
        var $form = concat(x.$form, y.$form ? y.$form : none);
        var providers = new Map();
        Array.from(x.providers.entries()).forEach(function (_a) {
            var _b = __read(_a, 2), name = _b[0], provider = _b[1];
            providers.set(name, provider);
        });
        if (y.providers instanceof Map) {
            Array.from(y.providers.entries()).forEach(function (_a) {
                var _b = __read(_a, 2), name = _b[0], provider = _b[1];
                providers.set(name, provider);
            });
        }
        var touched = new Set();
        Array.from(x.touched.values()).forEach(function (name) {
            touched.add(name);
        });
        if (y.touched instanceof Set) {
            Array.from(y.touched.values()).forEach(function (name) {
                touched.add(name);
            });
        }
        return {
            $form: $form,
            providers: providers,
            touched: touched
        };
    };
    var create$1 = function (formid) {
        var $form = $el.$form(formid);
        return from.nullable(concat$2(base$1, { $form: $form }));
    };
    var router = function (form, formfields, msg) {
        var e_1, _a;
        var _b;
        var providers = new Map();
        if (is.none(msg)) {
            return providers;
        }
        var eventtype = string.is.nonempty(msg.value.type)
            ? some(msg.value.type.trim())
            : msg.value.type;
        if (is.none(eventtype)) {
            return providers;
        }
        var fieldname = msg.value instanceof FormFieldEvent ? msg.value.name : none;
        var store = formfields.get();
        try {
            for (var _c = __values(form.providers.entries()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), providername = _e[0], provider = _e[1];
                if (is.some(fieldname) && ((_b = store.get(providername)) === null || _b === void 0 ? void 0 : _b.has(fieldname.value))) {
                    providers.set(providername, provider);
                    continue;
                }
                is.some(fieldname) &&
                    matchfield(provider, eventtype.value, fieldname) &&
                    providers.set(providername, provider);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        is.some(fieldname) &&
            providers.size &&
            formfields.set(__spread(providers.keys()), fieldname.value);
        return providers;
    };

    function getupdatefn(type, payload) {
        return function (instance) {
            if (is.some(instance)) {
                switch (type) {
                    case FORM_INSTANCE_UPDATE_TYPE.REGISTER_PROVIDER: {
                        if (!string.is.nonempty(payload)) {
                            var providers = new Map().set(payload.tag, payload);
                            return concat$2(instance.value, { providers: providers });
                        }
                        return instance.value;
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.DESTROY_PROVIDER: {
                        if (string.is.nonempty(payload)) {
                            var providers = new Map(instance.value.providers.entries());
                            providers.delete(payload.trim());
                            return concat$2(base$1, {
                                $form: instance.value.$form,
                                touched: instance.value.touched,
                                providers: providers
                            });
                        }
                        return instance.value;
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.SET_TOUCHED_FIELD: {
                        if (string.is.nonempty(payload)) {
                            var touched = new Set().add(payload);
                            return concat$2(instance.value, { touched: touched });
                        }
                        return instance.value;
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.SET_UNTOUCHED_FIELD: {
                        if (string.is.nonempty(payload)) {
                            var touched = new Set(instance.value.touched.keys());
                            touched.delete(payload);
                            return concat$2(base$1, {
                                $form: instance.value.$form,
                                providers: instance.value.providers,
                                touched: touched
                            });
                        }
                        return instance.value;
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.CLEAR_PROVIDERS: {
                        var providers = new Map();
                        return concat$2(base$1, {
                            $form: instance.value.$form,
                            providers: providers,
                            touched: instance.value.touched
                        });
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.CLEAR_TOUCHED_FIELDS: {
                        var touched = new Set();
                        return concat$2(base$1, {
                            $form: instance.value.$form,
                            providers: instance.value.providers,
                            touched: touched
                        });
                    }
                    case FORM_INSTANCE_UPDATE_TYPE.CLEAR: {
                        return concat$2(base$1, {
                            $form: instance.value.$form
                        });
                    }
                    default: {
                        return instance.value;
                    }
                }
            }
            else {
                return base$1;
            }
        };
    }
    function rxform(formid) {
        var ref = match$1(function () {
            return new Error("Inititalization failure. Form id provided did not match any form");
        }, function (f) { return f; })(create$1(formid));
        if (ref instanceof Error) {
            throw ref;
        }
        var instance = new Map().set(ref, ref);
        var form = function () {
            return from.nullable(instance.get(ref));
        };
        var updatetouched = function (msg) {
            if (is.some(msg) &&
                msg.value instanceof FormFieldEvent &&
                is.some(msg.value.type) &&
                [
                    FORM_FIELD_EVENT_TYPE.FOCUS.toLowerCase(),
                    FORM_FIELD_EVENT_TYPE.CHANGE.toLowerCase(),
                    FORM_FIELD_EVENT_TYPE.BLUR.toLowerCase()
                ].includes(msg.value.type.value.toLowerCase()) &&
                is.some(msg.value.name)) {
                var update = getupdatefn(FORM_INSTANCE_UPDATE_TYPE.SET_TOUCHED_FIELD, msg.value.name.value);
                instance.set(ref, update(form()));
            }
        };
        var formfieldsref = new Map();
        var formfields = {
            store: new Map().set(formfieldsref, formfieldsref),
            get: function () {
                var store = formfields.store.get(formfieldsref);
                return store ? store : formfieldsref;
            },
            set: function (providers, fieldname) {
                var store = formfields.get();
                if (array.type(providers) && string.is.nonempty(fieldname)) {
                    providers.forEach(function (provider) {
                        var collection = match$1(function () { return new Set(); }, function (value) { return value; })(from.nullable(store.get(provider)));
                        store.set(provider, collection.add(fieldname));
                    });
                }
                formfields.store.set(formfieldsref, store);
                return store;
            },
            remove: function (provider) {
                var store = formfields.get();
                if (string.is.nonempty(provider)) {
                    store.delete(provider);
                }
                formfields.store.set(formfieldsref, store);
                return store;
            }
        };
        var _a = init(form, formfields, $getform, updatetouched), subscription = _a.subscription, unbindevents = _a.unbindevents;
        var destroy = function () {
            var f = form();
            unbindevents(f);
            if (is.some(f)) {
                var update = getupdatefn(FORM_INSTANCE_UPDATE_TYPE.CLEAR, FORM_INSTANCE_UPDATE_TYPE.CLEAR);
                instance.set(ref, update(f));
                console.warn("rxform instance rendered useless", form());
            }
        };
        return {
            subscription: subscription,
            provider: function (name, options) {
                var provider = options
                    ? register(form(), getupdatefn, name, options)
                    : register(form(), getupdatefn, name);
                instance.set(ref, provider.commit(form()));
                return {
                    destroy: function () {
                        var commit = provider.destroy(form(), getupdatefn);
                        instance.set(ref, commit(form()));
                        formfields.remove(name);
                    }
                };
            },
            destroy: destroy
        };
    }

    return rxform;

})));
