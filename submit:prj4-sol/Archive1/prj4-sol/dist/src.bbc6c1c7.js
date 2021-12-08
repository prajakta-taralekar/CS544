// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"html-content.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IDS = exports.HTML = void 0;
exports.makeAccountDetail = makeAccountDetail;
exports.makeElement = makeElement;
exports.makeScrollElement = makeScrollElement;
exports.makeSearchResult = makeSearchResult;

/** Return an element which represents an account search-result
 *  for account having id and holderId and WS url selfHref.
 */
function makeSearchResult(id, holderId, selfHref) {
  const element = makeElement('div', {
    class: 'account-result',
    id
  });
  element.innerHTML = `
    <dl>
      <dt>Account ID:</dt><dd>${id}</dd>
      <dt>Holder ID:</dt><dd>${holderId}</dd>
    </dl>
    <div>
      <a class="details" href="#" data-ws-href="${selfHref}" 
         rel="describedby">
        Details
      </a>
    </div>
  `;
  return element;
}
/** Return an element which represents account detail for
 *  account having id, holderId and balance.
 */


function makeAccountDetail(id, holderId, balance) {
  console.assert(typeof balance === 'number', `account balance "${balance}" has type ${typeof balance}`);
  const balanceText = balance.toFixed(2);
  const element = makeElement('div', {
    class: 'account-detail',
    id
  });
  const extendId = `extend-${id}`;
  element.innerHTML = `
    <dl>
      <dt>Account ID:</dt><dd>${id}</dd>  
      <dt>Holder ID:</dt><dd>${holderId}</dd>
      <dt>Balance:</dt><dd>${balanceText}</dd>
    </dl>
    <div id="${extendId}" data-id="${id}" class="extendFn">extendFn</div>
  `;
  return element;
}

function makeScrollElement(links) {
  const scroll = makeElement('div', {
    class: 'scroll'
  }, '');

  for (const [rel, text] of Object.entries({
    prev: '<<',
    next: '>>'
  })) {
    const link = links.find(link => link.rel === rel);

    if (link) {
      const attr = {
        href: '#',
        'data-ws-href': link.href,
        rel
      };
      const control = makeElement('a', attr, text);
      scroll.append(control);
    }
  }

  return scroll;
}
/** Return a new DOM element with specified tagName, attributes
 *  given by object attrs and contained text.
 */


function makeElement(tagName) {
  let attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  const element = document.createElement(tagName);

  for (const [k, v] of Object.entries(attrs)) {
    element.setAttribute(k, v);
  }

  if (text.length > 0) element.append(text);
  return element;
}

const IDS = {
  create: 'create-section',
  search: 'search-section',
  detail: 'detail-section'
};
exports.IDS = IDS;
const STYLE = `
  <style type="text/css">

    nav ul {
      list-style-type: none;
      display: inline;
    }

    .nav-create {
      float: left;
    }

    .nav-search {
      float: right;
    }

    .heading {
      font-weight: bold;
    }

    button {
      border-radius: 10px;
      background-color: var(--light);
      padding: 5px;
      border-color: var(--dark);
      color: var(--darkest);
    }


    button:hover {
      background-color: var(--dark);
      color: white;
    }

    .form-grid2 {
      display: grid;
      grid-template-columns: 0.5fr 1fr;
      grid-gap: 2vw;
    }

    .scroll {
      font-size: 150%;
      padding: 10pt 0pt;
      width: 100;
    }
    
    .scroll a[rel="prev"] {
      float: left;
    }

    .scroll a[rel="next"] {
      float: right;
    }

    .account-result, .account-detail {
      width: 70%;
      margin: 10px;
      padding: 10px;
      background-color: white;
      border: 2px solid blue;
    }

    .account-result dl, .account-detail dl {
      display: grid;
      grid-template-columns: 0.5fr 1fr;
      grid-gap: 1vw;
    }

    input, textarea, select {
      width: 50%;
    }

    label {
      font-weight: bold;
      text-align: right;
    }

    .invisible {
      display: none;
    }

    .error {
      color: red;
    }
  </style>
`;
const HTML = `
  ${STYLE}

  <section id=${IDS.create}>
    <h2 class="heading">Create Account</h2>
    <nav>
      <ul>
        <li class="nav-search"><a href="#">Search Accounts</a></li>
      </ul>
    </nav>
    <ul class="errors"></ul>
    <form id="create-form" class="form-grid2">
      <label for="create-holderId">Holder ID</label>
      <span>
        <input id="create-holderId" name="holderId" id><br>
        <span class="error" data-widget="holderId"></span>
      </span>
      <span>&nbsp;</span>
      <button type="submit">Create Account</button>
    </form>
   </section>

  <section id=${IDS.search}>
    <h2 class="heading">Search Accounts</h2>
    <nav>
      <ul>
        <li class="nav-create"><a href="#">Create Account</a></li>
      </ul>
    </nav>
    <ul class="errors"></ul>
    <form id="search-form" class="form-grid2">
      <label for="search-id">Account ID</label>
      <span>
        <input id="search-id" name="id"><br>
        <span class="error" data-widget="id"></span>
      </span>
      <label for="search-holderId">Holder ID</label>
      <span>
        <input id="search-holderId" name="holderId" id><br>
        <span class="error" data-widget="holderId"></span>
      </span>
    </form>
    <p id="search-results"></p>
  </section>

  <section id=${IDS.detail}>
    <h2 class="heading">Account Detail</h2>
    <nav>
      <ul>
        <li class="nav-create"><a href="#">Create Account</a></li>
        <li class="nav-search"><a href="#">Search Accounts</a></li>
      </ul>
    </nav>
    <ul class="errors"></ul>
    <p id="account-detail"></p>
  </section>
   

`;
exports.HTML = HTML;
},{}],"accounts-app.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAccountsAppElement;

