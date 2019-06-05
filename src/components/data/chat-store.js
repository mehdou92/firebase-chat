import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app'
import 'firebase/firestore'


export class ChatStore extends LitElement {
    constructor(){
        super();
        this.data = [];
        this.collection = "";
    }

    static get properties(){
        return {
            data: { type: Array },
            collection: String
        }
    }

    firstUpdated(){
        firebase.initializeApp(document.config);

        firebase.firestore().collection(this.collection).orderBy('date', 'asc').onSnapshot(ref => {
            ref.docChanges().forEach(change => {
                const { newIndex, oldIndex, doc, type } = change;

                if(type === 'added') {
                    this.data = [ ...this.data, doc.data() ];
                    this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data}));
                } else if (type === 'removed') {
                    this.data.splice(oldIndex, 1);
                    this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data}));
                }
            });
        });
    }

    render() {
        return html``;
    }
}
customElements.define('chat-store', ChatStore);