!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/static/",n(n.s=14)}([function(t,e,n){t.exports=n(2)(2)},function(t,e,n){"use strict";function r(t,e,n,r,o,i,c,a){var u,s="function"==typeof t?t.options:t;if(e&&(s.render=e,s.staticRenderFns=n,s._compiled=!0),r&&(s.functional=!0),i&&(s._scopeId="data-v-"+i),c?(u=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),o&&o.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(c)},s._ssrRegister=u):o&&(u=a?function(){o.call(this,this.$root.$options.shadowRoot)}:o),u)if(s.functional){s._injectStyles=u;var f=s.render;s.render=function(t,e){return u.call(e),f(t,e)}}else{var l=s.beforeCreate;s.beforeCreate=l?[].concat(l,u):[u]}return{exports:t,options:s}}n.d(e,"a",function(){return r})},function(t,e){t.exports=__vendor_698183e20989aa510462__},,,,function(t,e,n){(function(t){var r,o,i,c,a;function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{},r=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),r.forEach(function(e){s(t,e,n[e])})}return t}function s(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}a=c=function(){var t=n(18),e=function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e&&Object.entries(e).forEach(function(n){var r=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var c,a=t[Symbol.iterator]();!(r=(c=a.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(n,2),o=r[0],i=r[1];"object"===f(i)?t(i):"string"==typeof i&&(e[o]=i.trim())})},r={Accept:"application/json","Content-Type":"application/json"};function o(t){var e={};return t.headers&&(e=t.headers,delete t.headers),{credentials:"same-origin",headers:u({},r,e,{headers:e})}}function i(e){var n={};return Object.keys(e).forEach(function(t){void 0!==e[t]&&(n[t]=e[t])}),t.stringify(n)}function c(t){return t.status>=200&&t.status<300?t:t.json().then(function(e){var n=new Error(e&&e.msg||t.statusText);return e&&e.code&&(n.code=e.code),n}).catch(function(){return new Error(t.statusText)}).then(function(t){throw t.type="http",t})}function a(t){return t.json().catch(function(e){throw e&&(e.res=t),e})}function s(t){if(!t){var e=new Error(t);throw e.data=t,e.type="data",e}if(0===t.code)return t.data;if(!t.code&&!t.msg)return t;if(t.msg){var n=new Error(t.msg);throw n.data=t,n.type="data",n}}function l(t,e){e.headers["Content-Type"]&&~e.headers["Content-Type"].toLowerCase().indexOf("multipart/form-data")&&delete e.headers["Content-Type"];var n=fetch(t,e);return n.then(c).then(a).then(s)}return{get:function(n){var r=n.url,c=n.params,a=void 0===c?{}:c,s=n.options,f=o(void 0===s?{}:s),d=r.split("?")[1]||"";r=r.split("?")[0];try{d=t.parse(d)}catch(t){console.error("request:get",d,t)}return d=Object.assign(d||{},a),e(d),l(r+="?".concat(i(d)),u({method:"GET",params:a},f))},post:function(t){var n=t.url,r=t.body,c=void 0===r?{}:r,a=t.options,s=o(void 0===a?{}:a);switch(!0){case s.headers["Content-Type"].indexOf("application/json")>=0:e(c),c=function(t){return JSON.stringify(t)}(c);break;case s.headers["Content-Type"].indexOf("application/x-www-form-urlencoded")>=0:c=i(c);break;case s.headers["Content-Type"].indexOf("multipart/form-data")>=0:c=function(t){if(t instanceof FormData)return t;var e=new FormData;return Object.keys(t).forEach(function(n){e.append(n,t[n])}),e}(c)}return l(n,u({method:"POST",body:c},s))}}},"undefined"!=typeof window&&(a=c()),"object"===f(e)&&"object"===f(t)?t.exports=a:(o=[],void 0===(i="function"==typeof(r=a)?r.apply(e,o):r)||(t.exports=i))}).call(this,n(17)(t))},function(t,e){},,,function(t,e,n){"use strict";var r=function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"layout",attrs:{id:"app"}},[e("div",{staticClass:"wrapper",attrs:{id:"wrapper"}},[e("div",{staticClass:"main"},[this._t("default")],2)])])};r._withStripped=!0;var o=(n(16),n(1)),i=Object(o.a)({name:"SgLayout",data:function(){return{}}},r,[],!1,null,null,null);i.options.__file="client/zoo/components/layout/src/layout.vue";var c=i.exports;c.install=function(t){t.component(c.name,c)};var a=[c],u=n(6),s=n.n(u);e.a={install:function(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1],a.forEach(function(e){t.component(e.name,e)}),t.prototype.$get=s.a.get,t.prototype.$post=s.a.post,"undefined"!=typeof window&&(window.__request_error_callback__=function(t,e){console.error("Fetch Error [ ".concat(e.url," ]: ").concat(t))})}}},function(t,e,n){"use strict";var r={};n.r(r),n.d(r,"getBaike",function(){return a});var o={};n.r(o),n.d(o,"getArticleAuxiliary",function(){return u}),n.d(o,"getArticleRecommend",function(){return s}),n.d(o,"getArticleAdvertise",function(){return f});var i=n(6),c=n.n(i),a={url:"/api/news/getBaike",method:"get",mock:!1,thenable:function(t){return t.data&&t.data[0]}},u={url:"/api/proxy/resource/article/auxiliary",method:"get",mock:!0,thenable:function(t){return t}},s={url:"/api/proxy/resource/article/recommend",method:"get",mock:!0,thenable:function(t){return t}},f={url:"/api/proxy/resource/article/advertise",method:"get",mock:!0,thenable:function(t){return t}};var l=[r,o].reduce(function(t,e){var n=Object.entries(e).reduce(function(t,e){var n=function(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=[],r=!0,o=!1,i=void 0;try{for(var c,a=t[Symbol.iterator]();!(r=(c=a.next()).done)&&(n.push(c.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==a.return||a.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(e,2),r=n[0],o=n[1],i=o.url,a=o.method,u=void 0===a?"get":a,s=o.mock,f=void 0!==s&&s,l=o.thenable,d=void 0===l?function(t){return t}:l;return f&&(i="/mock"+i),t[r]=function(t){return c.a[u||"get"]({url:i,params:t}).then(d)},t},{});return Object.assign(t,n),t},{});e.a={install:function(t){arguments.length>1&&void 0!==arguments[1]&&arguments[1],t.prototype.$api=l}}},,,function(t,e,n){"use strict";n.r(e),function(t){var e=n(0),r=n(10),o=(n(21),n(11));e.default.use(r.a),e.default.use(o.a),"undefined"!=typeof window&&(window.Vue=e.default),void 0!==t&&(t.Vue=e.default)}.call(this,n(15))},function(t,e,n){t.exports=n(2)(0)},function(t,e,n){"use strict";var r=n(7);n.n(r).a},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,n){"use strict";const r=n(19),o=n(20);function i(t,e){return e.encode?e.strict?r(t):encodeURIComponent(t):t}function c(t,e){return e.decode?o(t):t}function a(t){const e=t.indexOf("?");return-1===e?"":t.slice(e+1)}function u(t,e){const n=function(t){let e;switch(t.arrayFormat){case"index":return(t,n,r)=>{e=/\[(\d*)\]$/.exec(t),t=t.replace(/\[\d*\]$/,""),e?(void 0===r[t]&&(r[t]={}),r[t][e[1]]=n):r[t]=n};case"bracket":return(t,n,r)=>{e=/(\[\])$/.exec(t),t=t.replace(/\[\]$/,""),e?void 0!==r[t]?r[t]=[].concat(r[t],n):r[t]=[n]:r[t]=n};default:return(t,e,n)=>{void 0!==n[t]?n[t]=[].concat(n[t],e):n[t]=e}}}(e=Object.assign({decode:!0,arrayFormat:"none"},e)),r=Object.create(null);if("string"!=typeof t)return r;if(!(t=t.trim().replace(/^[?#&]/,"")))return r;for(const o of t.split("&")){let[t,i]=o.replace(/\+/g," ").split("=");i=void 0===i?null:c(i,e),n(c(t,e),i,r)}return Object.keys(r).sort().reduce((t,e)=>{const n=r[e];return Boolean(n)&&"object"==typeof n&&!Array.isArray(n)?t[e]=function t(e){return Array.isArray(e)?e.sort():"object"==typeof e?t(Object.keys(e)).sort((t,e)=>Number(t)-Number(e)).map(t=>e[t]):e}(n):t[e]=n,t},Object.create(null))}e.extract=a,e.parse=u,e.stringify=((t,e)=>{if(!t)return"";const n=function(t){switch(t.arrayFormat){case"index":return(e,n,r)=>null===n?[i(e,t),"[",r,"]"].join(""):[i(e,t),"[",i(r,t),"]=",i(n,t)].join("");case"bracket":return(e,n)=>null===n?[i(e,t),"[]"].join(""):[i(e,t),"[]=",i(n,t)].join("");default:return(e,n)=>null===n?i(e,t):[i(e,t),"=",i(n,t)].join("")}}(e=Object.assign({encode:!0,strict:!0,arrayFormat:"none"},e)),r=Object.keys(t);return!1!==e.sort&&r.sort(e.sort),r.map(r=>{const o=t[r];if(void 0===o)return"";if(null===o)return i(r,e);if(Array.isArray(o)){const t=[];for(const e of o.slice())void 0!==e&&t.push(n(r,e,t.length));return t.join("&")}return i(r,e)+"="+i(o,e)}).filter(t=>t.length>0).join("&")}),e.parseUrl=((t,e)=>{const n=t.indexOf("#");return-1!==n&&(t=t.slice(0,n)),{url:t.split("?")[0]||"",query:u(a(t),e)}})},function(t,e,n){"use strict";t.exports=(t=>encodeURIComponent(t).replace(/[!'()*]/g,t=>`%${t.charCodeAt(0).toString(16).toUpperCase()}`))},function(t,e,n){"use strict";var r=new RegExp("%[a-f0-9]{2}","gi"),o=new RegExp("(%[a-f0-9]{2})+","gi");function i(t,e){try{return decodeURIComponent(t.join(""))}catch(t){}if(1===t.length)return t;e=e||1;var n=t.slice(0,e),r=t.slice(e);return Array.prototype.concat.call([],i(n),i(r))}function c(t){try{return decodeURIComponent(t)}catch(o){for(var e=t.match(r),n=1;n<e.length;n++)e=(t=i(e,n).join("")).match(r);return t}}t.exports=function(t){if("string"!=typeof t)throw new TypeError("Expected `encodedURI` to be of type `string`, got `"+typeof t+"`");try{return t=t.replace(/\+/g," "),decodeURIComponent(t)}catch(e){return function(t){for(var e={"%FE%FF":"��","%FF%FE":"��"},n=o.exec(t);n;){try{e[n[0]]=decodeURIComponent(n[0])}catch(t){var r=c(n[0]);r!==n[0]&&(e[n[0]]=r)}n=o.exec(t)}e["%C2"]="�";for(var i=Object.keys(e),a=0;a<i.length;a++){var u=i[a];t=t.replace(new RegExp(u,"g"),e[u])}return t}(t)}}},function(t,e){}]);