var _htmlContent = require("./html-content.mjs");

/** Calling this function creates a custom <accounts-app> web
 *  component based an account-services services, web services
 *  ws and function extendFn.  The last argument is used to
 *  extend this solution for Project 5.  The function should
 *  be set up as the click handler for a extendFn element in
 *  the account-details and should be called with 2 arguments:
 *  the account-id and the HTML id of the extendFn element.
 */
function makeAccountsAppElement(services, ws, extendFn) {
  customElements.define("accounts-app", makeAccountsClass(services, ws, extendFn));
}
/** By defining the component class within a closure we can allow
 *  the code in the class to access the parameters of this function.
 */


function makeAccountsClass(services, ws, extendFn) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({
        mode: "open"
      }); //must always use this.shadowRoot to add to component

      this.shadowRoot.innerHTML = _htmlContent.HTML;
      this.select("search");
      this.setNavHandlers();
      this.setCreateHandler();
      this.setSearchHandler();

      (async () => {
        const accounts = await services.searchAccounts({});
        console.log('the account are =====', accounts);
      })();
    }
    /** Set state of app, where state is one of 'search', 'create' or
     *  'detail'.  Ensure that only the section corresponding to the
     *  selected state is visible by adding the 'invisible' class to
     *  other sections and ensuring that the 'invisible' class is not
     *  present on the selected section.
     */


    select(state) {
      for (const [s, sectionId] of Object.entries(_htmlContent.IDS)) {
        const sectionElement = this.shadowRoot.querySelector(`#${sectionId}`);

        if (s === state) {
          sectionElement.classList.remove("invisible");
          this.sectionElement = sectionElement;
        } else {
          sectionElement.classList.add("invisible");
        }
      }
    }
    /** Set up click handlers for the create and search navigation links
     *  at the start of each app section which select()'s the clicked
     *  on section.
     */


    setupNavClickHandlers(type) {
      const links = this.shadowRoot.querySelectorAll(`.nav-${type} > a`);

      for (const link of links) {
        link.addEventListener("click", () => this.select(type));
      }
    }

    setNavHandlers() {
      //TODO
      this.setupNavClickHandlers("create"); // Nav linking for create links

      this.setupNavClickHandlers("search"); // Nav linking for search links
    }

    async getAccountDetails(accountUrl, formElem) {
      const response = await ws.get(accountUrl);
      console.log("the response is ======", response);

      if (!reportErrors(response, formElem)) {
        const {
          id,
          holderId,
          balance
        } = response.result;
        const element = (0, _htmlContent.makeAccountDetail)(id, holderId, balance);
        const accountDetail = this.shadowRoot.querySelector(`#${_htmlContent.IDS.detail}`);
        accountDetail.append(element);
        const extendFnElem = this.shadowRoot.querySelector(`#extend-${id}`);
        extendFnElem.addEventListener('click', () => {
          extendFn(id, `extend-${id}`);
          console.log(`extend account ${id} at elementId extend-${id}`);
        });
        this.select("detail");
      }
    }
    /** Set up a handler for submission of the create-form.  Ensure
     *  that the form is not submitted to the server the form-data is
     *  submitted via the newAccount() web services.  If there are no
     *  errors, the detail section is selected with the details of the
     *  newly created account.
     */


    setCreateHandler() {
      const form = this.shadowRoot.querySelector("#create-form");
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.target).entries());
        const resp = await services.newAccount(data);

        if (!reportErrors(resp, form)) {
          await this.getAccountDetails(resp, form);
        }
      });
    }
    /** Create handler for blur event on search-form input widgets.
     */


    setSearchHandler() {
      //TODO
      const formInputs = this.shadowRoot.querySelectorAll("#search-form  input");
      console.log('the form  input are =====', formInputs);

      for (const input of formInputs) {
        input.addEventListener("blur", () => {
          this.search();
        });
      }
    }

    displayResults(res, searchResultElem) {
      const scrollElem = (0, _htmlContent.makeScrollElement)(res.links);
      const anchor = scrollElem.querySelector('a');
      searchResultElem.append(scrollElem);
      const elmes = [];

      for (const item of res.result) {
        const {
          id,
          holderId
        } = item.result;
        const elem = (0, _htmlContent.makeSearchResult)(id, holderId, item.links[0].href);
        elmes.push(elem);
        const anchor = elem.querySelector('a.details');
        anchor.addEventListener('click', () => this.getAccountDetails(anchor.getAttribute('data-ws-href'), elem));
        searchResultElem.append(elem);
      }

      elmes.push(scrollElem);
      const scrollElem2 = (0, _htmlContent.makeScrollElement)(res.links);
      const anchor2 = scrollElem.querySelector('a');
      searchResultElem.append(scrollElem2);
      elmes.push(scrollElem2);
      scrollElem.addEventListener('click', () => {
        for (const item of elmes) {
          item.setAttribute('class', 'invisible');
        }

        this.search(anchor.getAttribute('data-ws-href'));
      });
      scrollElem2.addEventListener('click', () => {
        for (const item of elmes) {//item.setAttribute('class', 'invisible')
        }

        this.search(anchor2.getAttribute('data-ws-href'));
      }); //searchResultElem.append(scrollElem);
    }

    hideOldData() {
      const searchResultElem = this.shadowRoot.querySelector('#search-results');
      const oldDivs = searchResultElem.querySelectorAll('div');

      for (const div of oldDivs) {
        div.setAttribute('class', 'invisible');
      }
    }
    /** Perform an accounts search.  If url is defined (it would be
     *  a scroll link), then simply perform a get() to that url.  If
     *  url is undefined, then searchAccounts() using the form-data
     *  from search-form.  If there are no errors, add the results
     *  to the results after the search form, including scroll controls
     *  before/after the actual results.  Then set up handlers for
     *  the just added scroll controls and the details link within
     *  each account result in the results.
     */


    async search() {
      let url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      //TODO
      let res;
      const searchResultElem = this.shadowRoot.querySelector('#search-results');

      if (!url) {
        const form = this.shadowRoot.querySelector('#search-form');
        const data = Object.fromEntries(new FormData(form));
        res = await services.searchAccounts(data);
      } else {
        res = await ws.get(url);
      }

      console.log('the res is ==***', url, res);
      this.hideOldData();

      if (res.result.length <= 0) {
        searchResultElem.append('No Result');
      } else {
        this.displayResults(res, searchResultElem);
      }
    } //TODO: add auxiliary methods as necessary


  }; //end of class expression for web component
} //end function makeAccountsClass

