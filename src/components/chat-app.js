import { LitElement, html, css } from 'lit-element';
import './layout/navigation/chat-header.js';
import './data/chat-data.js';
import './data/chat-auth.js';
import './data/chat-login.js';

import firebase from 'firebase/app';

class ChatApp extends LitElement {

 constructor() {
   super();
   this.user = {};
   this.users = [];
   this.message = "";
   this.messages = [];
   this.logged = false;
 }

 static get properties() {
   return {
     unresolved: {
       type: Boolean,
       reflect: true
     },
     users: Array,
     user: Object,
     message: String,
     messages: Array,
     logged: Boolean
   };
 }

 static get styles() {
   return css`
     * {
       box-sizing: border-box;
     }
     .own { text-align: right; }
     footer {
       position: fixed;
       bottom: 0;
       width: 100%;
       padding: 0.5rem 1rem;
       background-color: #ffffff;
     }
     footer form {
       display: flex;
       justify-content: space-between;
     }
     footer input {
       width: 100%;
       display: block;
     }
   `;
 }

 firstUpdated() {
   this.unresolved = false;
   this.data = this.shadowRoot.querySelector("#data");
   this.logged = localStorage.getItem('logged') == 'true' ? true : false;
 }

 handleLogin(e) {
   const user = e.detail.user;
   this.user = { ...this.user, email: user.email };
   this.logged = localStorage.getItem('logged') == 'true' ? true : false;
 }

 sendMessage(e) {
   e.preventDefault();
   this.database = firebase.database();

   this.database.ref('messages').push({
     content: this.message,
     user: this.user.email,
     date: new Date().getTime()
   }).then(snapshot => {
     this.message = '';
   });
 }

 render() {
   return html`
     <section>
       <chat-data
         id="data"
         path="messages"
         @child-changed="${this.messageAdded}">
       </chat-data>
       <chat-header></chat-header>
       <main>
         ${ !this.logged ?
           html`
             <chat-auth></chat-auth>
             <chat-login @user-logged="${this.handleLogin}"></chat-login>
            `: html`
             <h2>Hi, ${this.user.email}</h2>
             <ul>
               ${this.messages.map(message => html`
                 <li
                   class="${message.user == this.user.email ? 'own': ''}">
                   <span>${message.content} - ${this.getDate(message.date)}</span>
                 </li>
               `)}
             </ul>
           </main>
           <footer>
             <form @submit="${this.sendMessage}">
               <input
                 type="text"
                 placeholder="Send new message ..."
                 .value="${this.message}"
                 @input="${e => this.message = e.target.value}">
               <button type="submit">Send</button>
             </form>
           </footer>
           `
         }
     </section>
   `;
 }

 messageAdded(e) {
   this.messages = e.detail;
 }

 userAdded(e) {
   this.users = e.detail;
 }

 getDate(timestamp) {
   const date = new Date(timestamp);
   // Hours part from the timestamp
   const hours = date.getHours();
   // Minutes part from the timestamp
   const minutes = "0" + date.getMinutes();
   // Seconds part from the timestamp
   const seconds = "0" + date.getSeconds();

   // Will display time in 10:30:23 format
   return `${hours}:${minutes.substr(-2)}:${seconds.substr(-2)}`;
 }
}
customElements.define('chat-app', ChatApp);