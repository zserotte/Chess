import React from 'react'


export default function takenPiece(props) {
    return (
        <div className="takenPiece" onClick={props.onClick}><img src={`${props.pieces}`} 
        className="takenPiece cursor" alt="image" name={'item'} />
        </div>
    )
}