/** Always clears current error messages in sectionElement.  Then it
 *  report errors for result within sectionElement.  Returns true iff
 *  errors are reported.
 */


function reportErrors(result, sectionElement) {
  clearErrors(sectionElement);
  if (!(result !== null && result !== void 0 && result.errors)) return false;
  const errors = result.errors;
  const genErrors = sectionElement.querySelector(".errors");
  const errs = errors instanceof Array ? errors : [errors];

  for (const err of errs) {
    var _err$message, _err$options;

    const msg = (_err$message = err.message) !== null && _err$message !== void 0 ? _err$message : err.toString();
    const widget = (_err$options = err.options) === null || _err$options === void 0 ? void 0 : _err$options.widget;

    if (widget) {
      const errElement = sectionElement.querySelector(`[data-widget=${widget}]`);

      if (errElement) {
        errElement.innerHTML = msg;
        continue;
      }
    }

    genErrors.append((0, _htmlContent.makeElement)("li", {
      class: "error"
    }, msg));
  }

  return true;
}
/** Clear all errors in sectionElement */


function clearErrors(sectionElement) {
  const genErrors = sectionElement.querySelector(".errors");
  if (genErrors) genErrors.innerHTML = "";
  sectionElement.querySelectorAll(".error").forEach(e => {
    //clear all error messages in section
    e.innerHTML = "";
  });
}
},{"./html-content.mjs":"html-content.mjs"}],"ws.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeWs;

