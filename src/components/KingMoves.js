import React from 'react'

export default function KingMoves(props) {
    let validMoves = Array(64).fill(false);
    if (props.index%8 !== 0 && (props.squares[props.index - 1] == null || props.squares[props.index - 1].color !== props.color)) {
        validMoves[props.index - 1] = true;
    }
    if (props.index/8 < 7 && (props.squares[props.index + 8] == null || props.squares[props.index + 8].color !== props.color)) {
        validMoves[props.index + 8] = true;
    }
    if (props.index%8 && props.index/8 < 7 && (props.squares[props.index + 7] == null || props.squares[props.index + 7].color !== props.color)) {
        validMoves[props.index + 8] = true;
    }
    return (validMoves)
}
