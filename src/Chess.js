import React from 'react';
import logo from './logo.svg';
import './Chess.css';
import Game from './components/Game'
import { chatMessage } from './components/api';


function Chess(props) {
  let gameType = props.gameType;
  let player = props.player;
  let username = props.username;
  let otherPlayer = props.otherPlayer;
  return (
    <Game gameType={gameType}
          player={player}
          username={username}
          otherPlayer={otherPlayer}/>
  );
}

export default Chess;