//factory function is default export
function makeWs(url) {
  return new Ws(url);
} //On error, all web services return an object of the form:
// { errors: [ message, options?: { widget? } ] }.


class Ws {
  //most domain-related services simple delegate to get() or _post().

  /** Create web services based on url (protocol, hostname and port, no
   *  path).
   */
  constructor(url) {
    this._urlBase = url;
  }
  /** Use web-services to create a new account based on params { holderId }.
   *  Returns location header
   */


  async newAccount(params) {
    return this._post(BASE, params); //TODO
  }
  /** Use web-services to get account info for id.  Successful return
   *  of the form:
   *
   *    { links: [ selfLink ],
   *      result: { id, holderId, balance: Number, }
   *    }
   */


  async info(_ref) {//TODO: not needed for this project

    let {
      id
    } = _ref;
  }
  /** Use web-services to search accounts for params { id?, holderId? }.
   *  If successful, return object of the form:
   *
   *  { links: [ SelfLink, NextLink?, PrevLink? ],
   *    result: [ { links: [ SelfLink ],
   *                result: { id, holderId },
   *              },
   *            ],
   *  }
   *
   * If there are no results, then the returned object should have its
   * result property set to the empty list [].
   */


  async searchAccounts() {
    let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return await this.get(BASE, params); //TODO
  }

  async newAct(params) {//TODO: not needed for this project
  }

  async query(params) {//TODO: not needed for this project
  }

  async statement(params) {//TODO: not needed for this project
  }
  /** Perform a GET request for path on this.url using query params q.
   *  Return returned response (which may be in error even when the
   *  response is ok)
   */


