import { LitElement, html } from 'lit-element';
import './layout/navigation/chat-header.js';
import './data/chat-data.js';
import './data/chat-auth.js';
import './data/chat-login.js';

class ChatApp extends LitElement {

    constructor() {
        super();
        this.users = [];
    }

    static get properties() {
        return {
            unresolved: {
                type: Boolean,
                reflect: true
            },
            users: Array
        };
    }

    firstUpdated() {
        this.unresolved = false;
    }

    render() {
        return html`
     <section>
       <chat-data
         path="users"
         @child-changed="${this.userAdded}"></chat-data>
       <chat-header></chat-header>
       <main>
        <chat-auth></chat-auth>
        <chat-login></chat-login>
         <ul>
           ${this.users.map(user => html`<li>${user.name}</li>`)}
         </ul>
       </main>
     </section>
   `;
    }

    userAdded(e) {
        this.users = e.detail;
    }
}
customElements.define('chat-app', ChatApp);