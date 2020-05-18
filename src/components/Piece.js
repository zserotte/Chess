// https://www.techighness.com/post/develop-two-player-chess-game-with-react-js/
import React from 'react'

export default function Piece(props) {
    constructor(player, image) {
        this.player = player;
        this.style = {backgroundImage: image};
    }
}