  async get(path) {
    let q = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const url = new URL(path, this._urlBase);

    for (let [key, value] of Object.entries(q)) {
      url.searchParams.set(key, value);
    }

    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("the error from get call ---", error);
      return {
        errors: [{
          message: error.message
        }]
      };
    }
  }
  /** Do a POST request for path on this.url using data as body.
   *  If successful, return the Location header; otherwise
   *  return a suitable errors response.
   */


  async _post(path) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    //TODO
    let response;

    try {
      response = await fetch(`${this._urlBase}${path}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error("error from post", error);
      return {
        errors: [{
          message: error.message
        }]
      };
    }

    if (response.ok) {
      //status is 2xx
      return response.headers.get('Location');
    } else {
      //return response errors
      return await response.json();
    }
  }

}

const BASE = "/accounts";
},{}],"../node_modules/cs544-js-utils/src/utils.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppErrors = void 0;

class AppErrors {
  constructor() {
    this.errors = [];
  }

  add(...args) {
    console.assert(args.length === 1 || args.length === 2);
    let message, options;

    if (args.length === 2) {
      [message, options] = args;
      this.errors.push({
        message,
        options
      });
    } else if (Array.isArray(args[0])) {
      args[0].forEach(err => this.add(err));
    } else if (args[0].errors) {
      this.add(args[0].errors);
    } else {
      ({
        message,
        options
      } = args[0]);
      if (!message) message = args[0].toString();
      if (!options) options = {};
      this.errors.push({
        message,
        options
      });
    }

    return this;
  }

  isError() {
    return this.errors.length > 0;
  }

  toString() {
    return this.errors.map(e => e.message).join('\n');
  }

}

exports.AppErrors = AppErrors;
},{}],"../node_modules/cs544-js-utils/src/validator.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeValidator;

var _utils = require("./utils.mjs");

function makeValidator(validationSpecs) {
  return new Validator(validationSpecs);
}

class Validator {
  constructor(specs) {
    this._specs = specs;
  }

  validate(cmd, obj = {}) {
    const errors = new _utils.AppErrors();
    const spec = this._specs[cmd];

    if (!spec) {
      return errors.add(`unknown command ${cmd}`, {
        code: 'BAD_REQ'
      });
    } else {
      return validate(cmd, spec, obj, errors);
    }
  }

}

function validate(cmd, spec, obj, errors) {
  const result = { ...obj
  };
  const {
    fields
  } = spec;

  if (!fields) {
    const message = 'missing "fields" property in spec';
    return errors.add(message, {
      code: 'INTERNAL'
    });
  }

  for (const [id, spec] of Object.entries(fields)) {
    let val = obj[id] ?? undefined;
    let valIsErr = false;

    if (val === undefined) {
      if (spec.required) {
        errors.add(valueError(val, spec?.name ?? id, id));
        valIsErr = true;
      } else if (spec?.default) {
        val = typeof spec.default === 'function' ? spec.default(id) : spec.default;
      }
    }

    if (val !== undefined && !valIsErr) {
      const idVal = checkField(val.toString(), spec, id, obj, errors);
      if (!idVal?.errors) result[id] = idVal;
    }
  }

  return errors.isError() ? errors : result;
}

function checkField(fieldVal, fieldSpec, id, topVal, errors) {
  if (fieldSpec?.chk) {
    if (fieldSpec.chk.constructor === RegExp) {
      const m = fieldVal.match(fieldSpec.chk);

      if (!m || m.index !== 0 || m[0].length !== fieldVal.length) {
        return errors.add(valueError(fieldVal, fieldSpec.name ?? id, id));
      }
    } else if (Array.isArray(fieldSpec.chk)) {
      if (fieldSpec.chk.indexOf(fieldVal) < 0) {
        return errors.add(valueError(fieldVal, fieldSpec.name ?? id, id));
      }
    } else if (typeof fieldSpec.chk === 'function') {
      const msg = fieldSpec.chk.call(topVal, fieldVal, fieldSpec, id);

      if (msg) {
        return errors.add(msg, {
          code: 'BAD_VAL',
          widget: id
        });
      }
    } else {
      const msg = `bad field chk for field "${id}"`;
      return errors.add(msg, {
        code: 'INTERNAL',
        widget: id
      });
    }
  } else if (!SAFE_CHARS_REGEX.test(fieldVal)) {
    return errors.add(valueError(fieldVal, fieldSpec?.name ?? id, id));
  }

  const val = fieldSpec?.valFn ? fieldSpec.valFn.call(topVal, fieldVal, fieldSpec, id) : fieldVal;
  return val;
}

function valueError(val, name, id) {
  const message = val !== undefined ? `bad value "${val}" for ${name}` : `missing value for ${name}`;
  const code = val !== undefined ? 'BAD_VAL' : 'BAD_REQ';
  return {
    message,
    options: {
      code,
      widget: id
    }
  };
}

function valStr(val) {
  return (val ?? '').toString().trim();
}

const SAFE_CHARS_REGEX = /^[\w\s\-\.\@\#\%\$\^\*\(\)\{\}\[\]\:\,\/\'\"\!]*$/;
},{"./utils.mjs":"../node_modules/cs544-js-utils/src/utils.mjs"}],"../node_modules/cs544-js-utils/main.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  makeValidator: true
};
Object.defineProperty(exports, "makeValidator", {
  enumerable: true,
  get: function () {
    return _validator.default;
  }
});

var _utils = require("./src/utils.mjs");

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _utils[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _utils[key];
    }
  });
});

var _validator = _interopRequireDefault(require("./src/validator.mjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./src/utils.mjs":"../node_modules/cs544-js-utils/src/utils.mjs","./src/validator.mjs":"../node_modules/cs544-js-utils/src/validator.mjs"}],"util.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genId = void 0;
exports.getCents = getCents;
exports.getDate = getDate;
exports.getPositiveInt = getPositiveInt;

var _cs544JsUtils = require("cs544-js-utils");

//30 days has September, April, June and November
const MONTHS_30 = new Set([9, 4, 6, 11]);

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

;
/** Returns incoming YYYY-MM-DD date yyyymmdd or an errors object */

function getDate(yyyymmdd) {
  var _yyyymmdd$trim$match, _yyyymmdd$trim;

  let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _cs544JsUtils.AppErrors();
  const [_, yyyy, mm, dd] = (_yyyymmdd$trim$match = yyyymmdd === null || yyyymmdd === void 0 ? void 0 : (_yyyymmdd$trim = yyyymmdd.trim()) === null || _yyyymmdd$trim === void 0 ? void 0 : _yyyymmdd$trim.match(/^(\d{4})-(\d\d)-(\d\d)$/)) !== null && _yyyymmdd$trim$match !== void 0 ? _yyyymmdd$trim$match : [];

  if (dd) {
    const [year, month, day] = [Number(yyyy), Number(mm), Number(dd)];
    const isBadDate = day < 1 || month < 1 || month > 12 || day > (MONTHS_30.has(month) ? 30 : 31) || month === 2 && day > (isLeapYear(year) ? 29 : 28);
    if (!isBadDate) return yyyymmdd;
  }

  return errors.add(`bad date "${yyyymmdd}"`, {
    code: 'BAD_REQ'
  });
}
/** If intStr is an integer of one or more digits, then return it as a
 *  Number; otherwise return a suitable errors object.
 */


function getPositiveInt(intStr) {
  var _intStr$trim;

  let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _cs544JsUtils.AppErrors();
  return intStr !== null && intStr !== void 0 && (_intStr$trim = intStr.trim) !== null && _intStr$trim !== void 0 && _intStr$trim.call(intStr).match(/^\d+$/) && Number(intStr) > 0 ? Number(intStr) : errors.add(`bad value "${intStr}": must be a positive integer`, {
    code: 'BAD_REQ'
  });
}
/** If numStr looks like a number with 2 digits after the decimal
 *  point, then return integer cents; otherwise return a suitable errors
 *  object.
 */


function getCents(numStr) {
  let errors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new _cs544JsUtils.AppErrors();
  return numStr !== null && numStr !== void 0 && numStr.trim().match(/^[-+]?\d+\.\d\d$/) ? Number(numStr.replace('.', '')) : errors.add(`bad amount "${numStr}": must be number with 2 decimals`, {
    code: 'BAD_REQ'
  });
}
/** Returns a new id which is unique and hard to guess */


const genId = (() => {
  const RAND_LEN = 2;
  let seq = 0;
  return () => String(seq++ + Number(Math.random().toFixed(RAND_LEN)));
})();

exports.genId = genId;
},{"cs544-js-utils":"../node_modules/cs544-js-utils/main.mjs"}],"defs.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_COUNT = void 0;
//default max number of results to be returned by query()
const DEFAULT_COUNT = 5;
exports.DEFAULT_COUNT = DEFAULT_COUNT;
},{}],"accounts-services.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeAccountsServices;

var _util = require("./util.mjs");

var _defs = require("./defs.mjs");

var _cs544JsUtils = require("cs544-js-utils");

function makeAccountsServices(dao) {
  const checker = (0, _cs544JsUtils.makeValidator)(CMDS);

  const fn = cmd => params => {
    const nonEmpties = Object.entries(params).filter(_ref => {
      let [_, v] = _ref;
      return (v === null || v === void 0 ? void 0 : v.trim().length) > 0;
    });
    const valid = checker.validate(cmd, Object.fromEntries(nonEmpties));
    return valid.errors ? valid : dao[cmd].call(dao, valid);
  };

  const services = Object.fromEntries(Object.keys(CMDS).map(c => [c, fn(c)]));
  return services;
}

function chkDate(yyyymmdd) {
  const chk = (0, _util.getDate)(yyyymmdd);
  return chk.errors ? chk.errors[0].message : '';
}

const CMDS = {
  newAccount: {
    fields: {
      holderId: {
        name: 'account holder ID',
        required: true
      }
    },
    doc: `
      create a new account and return its ID.
    `
  },
  info: {
    fields: {
      id: {
        name: 'account ID',
        required: true
      }
    },
    doc: `
      return { id, holderId, balance } for account identified by id.
    `
  },
  searchAccounts: {
    fields: {
      id: {
        name: 'account ID'
      },
      holderId: {
        name: 'account holder ID'
      },
      index: {
        name: 'start index',
        chk: /\d+/,
        default: '0',
        valFn: valStr => Number(valStr)
      },
      count: {
        name: 'retrieved count',
        chk: /\d+/,
        default: String(_defs.DEFAULT_COUNT),
        valFn: valStr => Number(valStr)
      }
    },
    doc: `
      return list of { id, holderId, balance } of accounts
    `
  },
  newAct: {
    fields: {
      id: {
        name: 'account ID',
        required: true
      },
      amount: {
        name: 'transaction amount',
        chk: /[-+]?\d+\.\d\d/,
        valFn: valStr => Number(valStr.replace(/\./, '')),
        required: true
      },
      date: {
        name: 'transaction date',
        chk: chkDate,
        required: true
      },
      memo: {
        name: 'transaction memo',
        required: true
      }
    },
    doc: `
      add transaction { amount, date, memo } to account id and
      return ID of newly created transaction.
    `
  },
  query: {
    fields: {
      id: {
        name: 'account ID',
        required: true
      },
      actId: {
        name: 'transaction ID'
      },
      date: {
        name: 'transaction date',
        chk: chkDate
      },
      memoText: {
        name: 'memo substring'
      },
      index: {
        name: 'start index',
        chk: /\d+/,
        default: '0',
        valFn: valStr => Number(valStr)
      },
      count: {
        name: 'retrieved count',
        chk: /\d+/,
        default: String(_defs.DEFAULT_COUNT),
        valFn: valStr => Number(valStr)
      }
    },
    doc: `
      return list of { actId, amount, date, memo } of transactions
      for account id.
    `
  },
  statement: {
    fields: {
      id: {
        name: 'account ID',
        required: true
      },
      fromDate: {
        name: 'from date',
        chk: chkDate
      },
      toDate: {
        name: 'to date',
        chk: chkDate
      }
    },
    doc: `
      return list of { actId, amount, date, memo, balance } extended
      transactions for account id between fromDate and toDate.
    `
  }
};
},{"./util.mjs":"util.mjs","./defs.mjs":"defs.mjs","cs544-js-utils":"../node_modules/cs544-js-utils/main.mjs"}],"index.mjs":[function(require,module,exports) {
"use strict";

var _accountsApp = _interopRequireDefault(require("./accounts-app.mjs"));

var _ws = _interopRequireDefault(require("./ws.mjs"));

var _accountsServices = _interopRequireDefault(require("./accounts-services.mjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_WS_URL = 'https://zdu.binghamton.edu:2345'; //"https://c9551fc7-eac5-455a-9314-bfba396b5440.mock.pstmn.io"; //'https://zdu.binghamton.edu:2345';

/** Return url set in query param 'ws-url' if present; otherwise
 *  return DEFAULT_WS_URL.
 */

function getWsUrl() {
  var _locationUrl$searchPa;

  const locationUrl = new URL(window.location.href);
  return (_locationUrl$searchPa = locationUrl.searchParams.get("ws-url")) !== null && _locationUrl$searchPa !== void 0 ? _locationUrl$searchPa : DEFAULT_WS_URL;
}

function main() {
  const ws = (0, _ws.default)(getWsUrl());
  const services = (0, _accountsServices.default)(ws);

  const extendFn = (accountId, elementId) => {
    console.log(`extend account ${accountId} at elementId ${elementId}`);
  };

  (0, _accountsApp.default)(services, ws, extendFn);
}

main();
},{"./accounts-app.mjs":"accounts-app.mjs","./ws.mjs":"ws.mjs","./accounts-services.mjs":"accounts-services.mjs"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "33509" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.mjs"], null)
//# sourceMappingURL=/src.bbc6c1c7.js.map