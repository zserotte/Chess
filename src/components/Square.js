import React from 'react'

export default function Square(props) {
    // If there is a piece on the square print it
    if (props.piece.piece != null) {
        // Props.piece is the src for the image file
        return (
            <div className={`square ${props.color}`} onClick={props.onClick}><img src={`${props.piece.src}`} 
            className="piece" alt="text" name={'item'} />
                {props.value}
            </div>
        )
    }
    // Printing Empty Square
    else {
        return (
            <div className={`square ${props.color}`} onClick={props.onClick} name={'item'}>
                {props.value}
            </div>
        )
    }
}