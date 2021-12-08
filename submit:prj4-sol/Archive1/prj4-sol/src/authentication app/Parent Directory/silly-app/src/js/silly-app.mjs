export default class SillyApp extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('login', this.login);
    this.attachShadow({mode: 'open'});
    this.tick = this.tick.bind(this);
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = 'silly app';
  }
  
  login(ev) {
    const sessionInfo = ev.detail;
    this.info = sessionInfo;
    const html = `
      ${HTML}
      <do-logout id="logout" sessionId="${sessionInfo.sessionId}"></do-logout>
    `;
    this.shadowRoot.innerHTML = html;
    //console.assert(this.loginApp);
    //this.shadowRoot.getElementById('logout').loginApp = this.loginApp;
    this.shadowRoot.getElementById('sessionInfo').innerHTML =
      JSON.stringify(sessionInfo, null, 2);
    this.timer = setInterval(this.tick, 1000);
  }

  tick() {
    this.shadowRoot.getElementById('time').innerHTML =
      new Date().toTimeString();
  }

  disconnectedCallback() {
    if (this.timer) clearInterval(this.timer);
  }
}

const STYLE = `
  :host {
    display: block;
  }
  :host([hidden]) {
    display: none;
  }
  h2 {
    color: #527bdd;
    text-align: center;
    font-size: 150%;
    font-weight: bold;
    padding-bottom: 0.5em;
    padding: 0;
    margin: 0;
  }
  h3 {
    color: #527bdd;
    text-align: center;
    font-size: 120%;
    font-weight: bold;
    padding: 0;
    margin: 0;
  }

  .silly-app {
    padding-top: 3em;
  }
`;

const HTML = `
  <style>${STYLE}</style>
  <div id="silly-app">
    <h2>Silly App</h2>
    <section>
      <h3>Session Info</h2>
      <pre class="sessionInfo" id="sessionInfo"></pre>
    </section>
    <section>
      <h3>Current Time</h2>
      <div id="time"></div>
    </section>
  </div>
`;

const APP_HTML = `
  <slot id="app" name="app">App not defined</slot>
`;

	    
//customElements.define('silly-app', SillyApp);
