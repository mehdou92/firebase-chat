import { LitElement, html } from 'lit-element';
import firebase from 'firebase/app';
import 'firebase/auth';

export class ChatLogin extends LitElement {

    constructor() {
        super();
        this.email = '';
        this.password = '';
    }
    static getStyles() {
        return css`
            :host {
                display: block;
            }
        `;
    }

    static getProperties(){
        return {
            email: String,
            password: String
        };
    }

    firstUpdated(){
        this.auth = firebase.auth();
        this.auth.onAuthStateChanged((user) => {
            console.log(user);
            if(user) {
                localStorage.setItem('logged', true);
                return this.dispatchEvent(new CustomEvent('user-logged', {
                    detail: {
                        user
                    }
                }))
            }
            localStorage.setItem('logged', false);
        });
    }

    handlePost(e){
        e.preventDefault();
        if(!this.email | !this.password) return console.error('Email or password are empty');
        console.log(this.auth);
        this.auth.signInWithEmailAndPassword(this.email, this.password)
            .then(user => {
                console.info('Login successfull !!!');
            }).catch(error => console.error);
    }

    render() {
        return html`
            <h2>Login</h2>
            <form @submit="${this.handlePost}"> 
                <input type="text" @input="${e => this.email = e.target.value}">
                <input type="password" @input="${e => this.password = e.target.value}">
                <button type="submit">Sign in</button>
            </form>
        `;
    }
}
customElements.define('chat-login', ChatLogin);