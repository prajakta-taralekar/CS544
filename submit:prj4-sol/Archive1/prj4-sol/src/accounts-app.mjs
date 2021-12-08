import {
  HTML, //static HTML for overall app

  //functions which help build dynamic HTML
  makeSearchResult,
  makeAccountDetail,
  makeScrollElement,
  makeElement,
  IDS, //mapping from application state to HTML section id's.
} from "./html-content.mjs";

/** Calling this function creates a custom <accounts-app> web
 *  component based an account-services services, web services
 *  ws and function extendFn.  The last argument is used to
 *  extend this solution for Project 5.  The function should
 *  be set up as the click handler for a extendFn element in
 *  the account-details and should be called with 2 arguments:
 *  the account-id and the HTML id of the extendFn element.
 */
export default function makeAccountsAppElement(services, ws, extendFn) {
  customElements.define(
    "accounts-app",
    makeAccountsClass(services, ws, extendFn)
  );
}

/** By defining the component class within a closure we can allow
 *  the code in the class to access the parameters of this function.
 */
function makeAccountsClass(services, ws, extendFn) {
  return class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      //must always use this.shadowRoot to add to component
      this.shadowRoot.innerHTML = HTML;
      this.select("search");
      this.setNavHandlers();
      this.setCreateHandler();
      this.setSearchHandler();
      (async () => {
        const accounts = await services.searchAccounts({});
	      console.log('the account are =====', accounts)
      })()
    }

    /** Set state of app, where state is one of 'search', 'create' or
     *  'detail'.  Ensure that only the section corresponding to the
     *  selected state is visible by adding the 'invisible' class to
     *  other sections and ensuring that the 'invisible' class is not
     *  present on the selected section.
     */
    select(state) {
      for (const [s, sectionId] of Object.entries(IDS)) {
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
        const { id, holderId, balance } = response.result;
        const element = makeAccountDetail(id, holderId, balance);
        const accountDetail = this.shadowRoot.querySelector(`#${IDS.detail}`);
        accountDetail.append(element);
	const extendFnElem = this.shadowRoot.querySelector(`#extend-${id}`)
	extendFnElem.addEventListener('click', () => {
	  extendFn(id, `extend-${id}`)
	  console.log(`extend account ${id} at elementId extend-${id}`)
	})
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

      form.addEventListener("submit", async (e) => {
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
						console.log('the form  input are =====', formInputs)
	    for (const input of formInputs) {
		    input.addEventListener("blur", () => {
								this.search()
				})
	    }
    }

				displayResults(res, searchResultElem) {
								const scrollElem = makeScrollElement(res.links)
								const anchor = scrollElem.querySelector('a')
								searchResultElem.append(scrollElem);
								const elmes = []
								for (const item of res.result) {
												const {id, holderId} = item.result;
												const elem = makeSearchResult(id, holderId, item.links[0].href) 
												elmes.push(elem)
												const anchor = elem.querySelector('a.details')
												anchor.addEventListener('click', () => this.getAccountDetails(anchor.getAttribute('data-ws-href'), elem))
												searchResultElem.append(elem);
								}
								elmes.push(scrollElem)
								const scrollElem2 = makeScrollElement(res.links)
								const anchor2 = scrollElem.querySelector('a')
								searchResultElem.append(scrollElem2);
								elmes.push(scrollElem2)
								scrollElem.addEventListener('click', () => {
												for (const item of elmes) {
																item.setAttribute('class', 'invisible')
												}
												this.search(anchor.getAttribute('data-ws-href'))
								} )
								scrollElem2.addEventListener('click', () => {
												for (const item of elmes) {
																//item.setAttribute('class', 'invisible')
												}
												this.search(anchor2.getAttribute('data-ws-href'))
								} )
												//searchResultElem.append(scrollElem);

				}
					hideOldData() {
								const searchResultElem = this.shadowRoot.querySelector('#search-results')
									const oldDivs = searchResultElem.querySelectorAll('div')
									for (const div of oldDivs) {
													div.setAttribute('class', 'invisible')
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
    async search(url = undefined) {
      //TODO
				let res;
								const searchResultElem = this.shadowRoot.querySelector('#search-results')
				if(!url) {
					const form = this.shadowRoot.querySelector('#search-form')
						const data = Object.fromEntries(new FormData(form))
						res = await services.searchAccounts(data);
				}else {
							res =  await ws.get(url)
				}
						console.log('the res is ==***',url, res);
								this.hideOldData()
						if (res.result.length <= 0) {
										searchResultElem.append('No Result');
						} else {
										this.displayResults(res, searchResultElem);
						}
    }

    //TODO: add auxiliary methods as necessary
  }; //end of class expression for web component
} //end function makeAccountsClass

/** Always clears current error messages in sectionElement.  Then it
 *  report errors for result within sectionElement.  Returns true iff
 *  errors are reported.
 */
function reportErrors(result, sectionElement) {
  clearErrors(sectionElement);
  if (!result?.errors) return false;
  const errors = result.errors;
  const genErrors = sectionElement.querySelector(".errors");
  const errs = errors instanceof Array ? errors : [errors];
  for (const err of errs) {
    const msg = err.message ?? err.toString();
    const widget = err.options?.widget;
    if (widget) {
      const errElement = sectionElement.querySelector(
        `[data-widget=${widget}]`
      );
      if (errElement) {
        errElement.innerHTML = msg;
        continue;
      }
    }
    genErrors.append(makeElement("li", { class: "error" }, msg));
  }
  return true;
}

/** Clear all errors in sectionElement */
function clearErrors(sectionElement) {
  const genErrors = sectionElement.querySelector(".errors");
  if (genErrors) genErrors.innerHTML = "";
  sectionElement.querySelectorAll(".error").forEach((e) => {
    //clear all error messages in section
    e.innerHTML = "";
  });
}
