import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Chess from '../Chess';
import openSocket from 'socket.io-client';
// import { homePage } from './Login';
import HomePage from './HomePage';
import Game from './Game';

const socket = openSocket('http://localhost:8000');

function chatMessage(msg, otheruser, sender) {
    // console.log(msg);
    socket.emit('sendMessage', {message:msg, otherUser:otheruser, sender:sender});
}

function friendUser(username, otheruser) {
    console.log("inside friendUser");
    socket.emit('friendUser', {user: username, otherUser: otheruser})
}

function loginUser(username) {
    // console.log(msg);
    socket.emit('Login', username);
    socket.on('loginResults', function(data) {
        if (data.success != true) {
            document.getElementById("error").innerHTML = "Username already taken";
        }
        else {
            ReactDOM.render(<HomePage 
                            username={username}/>, document.getElementById('root'));
        }
    });
}

function joinOnline(username) {
    console.log("In the function");
    console.log(username);
    socket.emit('PlayOnline', username);
    document.getElementById("homeStatus").innerHTML = "Searching for another player";
    socket.on('JoinOnline', function(data) {
        console.log("In joinOnline, ready to play");
        ReactDOM.render(<Chess 
            gameType={"online"}
            player={data.color}
            username={username}
            otherPlayer={data.otherUser}/>,
        document.getElementById('root'));
    });
}

function submitMove(i, color, recipient) {
    console.log('inside submitMove');
    socket.emit('passMove', {i:i, color:color, recipient: recipient});
}

socket.on('submitMessage', function(data) {
    // console.log("We made it back to the client");
    console.log(data);
    let msg = data['message'];
    let sender = data['sender'];
    // let newNode = document.createElement("Div");
    // newNode.className = "chats";
    // newNode.innerHTML = sender + ": " + msg;
    document.getElementById("chatlog").appendChild(document.createTextNode(sender + ": " + msg));
    // document.getElementById("chatlog").appendChild(newNode);
    document.getElementById("chatlog").appendChild(document.createElement("br"));
});

socket.on('recieveMove', function(data) {
    console.log('We are in the recieve move function');
    // Do stuff to make moves actually update for other player
    ReactDOM.render(<Game 
        move={data.i}
        otherPlayerColor={data.color}/>, document.getElementById('root'));
});

export { chatMessage }
export { loginUser }
export { joinOnline }
export { submitMove }
export { friendUser }