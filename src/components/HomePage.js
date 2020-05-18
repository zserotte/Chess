import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Chess from '../Chess';
import { joinOnline } from './api';


export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.username
        }
        this.playOnline = this.playOnline.bind(this);
        this.playLocal = this.playLocal.bind(this);
    }

    playLocal(e){
        console.log("we are inside playLocal");
        e.preventDefault();
        ReactDOM.render(<Chess 
                        gameType={"local"}
                        player={""}
                        username={this.state.username}
                        otherPlayer={""}/>, document.getElementById('root'));
    }

    playOnline(e){
        console.log("we are inside playOnline");
        e.preventDefault();
        joinOnline(this.state.username);
    }

    render() {
        return (
            <div class="text center" id="header">
                <button class="button" type="submit" id="playLocalBtn" onClick={this.playLocal}>Play Local</button>
                <button class="button" type="submit" id="playOnlineButton"onClick={this.playOnline}>Play Online</button>
                <br/>
                <div id="homeStatus"></div>
            </div>
        )
    }
}