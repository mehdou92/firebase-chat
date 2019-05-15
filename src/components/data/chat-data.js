import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/database';

class ChatData extends LitElement {
    constructor() {
        super();
        this.database = {};
        this.path = '';
        this.data = [];
    }
    static get properties() {
        return {
            database: Object,
            path: String,
            data: Array
        };
    }

    firstUpdated() {
        firebase.initializeApp(document.config);
        this.database = firebase.database();

        this.database.ref().child(this.path).push({
            name: 'Julien Domange'
        });

        this.database.ref().child(this.path).on('value', data => this.nodeHasChanged('value', data));
        this.database.ref().child(this.path).on('child_added', data => this.nodeHasChanged('child_added', data));
        this.database.ref().child(this.path).on('child_changed', data => this.nodeHasChanged('child_changed', data));
        this.database.ref().child(this.path).on('child_moved', data => this.nodeHasChanged('child_moved', data));
        this.database.ref().child(this.path).on('child_removed', data => this.nodeHasChanged('child_removed', data));
    }

    nodeHasChanged(event, data) {
        switch(event) {
            case 'child_added':
                this.data = [...this.data, data.val()];
                this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                break;
            case 'child_removed':
                this.data = this.data.filter(item => item.key != data.key);
                this.dispatchEvent(new CustomEvent('child-changed', { detail: this.data }));
                break;
        }
    }
}
customElements.define('chat-data', ChatData);