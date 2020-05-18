import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Chess from '../Chess';
import { loginUser } from './api';


// document.getElementById("header").innerHTML = 
//          '<form id="getUserForm">' + '<br><br>What shall I call you?<br><br>' +
//          '<input type="text" placeholder="username" id="getUserText" />&nbsp&nbsp' +
//          '<button class="button" type="submit" id="getUserBtn">Let\'s Chat!</button></form>';

function homePage(){
    this.state.signIn = true;
}


export default class Login extends Component {
    doSomething(e) {
        e.preventDefault();
        let text = document.getElementById("getUserText").value;
        document.getElementById("getUserText").value = "";
        // alert(text);
        loginUser(text);
    }

    // This is what gets called when you call setState (When a piece is actually moved)
    // This is also the first function that gets called when the server is loaded 
    render() {
        // console.log("Render was called");
        return (
            <div>
                {/* Current User */}
                <div class="userDiv" id="currentUser"></div>
                {/* Header */}
                <div class="text center" id="header">
                    <form id="getUserForm" onSubmit={this.doSomething}><br/><br/>What shall I call you?<br/><br/>
                        <input type="text" placeholder="username" id="getUserText" />
                        <button class="button" type="submit" id="getUserBtn">Login!</button>
                    </form>
                </div>
                <div id="error"></div>
            </div>
        )
    }
}

export { homePage }