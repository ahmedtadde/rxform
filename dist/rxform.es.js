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
var r,e=function(){return(e=Object.assign||function(r){for(var e,t=1,n=arguments.length;t<n;t++)for(var o in e=arguments[t])Object.prototype.hasOwnProperty.call(e,o)&&(r[o]=e[o]);return r}).apply(this,arguments)};function t(r,e,t,n){return new(t||(t=Promise))((function(o,i){function u(r){try{s(n.next(r))}catch(r){i(r)}}function a(r){try{s(n.throw(r))}catch(r){i(r)}}function s(r){r.done?o(r.value):new t((function(e){e(r.value)})).then(u,a)}s((n=n.apply(r,e||[])).next())}))}function n(r,e){var t,n,o,i,u={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function a(i){return function(a){return function(i){if(t)throw new TypeError("Generator is already executing.");for(;u;)try{if(t=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return u.label++,{value:i[1],done:!1};case 5:u.label++,n=i[1],i=[0];continue;case 7:i=u.ops.pop(),u.trys.pop();continue;default:if(!(o=(o=u.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){u=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){u.label=i[1];break}if(6===i[0]&&u.label<o[1]){u.label=o[1],o=i;break}if(o&&u.label<o[2]){u.label=o[2],u.ops.push(i);break}o[2]&&u.ops.pop(),u.trys.pop();continue}i=e.call(r,u)}catch(r){i=[6,r],n=0}finally{t=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,a])}}}!function(r){r.FOCUS="focus",r.INPUT="input",r.CHANGE="change",r.BLUR="blur",r.SUBMIT="submit",r.RESET="reset"}(r||(r={}));var o=function(r){throw r instanceof Error?r:new Error(JSON.stringify(r))},i=function(r){return Boolean(r)},u=function(r){return!i(r)},a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var s=function(r,e){return r(e={exports:{}},e.exports),e.exports}((function(r,e){var t="[object Arguments]",n="[object Function]",o="[object GeneratorFunction]",i="[object Map]",u="[object Set]",s=/\w*$/,c=/^\[object .+?Constructor\]$/,f=/^(?:0|[1-9]\d*)$/,l={};l[t]=l["[object Array]"]=l["[object ArrayBuffer]"]=l["[object DataView]"]=l["[object Boolean]"]=l["[object Date]"]=l["[object Float32Array]"]=l["[object Float64Array]"]=l["[object Int8Array]"]=l["[object Int16Array]"]=l["[object Int32Array]"]=l[i]=l["[object Number]"]=l["[object Object]"]=l["[object RegExp]"]=l[u]=l["[object String]"]=l["[object Symbol]"]=l["[object Uint8Array]"]=l["[object Uint8ClampedArray]"]=l["[object Uint16Array]"]=l["[object Uint32Array]"]=!0,l["[object Error]"]=l[n]=l["[object WeakMap]"]=!1;var v="object"==typeof a&&a&&a.Object===Object&&a,d="object"==typeof self&&self&&self.Object===Object&&self,p=v||d||Function("return this")(),m=e&&!e.nodeType&&e,h=m&&r&&!r.nodeType&&r,b=h&&h.exports===m;function g(r,e){return r.set(e[0],e[1]),r}function y(r,e){return r.add(e),r}function j(r,e,t,n){var o=-1,i=r?r.length:0;for(n&&i&&(t=r[++o]);++o<i;)t=e(t,r[o],o,r);return t}function _(r){var e=!1;if(null!=r&&"function"!=typeof r.toString)try{e=!!(r+"")}catch(r){}return e}function A(r){var e=-1,t=Array(r.size);return r.forEach((function(r,n){t[++e]=[n,r]})),t}function I(r,e){return function(t){return r(e(t))}}function O(r){var e=-1,t=Array(r.size);return r.forEach((function(r){t[++e]=r})),t}var w,E=Array.prototype,S=Function.prototype,x=Object.prototype,T=p["__core-js_shared__"],k=(w=/[^.]+$/.exec(T&&T.keys&&T.keys.IE_PROTO||""))?"Symbol(src)_1."+w:"",L=S.toString,M=x.hasOwnProperty,P=x.toString,B=RegExp("^"+L.call(M).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),U=b?p.Buffer:void 0,N=p.Symbol,$=p.Uint8Array,H=I(Object.getPrototypeOf,Object),F=Object.create,R=x.propertyIsEnumerable,C=E.splice,D=Object.getOwnPropertySymbols,V=U?U.isBuffer:void 0,q=I(Object.keys,Object),G=hr(p,"DataView"),J=hr(p,"Map"),z=hr(p,"Promise"),W=hr(p,"Set"),K=hr(p,"WeakMap"),Q=hr(Object,"create"),X=_r(G),Y=_r(J),Z=_r(z),rr=_r(W),er=_r(K),tr=N?N.prototype:void 0,nr=tr?tr.valueOf:void 0;function or(r){var e=-1,t=r?r.length:0;for(this.clear();++e<t;){var n=r[e];this.set(n[0],n[1])}}function ir(r){var e=-1,t=r?r.length:0;for(this.clear();++e<t;){var n=r[e];this.set(n[0],n[1])}}function ur(r){var e=-1,t=r?r.length:0;for(this.clear();++e<t;){var n=r[e];this.set(n[0],n[1])}}function ar(r){this.__data__=new ir(r)}function sr(r,e){var n=Ir(r)||function(r){return function(r){return function(r){return!!r&&"object"==typeof r}(r)&&Or(r)}(r)&&M.call(r,"callee")&&(!R.call(r,"callee")||P.call(r)==t)}(r)?function(r,e){for(var t=-1,n=Array(r);++t<r;)n[t]=e(t);return n}(r.length,String):[],o=n.length,i=!!o;for(var u in r)!e&&!M.call(r,u)||i&&("length"==u||yr(u,o))||n.push(u);return n}function cr(r,e,t){var n=r[e];M.call(r,e)&&Ar(n,t)&&(void 0!==t||e in r)||(r[e]=t)}function fr(r,e){for(var t=r.length;t--;)if(Ar(r[t][0],e))return t;return-1}function lr(r,e,a,c,f,v,d){var p;if(c&&(p=v?c(r,f,v,d):c(r)),void 0!==p)return p;if(!Sr(r))return r;var m=Ir(r);if(m){if(p=function(r){var e=r.length,t=r.constructor(e);e&&"string"==typeof r[0]&&M.call(r,"index")&&(t.index=r.index,t.input=r.input);return t}(r),!e)return function(r,e){var t=-1,n=r.length;e||(e=Array(n));for(;++t<n;)e[t]=r[t];return e}(r,p)}else{var h=gr(r),b=h==n||h==o;if(wr(r))return function(r,e){if(e)return r.slice();var t=new r.constructor(r.length);return r.copy(t),t}(r,e);if("[object Object]"==h||h==t||b&&!v){if(_(r))return v?r:{};if(p=function(r){return"function"!=typeof r.constructor||jr(r)?{}:(e=H(r),Sr(e)?F(e):{});var e}(b?{}:r),!e)return function(r,e){return pr(r,br(r),e)}(r,function(r,e){return r&&pr(e,xr(e),r)}(p,r))}else{if(!l[h])return v?r:{};p=function(r,e,t,n){var o=r.constructor;switch(e){case"[object ArrayBuffer]":return dr(r);case"[object Boolean]":case"[object Date]":return new o(+r);case"[object DataView]":return function(r,e){var t=e?dr(r.buffer):r.buffer;return new r.constructor(t,r.byteOffset,r.byteLength)}(r,n);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return function(r,e){var t=e?dr(r.buffer):r.buffer;return new r.constructor(t,r.byteOffset,r.length)}(r,n);case i:return function(r,e,t){return j(e?t(A(r),!0):A(r),g,new r.constructor)}(r,n,t);case"[object Number]":case"[object String]":return new o(r);case"[object RegExp]":return function(r){var e=new r.constructor(r.source,s.exec(r));return e.lastIndex=r.lastIndex,e}(r);case u:return function(r,e,t){return j(e?t(O(r),!0):O(r),y,new r.constructor)}(r,n,t);case"[object Symbol]":return a=r,nr?Object(nr.call(a)):{}}var a}(r,h,lr,e)}}d||(d=new ar);var I=d.get(r);if(I)return I;if(d.set(r,p),!m)var w=a?function(r){return function(r,e,t){var n=e(r);return Ir(r)?n:function(r,e){for(var t=-1,n=e.length,o=r.length;++t<n;)r[o+t]=e[t];return r}(n,t(r))}(r,xr,br)}(r):xr(r);return function(r,e){for(var t=-1,n=r?r.length:0;++t<n&&!1!==e(r[t],t,r););}(w||r,(function(t,n){w&&(t=r[n=t]),cr(p,n,lr(t,e,a,c,n,r,d))})),p}function vr(r){return!(!Sr(r)||(e=r,k&&k in e))&&(Er(r)||_(r)?B:c).test(_r(r));var e}function dr(r){var e=new r.constructor(r.byteLength);return new $(e).set(new $(r)),e}function pr(r,e,t,n){t||(t={});for(var o=-1,i=e.length;++o<i;){var u=e[o],a=n?n(t[u],r[u],u,t,r):void 0;cr(t,u,void 0===a?r[u]:a)}return t}function mr(r,e){var t,n,o=r.__data__;return("string"==(n=typeof(t=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==t:null===t)?o["string"==typeof e?"string":"hash"]:o.map}function hr(r,e){var t=function(r,e){return null==r?void 0:r[e]}(r,e);return vr(t)?t:void 0}or.prototype.clear=function(){this.__data__=Q?Q(null):{}},or.prototype.delete=function(r){return this.has(r)&&delete this.__data__[r]},or.prototype.get=function(r){var e=this.__data__;if(Q){var t=e[r];return"__lodash_hash_undefined__"===t?void 0:t}return M.call(e,r)?e[r]:void 0},or.prototype.has=function(r){var e=this.__data__;return Q?void 0!==e[r]:M.call(e,r)},or.prototype.set=function(r,e){return this.__data__[r]=Q&&void 0===e?"__lodash_hash_undefined__":e,this},ir.prototype.clear=function(){this.__data__=[]},ir.prototype.delete=function(r){var e=this.__data__,t=fr(e,r);return!(t<0)&&(t==e.length-1?e.pop():C.call(e,t,1),!0)},ir.prototype.get=function(r){var e=this.__data__,t=fr(e,r);return t<0?void 0:e[t][1]},ir.prototype.has=function(r){return fr(this.__data__,r)>-1},ir.prototype.set=function(r,e){var t=this.__data__,n=fr(t,r);return n<0?t.push([r,e]):t[n][1]=e,this},ur.prototype.clear=function(){this.__data__={hash:new or,map:new(J||ir),string:new or}},ur.prototype.delete=function(r){return mr(this,r).delete(r)},ur.prototype.get=function(r){return mr(this,r).get(r)},ur.prototype.has=function(r){return mr(this,r).has(r)},ur.prototype.set=function(r,e){return mr(this,r).set(r,e),this},ar.prototype.clear=function(){this.__data__=new ir},ar.prototype.delete=function(r){return this.__data__.delete(r)},ar.prototype.get=function(r){return this.__data__.get(r)},ar.prototype.has=function(r){return this.__data__.has(r)},ar.prototype.set=function(r,e){var t=this.__data__;if(t instanceof ir){var n=t.__data__;if(!J||n.length<199)return n.push([r,e]),this;t=this.__data__=new ur(n)}return t.set(r,e),this};var br=D?I(D,Object):function(){return[]},gr=function(r){return P.call(r)};function yr(r,e){return!!(e=null==e?9007199254740991:e)&&("number"==typeof r||f.test(r))&&r>-1&&r%1==0&&r<e}function jr(r){var e=r&&r.constructor;return r===("function"==typeof e&&e.prototype||x)}function _r(r){if(null!=r){try{return L.call(r)}catch(r){}try{return r+""}catch(r){}}return""}function Ar(r,e){return r===e||r!=r&&e!=e}(G&&"[object DataView]"!=gr(new G(new ArrayBuffer(1)))||J&&gr(new J)!=i||z&&"[object Promise]"!=gr(z.resolve())||W&&gr(new W)!=u||K&&"[object WeakMap]"!=gr(new K))&&(gr=function(r){var e=P.call(r),t="[object Object]"==e?r.constructor:void 0,n=t?_r(t):void 0;if(n)switch(n){case X:return"[object DataView]";case Y:return i;case Z:return"[object Promise]";case rr:return u;case er:return"[object WeakMap]"}return e});var Ir=Array.isArray;function Or(r){return null!=r&&function(r){return"number"==typeof r&&r>-1&&r%1==0&&r<=9007199254740991}(r.length)&&!Er(r)}var wr=V||function(){return!1};function Er(r){var e=Sr(r)?P.call(r):"";return e==n||e==o}function Sr(r){var e=typeof r;return!!r&&("object"==e||"function"==e)}function xr(r){return Or(r)?sr(r):function(r){if(!jr(r))return q(r);var e=[];for(var t in Object(r))M.call(r,t)&&"constructor"!=t&&e.push(t);return e}(r)}r.exports=function(r){return lr(r,!0,!0)}})),c=function(r){return"boolean"==typeof r},f=function(r){return function(r){return null===r&&"object"==typeof r}(r)||function(r){return void 0===r&&void 0===r}(r)},l=function(r){return"string"==typeof r||r instanceof String},v=function(r,e){if(u(l(r))&&o("Invalid argument value; value must be a string"),["left","right","both"].includes(e))switch(e){case"left":return r.trimLeft();case"right":return r.trimRight();case"both":default:return r.trim()}return r.trim()},d=function(r){return l(r)&&Boolean(v(r))},p=function(r){return"number"==typeof r&&u(isNaN(r))},m=function(r){return null!==r&&u(Array.isArray(r))&&"object"==typeof r},h=function(r){return m(r)&&"Object"===r.constructor.name},b=function(r){return Array.isArray(r)&&i(r.length)},g=function(r){return"function"==typeof r&&r instanceof Function},y=function(r){return g(r)||m(e=r)&&g(e.then)&&e instanceof Promise;var e},j=function(r){for(var e=[],t=1;t<arguments.length;t++)e[t-1]=arguments[t];return u(g(r))&&o("function argument (fn) is invalid; received value of type "+typeof r),new Promise((function(t,n){try{var o=e.map((function(r){return A(r)&&u(r instanceof Element)&&u(r instanceof Event)?O(r):r}));t(r.apply(void 0,o))}catch(r){n(r)}}))},_=function(r){return h(r)&&i(Object.keys(r).length)},A=function(r){return u(f(r))&&(Array.isArray(r)||m(r)||g(r))},I=function(r,e){var t,n=(d(t=e)||o("Invalid obj path expression: "+JSON.stringify(t)),t.split(".")),i=function(r,e){var t,n,i=(t=e,n=new RegExp("[[0-9]+]"),"[]"!==t&&n.test(t)?Number(t.replace(/\[/g,"").replace(/\]/g,"")):t);return p(i)?(Array.isArray(r)||o("Invalid obj; expected an array to extract value by index"),r[i]):d(i)?(h(r)||o("Invalid obj; expected a plain object to extract value using accessor key"),r[i]):void o("Invalid key to extract value from obj")};if(1===n.length)try{return i(r,n[0])}catch(r){o(r)}else if(n.length>1)try{return I(i(r,n[0]),n.slice(1).join("."))}catch(r){o(r)}return r};function O(r){return function r(e){return Object.freeze(e),Object.getOwnPropertyNames(e).forEach((function(t){!e.hasOwnProperty(t)||null===e[t]||"object"!=typeof e[t]&&"function"!=typeof e[t]||Object.isFrozen(e[t])||r(e[t])})),e}(s(r))}function w(r){return function(r){return r instanceof HTMLInputElement}(r)||function(r){return r instanceof HTMLSelectElement}(r)||function(r){return r instanceof HTMLTextAreaElement}(r)}function E(r,e){var t=d(r)?r:"",n=function(r){var e=r.querySelector(t);return e instanceof Element?e:o("Invalid query selector")};return e instanceof Element?n(e):n(document)}var S=function(r){var e=function(r){u(function(r){return r instanceof HTMLFormElement}(r))&&o("Invalid form target value")};if(r instanceof HTMLFormElement)return r;if(r instanceof Element)return e(r),r;if(d(r)){var t=E(r);return e(t),t}};function x(e,t,n){return n.forEach((function(n){var i=n.type,a=n.registerAs,s=n.options,c=function(r,e,t,n){var i=r instanceof Element?r:E(r);return u(i instanceof Element)&&o("Invalid target param... resolved to non DOM element"),i.addEventListener(e,t,n||{}),function(r){return i.removeEventListener(e,t,n||{})}}(t,i,(function(t){t.type===r.SUBMIT&&t.preventDefault(),e.emit(a,t)}),void 0===s?{}:s);e.on("form@remove-dom-listeners",c)})),e}function T(r){return(f(r)||u(w(r)))&&o("Invalid form field element param"),r instanceof HTMLInputElement?function(r){u(r instanceof HTMLInputElement)&&o("Invalid form field element param");return function(r){switch(r.type){case"image":case"file":case"button":case"reset":case"submit":return null;case"number":return Number(r.value);case"checkbox":case"radio":return r.checked?r.value:null;default:return r.value}}(r)}(r):r instanceof HTMLSelectElement?function(r){u(r instanceof HTMLSelectElement)&&o("Invalid form field element param");return e=r,e.multiple?(t=e,n=Array.isArray(t.options)?t.options:[],Array.from(n).filter((function(r){return r.selected})).map((function(r){return f(r.value)&&f(r.text)?null:f(r.value)?r.text:r.value}))):function(r){return Array.isArray(r.options)&&p(r.selectedIndex)&&r.options[r.selectedIndex]&&u(f(r.options[r.selectedIndex].value))&&r.options[r.selectedIndex].value||null}(e);var e,t,n}(r):r instanceof HTMLTextAreaElement?function(r){u(r instanceof HTMLTextAreaElement)&&o("Invalid form field element param");return r.value}(r):void 0}function k(r){var e=(h(r)?r:{}).target,t=void 0===e?"":e;if(u(d(t)))return{errors:["Invalid target DOM selector. Expected a non empty string"],target:null};try{return S(t),{errors:null,target:v(t)}}catch(r){return{errors:["Invalid target DOM selector. No form element matched."],target:null}}}function L(r){var e=(h(r)?r:{}).onsubmit,t=void 0===e?null:e;return u(g(t))?{errors:["Invalid form submission handler. Expected a function"],onsubmit:null}:{errors:null,onsubmit:t}}function M(r){var t=(h(r)?r:{}).values,n=void 0===t?{}:t,o=function(r){var e=(h(r)?r:{}).state,t=void 0===e?{}:e;if(u(_(t)))return{errors:["In values config, initial state is invalid. Expected a non empty plain object"],state:null};return{errors:null,state:t}}(n),a=function(r){var t=(h(r)?r:{}).providers,n=void 0===t?[]:t;if(u(b(n)))return{errors:["In values config, providers is invalid. Expected a non empty array"],providers:null};var o=n.reduce((function(r,t,n){var o=function(r){switch(t=r,d(t)?"is-string":_(t)&&d(t.selector)?"is-plain-object":Array.isArray(t)&&b(t.slice(0,3).filter((function(r){return d(r)||c(r)})))?"is-array":void 0){case"is-string":return{errors:null,provider:{selector:v(r)}};case"is-plain-object":return{errors:null,provider:e(e({},r),{selector:v(r.selector)})};case"is-array":return 1===r.length&&d(r[0])?{errors:null,provider:{selector:v(r[0])}}:2===r.length&&d(r[0])?{errors:null,provider:Object.assign({selector:r[0]},d(r[1])?{dispatch:r[1]}:{multiple:i(r[1])})}:3===r.length&&d(r[0])&&d(r[1])?{errors:null,provider:{dispatch:r[1],multiple:i(r[2]),selector:r[0]}}:{errors:function(r){return["In values config, provider "+r+" is invalid. Array config is malformed"]},provider:null};default:return{errors:function(r){return["In values config, provider "+r+" is invalid. Provider can be declared using a string (selector), an array [selector, (dispatch | multiple)?, multiple?], or a plain object {selector, dispatch?, events?, transformer?}"]},provider:null}}var t}(t),u=o.errors,a=o.provider;return u||!a?Object.assign({},r,{errors:r.errors.concat(u?u(n+1):"In values config, provider "+(n+1)+" is invalid.")}):Object.assign({},r,{providers:r.providers.concat(a)})}),{errors:[],providers:[]});if(b(o.errors))return{errors:o.errors,providers:null};return{errors:null,providers:o.providers}}(n),s=function(r){var e=(h(r)?r:{}).reducer,t=void 0===e?null:e;if(u(g(t)))return{errors:["In values config, reducer is invalid. Expected a function"],reducer:null};return{errors:null,reducer:t}}(n);return b(o.errors)||b(a.errors)||b(s.errors)?{errors:[].concat(b(o.errors)?o.errors:[]).concat(b(a.errors)?a.errors:[]).concat(b(s.errors)?s.errors:[]),values:null}:{errors:null,values:{providers:a.providers,reducer:s.reducer,state:o.state}}}function P(r){var t=(h(r)?r:{}).errors,n=void 0===t?{}:t,o=function(r){var e=(h(r)?r:{}).state,t=void 0===e?{}:e;if(u(_(t)))return{errors:["In errors config, initial state is invalid. Expected a non empty plain object or nothing at all"],state:null};return{errors:null,state:t}}(n),i=function(r){var t=(h(r)?r:{}).providers,n=void 0===t?[]:t;if(u(b(n)))return{errors:["In errors config, providers is invalid. Expected a non empty array"],providers:null};var o=n.reduce((function(r,t,n){var o=function(r){switch(t=r,d(t)?"is-string":_(t)&&d(t.dispatch)?"is-plain-object":Array.isArray(t)&&t.slice(0,3).filter((function(r){return d(r)||g(r)})).length>=2?"is-array":void 0){case"is-string":return{errors:null,provider:{dispatch:v(r)}};case"is-plain-object":return{errors:null,provider:e(e({},r),{dispatch:v(r.dispatch)})};case"is-array":return 2===r.length&&d(r[0])&&g(r[1])?{errors:null,provider:{dispatch:r[0],validator:r[1]}}:3===r.length&&d(r[0])&&g(r[1])&&(g(r[2])||d(r[2]))?{errors:null,provider:{dispatch:r[0],message:r[2],validator:r[1]}}:{errors:function(r){return["In errors config, provider "+r+" is invalid. Array config is malformed"]},provider:null};default:return{errors:function(r){return["In errors config, provider "+r+" is invalid. Provider can   be declared using a string (dispatch), an array [dispatch (string), validator (function), message (string | function)], or a plain  object {dispatch, input?, message?, predicate?, validator?}"]},provider:null}}var t}(t),i=o.errors,u=o.provider;return i||!u?Object.assign({},r,{errors:r.errors.concat(i?i(n+1):"In errors config, provider "+(n+1)+" is invalid.")}):Object.assign({},r,{providers:r.providers.concat(u)})}),{errors:[],providers:[]});if(b(o.errors))return{errors:o.errors,providers:null};return{errors:null,providers:o.providers}}(n),a=function(r){var e=(h(r)?r:{}).reducer,t=void 0===e?null:e;if(u(g(t)))return{errors:["In errors config, reducer is invalid. Expected a function"],reducer:null};return{errors:null,reducer:t}}(n);return b(o.errors)||b(i.errors)||b(a.errors)?{errors:[].concat(b(o.errors)?o.errors:[]).concat(b(i.errors)?i.errors:[]).concat(b(a.errors)?a.errors:[]),values:null}:{errors:null,errorsConfig:{providers:i.providers,reducer:a.reducer,state:o.state}}}var B=function(e,t,n){return x(t,e,[{type:r.FOCUS,registerAs:"form@focus"},{type:r.INPUT,registerAs:"form@input"},{type:r.CHANGE,registerAs:"form@change"},{type:r.BLUR,registerAs:"form@blur",options:!0},{type:r.SUBMIT,registerAs:"form@submit"},{type:r.RESET,registerAs:"form@reset"}])},U=function(r){return r},N=function(r){return function(e){return r}},$=function(r,e,t){var n,i,a,s,c={errorMessage:C(t),formErrors:D(e),formStatus:V(e),hookListeners:(n=t,i=Object.assign({},{start:U,end:U},h(n.hooks)||{}),{end:y(i.end)?i.end:U,start:y(i.start)?i.start:U}),noop:function(){return Symbol.for("form@error-provider[no-validation]")},ok:function(){return Symbol.for("form@error-provider[no-errors]")},validator:R(t),validatorInput:H(t),validatorPredicate:F(t)};return e.on("form@values",(a=e,s=Object.assign({},r,t,c),function(r){return function(r,e){h(r)||o("Invalid form values state obj; expected plain object");var t,n=e.formErrors(),i=e.formStatus();u(i.submitting)&&j(e.hookListeners.start,r,n,i).then((function(){return j(e.validatorPredicate,r,n,i)})).then((function(t){return t?j(e.validatorInput,r,n,i):Promise.resolve(e.noop())})).then((function(o){return(t=o)===e.noop()?Promise.resolve(e.noop()):j(e.validator,t,r,n,i)})).then((function(o){return o===e.noop()||!0===Boolean(o)?Promise.resolve(e.ok()):j(e.errorMessage,t,r,n,i)})).then((function(u){if(d(e.dispatch)||o("Invalid error provider 'dispatch' option value: expected a string"),u===e.ok()){var a={error:null,type:e.dispatch};return e.emitter$.emit("form@error",a),j(e.hookListeners.end,a)}return a={error:{context:{errors:n,input:t,status:i,values:r},message:u},type:e.dispatch},e.emitter$.emit("form@error",a),j(e.hookListeners.end,{error:a.error.message,input:t,type:a.type})})).then((function(){return!0})).catch((function(r){o(r)}))}(r,Object.assign({},s,{emitter$:a}))})),!0};function H(r){var e;switch(e=r.input,g(e)?"is-function":d(e)?"is-string":Array.isArray(e)&&b(e.filter((function(r){return d(r)})))?"is-array-of-string":void 0){case"is-string":return function(e){return I(e,r.input)};case"is-array-of-string":return function(e){return r.input.map((function(r){return I(e,r)}))};case"is-function":return r.input;default:return U}}function F(r){return y(r.predicate)?r.predicate:N(!0)}function R(r){return y(r.validator)?r.validator:N(!0)}function C(r){var e;switch(e=r.message,y(e)?"is-function-or-promise":d(e)?"is-string":void 0){case"is-string":return N(r.message);case"is-function-or-promise":return r.message;default:return d(r.dispatch)||o("Invalid error provider 'dispatch' option value: expected a string"),N('"'+r.dispatch+'" error(s)')}}function D(r){var e={};return r.on("form@errors",(function(r){e=r})),function(){return e}}function V(r){var e={fields:{},submitting:!1};return r.on("form@status",(function(r){e=r})),function(){return e}}var q=function(r,e,t){return t.errors.providers.forEach((function(t){$(r,e,t)})),e},G=function(r,e){var t,n,i={getStates:(t=e,n={current:J(t),previous:null},function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return r.length?(h(r[0])&&(n={current:O(r[0]),previous:n.current}),n):n}),hookListeners:W(e),reducer:z(e)},u=function(r,e,t){return function(n){return function(r,e){var t=e.getStates().current;j(e.hookListeners.before,{currentState:t,newValue:r}).then((function(){return j(e.reducer,t,r)})).then((function(r){h(r)||o("Invalid errors' state data; expected plain object");var t=e.getStates(r);return e.emitter$.emit("form@errors",O(t.current)),j(e.hookListeners.after,{currentState:t.current,previousState:t.previous})})).then((function(){return!0})).catch((function(r){o(r)}))}(n,Object.assign({},e,t,{emitter$:r}))}};return r.on("form@error",u(r,e,i)),r.on("form@reset",(function(){var e=i.getStates({});r.emit("form@errors",O(e.current))})),r.on("set-errors",(function(e){h(e)||o("Invalid errors' state object");var t=i.getStates(e);r.emit("form@errors",O(t.current))})),u};function J(r){return O(h(r.state)?r.state:{})}function z(r){return y(r.reducer)?r.reducer:o("Invalid errors' state reducer")}function W(r){var e=Object.assign({},{before:U,after:U},r.hooks||{});return Object.keys(e).reduce((function(r,t){var n,o=y(e[t])?e[t]:U;return Object.assign({},r,((n={})[t]=o,n))}),{})}var K=function(r,e,t){return G(e,t.errors),e},Q=console.info,X=console.warn,Y={error:console.error,info:Q,warning:X},Z=function(r,e,t){var n,i=function(r){return function(t){h(t)||o("Invalid "+r+"' state object"),e.emit("set-"+r,t)}},u={dispatch:{errors:i("errors"),status:i("status"),values:i("values")},errors:tr(e),handler:rr(t),status:nr(e),values:er(e,t)};return e.on("form@submit",(n=u,function(r){return function(r,e){j(e.handler,e.values(),e.errors(),e.status(),e.dispatch).then((function(){return!0})).catch((function(r){Y.error("unexpected error occurred while running form submission"),o(r)}))}(0,n)})),e};function rr(r){return y(r.onsubmit)||o("Invalid form submission handler"),r.onsubmit}function er(r,e){var t=function(r){var e=I(r,"values.state");return h(e)?e:o("Invalid initial values' state")}(e);return r.on("form@values",(function(r){t=r})),function(){return t}}function tr(r){var e={};return r.on("form@errors",(function(r){e=r})),function(){return e}}function nr(r){var e={fields:{},submitting:!1};return r.on("form@status",(function(r){e=r})),function(){return e}}var or=function(e){var t={fields:{},submitting:!1},n=[r.BLUR,r.CHANGE,r.SUBMIT,r.RESET];return n.forEach((function(n){return e.on("form@"+n,(i=e,function(e){if(u([r.SUBMIT,r.RESET].includes(e.type)||e.target instanceof HTMLInputElement&&["submit","reset","file","button","image"].includes(e.target.type)||e.target instanceof HTMLButtonElement&&["submit","reset"].includes(e.target.type))){var n=e.target;d(n.name)||o("Target element has no name attribute: "+JSON.stringify(n));var a=h(t.fields[n.name.trim()])?t.fields[n.name.trim()]:{};t.fields[n.name.trim()]=function(r){switch(r.type){case"blur":return["touched"];case"change":return["modified"];case"submit":return["touched","modified"];default:return[]}}(e).reduce((function(r,e){var t;return a[e]?r:Object.assign({},r,((t={})[e]=!0,t))}),a)}"submit"===e.type?t.submitting=!0:"reset"===e.type&&(t={fields:{},submitting:!1}),i.emit("form@status",O(t))}));var i})),e.on("set-status",(function(r){h(r)||o("Invalid status' state object"),h(r.fields)||o("Invalid status' state object; 'fields' prop is required and its value must be a plain object"),c(r.submitting)||o("Invalid status' state object; 'submitting' prop is required and its value must be boolean"),t=r,e.emit("form@status",O(t))})),e},ir=function(r,e,t){return or(e),e},ur=function(r,e,i){var a,s,f=function(r){switch(e=r,d(e)?"is-string":h(e)?"is-plain-object":Array.isArray(e)&&b(e.slice(0,3).filter((function(r){return d(r)||c(r)})))?"is-array":void 0){case"is-string":return{selector:r};case"is-plain-object":return r;case"is-array":if(1===r.length)return{selector:r[0]};if(2===r.length)return Object.assign({},{selector:r[0]},d(r[1])?{dispatch:r[1]}:{multiple:Boolean(r[1])});if(3===r.length)return{dispatch:r[1],multiple:Boolean(r[2]),selector:r[0]};o("Invalid value provider option")}var e}(i),l={formStatus:fr(e),hookListeners:(a=f,s=Object.assign({},{start:U,end:U},h(a.hooks)||{}),{end:y(s.end)?s.end:U,start:y(s.start)?s.start:U}),parseAsArray:cr(f),parser:ar(f),transformer:sr(f)},v=function(r,e,i){return function(a){return function(r,e){var i=e.parseAsArray()?(a=e.selector,c=d(a)?a:"",f=function(r){var e=Array.from(r.querySelectorAll(c));return e.length?e:o("Invalid query selector")},s instanceof Element?f(s):f(document)):[r.target];var a,s,c,f;i.length&&i.every((function(r){return w(r)}))||o("Invalid target element(s) for selector "+e.selector);e.parseAsArray()||1===i.length||o("Invalid selector "+e.selector+"; must target single form field element");var l=e.formStatus();u(l.submitting)&&j(e.hookListeners.start,r).then((function(){return function(r,e){return t(this,void 0,void 0,(function(){return n(this,(function(t){return[2,Promise.all(e.map((function(e){return j(r,e).then((function(r){return{name:e.name||o("Target element has no name attribute: "+JSON.stringify(e)),value:r}}))})))]}))}))}(e.parser,i)})).then((function(r){return function(r,e){return t(this,void 0,void 0,(function(){return n(this,(function(t){return[2,Promise.all(e.map((function(e){return j(r,e)})))]}))}))}(e.transformer,r)})).then((function(r){var t={type:e.dispatch||e.selector,value:e.parseAsArray()?r:r[0]};return e.emitter$.emit("form@value",t),j(e.hookListeners.end,t)})).then((function(){return!0})).catch((function(r){o(r)}))}(a,Object.assign({},e,i,{emitter$:r}))}};return e.on('form@provider[selector="'+f.selector+'"]',v(e,Object.assign({},r,f),l)),v};function ar(r){return y(r.parser)?r.parser:T}function sr(r){return y(r.transformer)?r.transformer:function(r){return r.value}}function cr(r){return N(!0===r.multiple)}function fr(r){var e={fields:{},submitting:!1};return r.on("form@status",(function(r){e=r})),function(){return e}}var lr=function(r,e,t){return t.values.providers.forEach((function(t){ur(r,e,t)})),e},vr=function(e,t,n){var i=[r.BLUR,r.CHANGE,r.FOCUS,r.INPUT,r.SUBMIT],u=n.values.providers.map(pr).map((function(r){return{events:dr(r,i),selector:d(r.selector)?r.selector:o("Invalid value provider DOM selector value")}}));return i.forEach((function(r){return t.on("form@"+r,(e=t,o=u,function(r){var t=o.findIndex((function(e){return e.events.includes(r.type)&&r.target instanceof Element&&r.target.matches("form"+n.target+" "+e.selector)}));if(-1!==t){var i=o[t];e.emit('form@provider[selector="'+i.selector+'"]',r)}}));var e,o})),t.on("form@"+r.RESET,(function(){return e.reset()})),t};function dr(r,e){var t,n,i;return n=e,i=r.events,t=!1===i?["submit"]:(Array.isArray(i)&&i.length?i:[]).reduce((function(r,e){return n.includes(e)?r.concat(e):r}),[]),Array.isArray(t)&&t.length?t.concat("submit"):Array.isArray(t)?["blur","change","submit"]:(o("Invalid events extracted from value provider option object: "+JSON.stringify(t)),[])}function pr(r){var e;switch(d(e=r)?"is-string":h(e)?"is-plain-object":Array.isArray(e)&&b(e.slice(0,3).filter((function(r){return d(r)||c(r)})))?"is-array":void 0){case"is-string":return{selector:r};case"is-plain-object":return r;case"is-array":if(1===r.length)return{selector:r[0]};if(2===r.length)return Object.assign({},{selector:r[0]},d(r[1])?{dispatch:r[1]}:{multiple:Boolean(r[1])});if(3===r.length)return{dispatch:r[1],multiple:Boolean(r[2]),selector:r[0]};o("Invalid value provider option")}}var mr=function(r,e){var t,n,i={getStates:(t=e,n={current:hr(t),previous:null},function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return r.length?(h(r[0])&&(n={current:O(r[0]),previous:n.current}),n):n}),hookListeners:gr(e),reducer:br(e)},a=function(r,e,t){return function(n){return function(r,e){var t=e.getStates().current;j(e.hookListeners.before,{currentState:t,newValue:r}).then((function(){return j(e.reducer,t,r)})).then((function(r){h(r)||o("Invalid state values data; expected plain object");var t=e.getStates(r);return e.emitter$.emit("form@values",O(t.current)),j(e.hookListeners.after,{currentState:t.current,previousState:t.previous})})).then((function(){return!0})).catch((function(r){o(r)}))}(n,Object.assign({},e,t,{emitter$:r}))}};return r.on("form@value",a(r,e,i)),r.on("form@reset",(function(t){var n=i.getStates(u(t instanceof Event)&&h(t)?t:hr(e));r.emit("form@values",O(n.current))})),r.on("set-values",(function(e){h(e)||o("Invalid values' state object");var t=i.getStates(e);r.emit("form@values",O(t.current))})),a};function hr(r){return h(r.state)?O(r.state):o("Invalid initial values' state")}function br(r){return y(r.reducer)?r.reducer:o("Invalid values' state reducer")}function gr(r){var e=Object.assign({},{before:U,after:U},r.hooks||{});return Object.keys(e).reduce((function(r,t){var n,o=y(e[t])?e[t]:U;return Object.assign({},r,((n={})[t]=o,n))}),{})}var yr=function(r,e,t){return mr(e,t.values),e};function jr(r){return r=r||Object.create(null),{on:function(e,t){(r[e]||(r[e]=[])).push(t)},off:function(e,t){r[e]&&r[e].splice(r[e].indexOf(t)>>>0,1)},emit:function(e,t){(r[e]||[]).slice().map((function(r){r(t)})),(r["*"]||[]).slice().map((function(r){r(e,t)}))}}}var _r=function(r){var t=function(r){return[{prop:"target",fn:k},{prop:"values",fn:M},{prop:"errors",fn:P},{prop:"onsubmit",fn:L}].reduce((function(t,n){var o,i=n.fn(r);if(b(i.errors))return Object.assign({},t,{errors:t.errors.concat(i.errors)});var u;return Object.assign({},t,{model:e(e({},r),(o={},o[(u=n.prop,"errorsConfig"===u?"errors":u)]=i[n.prop],o))})}),{model:{},errors:[]})}(O(r)),n=t.model,i=t.errors,u=void 0===i?null:i;b(u)&&o(u.join("; "));var a=function(r){var e=S(r.target),t=jr();return[B,vr,lr,yr,q,K,ir,Z].forEach((function(n){return n(e,t,r)})),t}(n),s=jr();a.on("form@values",(function(r){s.emit("form@values",r)})),a.on("form@errors",(function(r){s.emit("form@errors",r)})),a.on("form@status",(function(r){s.emit("form@status",r)}));return{stream$:s,destroy:function(){s&&(s.emit("destroy"),setTimeout((function(){s=null}),1e3)),a&&(a.emit("form@remove-dom-listeners"),a.emit("destroy"),setTimeout((function(){a=null}),1e3))}}};module.exports=_r;export default _r;
//# sourceMappingURL=rxform.es.js.map
