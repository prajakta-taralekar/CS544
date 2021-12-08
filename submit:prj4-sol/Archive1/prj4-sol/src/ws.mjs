//factory function is default export
export default function makeWs(url) {
  return new Ws(url);
}

//On error, all web services return an object of the form:
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
    return this._post(BASE, params);
    //TODO
  }

  /** Use web-services to get account info for id.  Successful return
   *  of the form:
   *
   *    { links: [ selfLink ],
   *      result: { id, holderId, balance: Number, }
   *    }
   */
  async info({ id }) {
    //TODO: not needed for this project
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
  async searchAccounts(params = {}) {
    return await this.get(BASE, params)
    //TODO
  }

  async newAct(params) {
    //TODO: not needed for this project
  }

  async query(params) {
    //TODO: not needed for this project
  }

  async statement(params) {
    //TODO: not needed for this project
  }

  /** Perform a GET request for path on this.url using query params q.
   *  Return returned response (which may be in error even when the
   *  response is ok)
   */
  async get(path, q = {}) {
    const url = new URL(path, this._urlBase);
    for (let [key, value] of Object.entries(q)) {
      url.searchParams.set(key, value);
    }
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error("the error from get call ---", error);
      return { errors: [{ message: error.message }] };
    }
  }

  /** Do a POST request for path on this.url using data as body.
   *  If successful, return the Location header; otherwise
   *  return a suitable errors response.
   */
  async _post(path, data = {}) {
    //TODO
    let response;
    try {
      response = await fetch(`${this._urlBase}${path}`, {
        method: "POST",
	headers: {
		'Content-Type': 'application/json'
	},
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("error from post", error);
      return { errors: [{ message: error.message }] };
    }
    if (response.ok) { //status is 2xx
      return response.headers.get('Location');
    }
    else { //return response errors
      return await response.json();
    }
  }
}

const BASE = "/accounts";
