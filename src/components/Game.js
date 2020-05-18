import React, { Component } from 'react'
import { createSecureContext } from 'tls';
import Board from './Board';
import PrintTakenPieces from './printTakenPieces';
import BlackRook from '../images/BlackRook.png';
import BlackKnight from '../images/BlackKnight.png';
import BlackBishop from '../images/BlackBishop.png';
import BlackKing from '../images/BlackKing.png';
import BlackQueen from '../images/BlackQueen.png';
import BlackPawn from '../images/BlackPawn.png';
import WhiteRook from '../images/WhiteRook.png';
import WhiteKnight from '../images/WhiteKnight.png';
import WhiteBishop from '../images/WhiteBishop.png';
import WhiteKing from '../images/WhiteKing.png';
import WhiteQueen from '../images/WhiteQueen.png';
import WhitePawn from '../images/WhitePawn.png';
import { Socket } from 'dgram';
import { chatMessage } from './api';
import { submitMove } from './api';
import $ from "jquery"
import { friendUser } from './api';
// import database from '../db';

// Change the boolean for if the castle or king has moved


// Game.js is called by app / index and in render it calls board

class piece {
    constructor(src, piece, color) {
        this.src = src;
        this.piece = piece;
        this.color = color;
    }
}

var nada = new piece(null, null, null);
var bRook = new piece(BlackRook, "Rook", "Black");
var bKnight = new piece(BlackKnight, "Knight", "Black");
var bBishop = new piece(BlackBishop, "Bishop", "Black");
var bQueen = new piece(BlackQueen, "Queen", "Black");
var bKing = new piece(BlackKing, "King", "Black");
var bPawn = new piece(BlackPawn, "Pawn", "Black");
var wRook = new piece(WhiteRook, "Rook", "White");
var wKnight = new piece(WhiteKnight, "Knight", "White");
var wBishop = new piece(WhiteBishop, "Bishop", "White");
var wQueen = new piece(WhiteQueen, "Queen", "White");
var wKing = new piece(WhiteKing, "King", "White");
var wPawn = new piece(WhitePawn, "Pawn", "White");

// console.log(database());


export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            whiteIsNext: true,
            stepNumber: 0,
            history: [
                {squares: [
                    bRook,
                    bKnight,
                    bBishop,
                    bQueen, 
                    bKing,
                    bBishop,
                    bKnight,
                    bRook,
                    bPawn,
                    bPawn,
                    bPawn,
                    bPawn,
                    bPawn,
                    bPawn,
                    bPawn,
                    bPawn,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    nada,
                    wPawn,
                    wPawn,
                    wPawn,
                    wPawn,
                    wPawn,
                    wPawn,
                    wPawn,
                    wPawn,
                    wRook,
                    wKnight,
                    wBishop,
                    wQueen, 
                    wKing,
                    wBishop,
                    wKnight,
                    wRook,
                ],
                blackTaken: [],
                whiteTaken: [],
                blackKing: 4,
                whiteKing: 60,
                status: "It's White's turn. Select a Piece.",
                wrMoves: true,
                wlMoves: true,
                brMoves: true,
                blMoves: true,
                }
            ],
            gameType: this.props.gameType,
            playerColor: this.props.player,
            username: this.props.username,
            otherPlayer: this.props.otherPlayer,
            select : false,
            selectedPiece : "",
            selectedIndex : 0,
            validMoves : [],
            swapPiece: null
        }
        this.sendMessage = this.sendMessage.bind(this);
    }
    jumpTo(step){
        this.setState({
            stepNumber: step,
            whiteIsNext: (step%2)===0
        })
    }

    // 
    retrievePiece(i) {
        console.log("Inside retrieve piece");
        console.log("Swap Piece location is: " + this.state.swapPiece);
        if (this.state.swapPiece === null) {
            return;
        }
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const blackTaken = current.blackTaken.slice();
        const whiteTaken = current.whiteTaken.slice();
        const status = current.status.slice();
        const wrMoves = current.wrMoves.slice();
        const brMoves = current.brMoves.slice();
        const wlMoves = current.wlMoves.slice();
        const blMoves = current.blMoves.slice();
        
        if (this.state.whiteIsNext === true) {
            console.log(blackTaken[i].piece);
            squares[this.state.swapPiece] = blackTaken[i];
            console.log(squares[this.state.swapPiece].piece);
            blackTaken.splice(i, 1);
        }
        else {
            console.log(whiteTaken[i].piece);
            squares[this.state.swapPiece] = whiteTaken[i];
            console.log(squares[this.state.swapPiece].piece);
            whiteTaken.splice(i, 1);
        }
        this.state.swapPiece = null;
        this.setState({
            history: history.concat({
                squares: squares,
                blackTaken: blackTaken,
                whiteTaken: whiteTaken,
                blackKing: current.blackKing,
                whiteKing: current.whiteKing,
                status: status,
                wrMoves: wrMoves,
                brMoves: brMoves,
                wlMoves: wlMoves,
                blMoves: blMoves
            }),
            whiteIsNext: this.state.whiteIsNext,
            stepNumber: history.length
        })
    }

    friend(e) {
        e.preventDefault();
        console.log("inside friend function");
        friendUser(this.state.username, this.state.otherUser);
    }

    logout() {
        window.location.reload(false);
    }
    
    sendMessage(e){
        e.preventDefault();
        let msg = document.getElementById("getChatMessage").value;
        document.getElementById("getChatMessage").value = "";
        // document.getElementById("chatlog").append(msg);
        chatMessage(msg, this.state.otherPlayer, this.state.username);
    }
    
    // This is what gets called when you intitally click on a square. i is associated with the spot on the board that you clicked
    handleClick(i){
        if (typeof this.props.move != 'undefined') {
            console.log(this.props.move);
            this.state.gameType = 'local';
        }
        // console.log(this.state.gameType);
        // console.log(this.props.gameType);
        if (this.state.swapPiece !== null) {
            return;
        }
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const blackTaken = current.blackTaken.slice();
        const whiteTaken = current.whiteTaken.slice();
        let status = current.status.slice();
        let blackKing = current.blackKing;
        let whiteKing = current.whiteKing;
        let wlMoves = current.wlMoves;
        let blMoves = current.blMoves;
        let wrMoves = current.wrMoves;
        let brMoves = current.brMoves;

        // Get all the divs
        let divs = document.getElementsByName("item");
        
        let turn;
        let king;
        if (this.state.whiteIsNext) {
            turn = "White";
            king = whiteKing;
        } else {
            turn = "Black"
            king = blackKing;
        }


        // Get the color of the piece he is trying to select
        if (squares[i].color === turn && (this.state.gameType == "local" || this.state.playerColor == turn)) {
            if (this.state.gameType != "local") {
                submitMove(i, this.state.playerColor, this.state.otherPlayer);
            }
            let pieceType = squares[i].piece;
            if (pieceType === "King") {
                // console.log("Selected piece is a king");
                this.state.validMoves = kingCanMove(squares, i);
                // If the king is not currently in check, see if they can castle
                if (!isCheck(squares, king, turn)) {
                    if (turn == "White") {
                        if ((wrMoves === true) && (squares[61].piece === null) && (squares[62].piece === null)) {
                            this.state.validMoves.push(62);
                        }
                        if ((wlMoves === true) && (squares[57].piece === null) && (squares[58].piece === null) && (squares[59].piece === null)) {
                            this.state.validMoves.push(58);
                        }
                    } else {
                        if ((brMoves === true) && (squares[5].piece === null) && (squares[6].piece === null)) {
                            this.state.validMoves.push(6);
                        }
                        if ((blMoves === true) && (squares[1].piece === null) && (squares[2].piece === null) && (squares[3].piece === null)) {
                            this.state.validMoves.push(2);
                        }
                    }
                }
            }
            else {
                let validMoves = getValidMoves(squares, i);
                this.state.validMoves = [];
                for (let j = 0; j < validMoves.length; j++) {
                    // Temporarily "Moving" piece to see if move puts player in check
                    let tempPiece = squares[validMoves[j]];
                    squares[validMoves[j]] = squares[i];
                    squares[i] = nada;

                    // Calling isCheck on Temporary positions
                    let invalid = isCheck(squares, king, turn);
                    if(!invalid) {
                        this.state.validMoves.push(validMoves[j]);
                    } 

                    // Moving Pieces back
                    squares[i] = squares[validMoves[j]];
                    squares[validMoves[j]] = tempPiece;
                }
            }

            // The selected piece has at least one valid move that won't put thier king in check
            if (this.state.validMoves != null) {
                this.state.select = true;
                this.state.selectedPiece = squares[i];
                this.state.selectedIndex = i;
                let toHighlight = document.getElementsByName("item");

                // Remove the divs id attribute. This is for CSS purposes
                for (let j = 0; j < divs.length; j++) {
                    divs[j].removeAttribute("id");
                }

                // Add div ID's to valid move squares
                for (let j = 0; j < this.state.validMoves.length; j++) {
                    toHighlight[this.state.validMoves[j]].setAttribute("id", "highlight");
                }

                // Circle Selected Piece
                divs[i].setAttribute("id", "selected");
            }
        } 

        // You jump into this if statement while attempting to place a piece
        else if (this.state.select == true && this.state.validMoves.includes(i) && (this.state.gameType == "local" || this.state.playerColor == turn)) {
            if (this.state.gameType != "local") {
                submitMove(i, this.state.playerColor, this.state.otherPlayer);
            }
            // Updating taken Pieces
            if (squares[i].piece !== null) {
                if (turn == "White") {
                    blackTaken.push(squares[i]);
                    // console.log("Taken Black Pieces: " + blackTaken);
                }
                else {
                    whiteTaken.push(squares[i]);
                    // console.log("Taken White Pieces: " + whiteTaken);
                }
            }
            
            // Move piece to new location
            // If white is trying to castle to the right
            if ((turn === "White") && (i === 62) && (this.state.selectedPiece.piece === "King") && (wrMoves === true)) {
                // Update piece locations
                squares[i] = this.state.selectedPiece;
                squares[this.state.selectedIndex] = nada;
                squares[63] = nada;
                squares[61] = wRook;
                // Update state
                wrMoves = false;
                wlMoves = false;
            // If black is trying to castle to the right
            } else if ((turn === "Black") && (i === 6) && (this.state.selectedPiece.piece === "King") && (brMoves === true)) {
                squares[i] = this.state.selectedPiece;
                squares[this.state.selectedIndex] = nada;
                squares[7] = nada;
                squares[5] = bRook;
                brMoves = false;
                blMoves = false;
            // If white is trying to castle to the left
            } else if ((turn === "White") && (i === 58) && (this.state.selectedPiece.piece === "King") && (wlMoves === true)) {
                squares[i] = this.state.selectedPiece;
                squares[this.state.selectedIndex] = nada;
                squares[56] = nada;
                squares[59] = wRook;
                wlMoves = false;
                wrMoves = false;
            // If Black is trying to castle to the left
            } else if ((turn === "Black") && (i === 2) && (this.state.selectedPiece.piece === "King") && (blMoves === true)) {
                squares[i] = this.state.selectedPiece;
                squares[this.state.selectedIndex] = nada;
                squares[0] = nada;
                squares[3] = bRook;
                blMoves = false;
                brMoves = false;
            // If there is no castle occurring
            } else {
            squares[i] = this.state.selectedPiece;
            squares[this.state.selectedIndex] = nada;
            }

            // If you move the specified castle or the king take away their ability to castle
            if ((this.state.selectedIndex === 7) || (this.state.selectedIndex === 4)) {
                brMoves = false;
            } else if ((this.state.selectedIndex === 0) || (this.state.selectedIndex === 4)) {
                blMoves = false;
            } else if ((this.state.selectedIndex === 63) || (this.state.selectedIndex === 60)) {
                wrMoves = false;
            } else if ((this.state.selectedIndex === 60) || (this.state.selectedIndex === 56)) {
                wlMoves = false;
            }

            // If the pawn gets to the opposite side of the board make it a queen
            if ((squares[i].piece == "Pawn") && (i > -1) && (i < 8)) {
                squares[i] = wQueen;

            } else if ((squares[i].piece == "Pawn") && (i > 55) && (i < 64)) {
                squares[i] = bQueen;
            }

            // Update King location if moved Piece is a King
            if (this.state.selectedPiece.piece === "King") {
                if (turn === "White") {
                    current.whiteKing = i;
                }
                else {
                    current.blackKing = i;
                }
                // console.log("King is now at " + i);
            }
            
            // Deselecting Piece
            this.state.select = false;
            this.state.selectedPiece = "";

            let checking;
            if (turn === "White") {
                checking = "Black";
            } else {
                checking = "White";
            }

            let kingIndex = findKing(squares, checking);
            let result = inCheckMate(squares, kingIndex, checking);
            // Update status
            if (result == 0) {
                status = turn + " won the game!"
            } else if (result == 1) {
                status = "It is " + checking + " turn and they are in check";
            } else if (checking === "Black") {
                status = "It's Black's Turn. Select a Piece.";
            } else {
                status = "It's White's Turn. Select a Piece.";
            }

            // console.log(castle);
            // Updating State 
            this.setState({
                history: history.concat({
                    squares: squares,
                    blackTaken: blackTaken,
                    whiteTaken: whiteTaken,
                    blackKing: current.blackKing,
                    whiteKing: current.whiteKing,
                    status: status,
                    wrMoves: wrMoves,
                    brMoves: brMoves,
                    wlMoves: wlMoves,
                    blMoves: blMoves
                }),
                whiteIsNext: !this.state.whiteIsNext,
                stepNumber: history.length
            })
        }
        if (typeof this.props.move != 'undefined') {
            // console.log(this.props.move);
            this.state.gameType = 'online';
        }
    }

    // This is what gets called when you call setState (When a piece is actually moved)
    // This is also the first function that gets called when the server is loaded 
    render() {
        if (typeof this.props.move != 'undefined') {
            console.log(this.props.move);
            // this.state.gameType = 'local';
            this.handleClick(this.props.move);
            // this.state.gameType = 'online';
            // delete this.props.move;
        }
        // console.log("Render was called");
        let divs = document.getElementsByName("item");
        // console.log(selection);
        for (let j = 0; j < divs.length; j++) {
            divs[j].removeAttribute("id");
        }
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const moves = history.map((step, move)=>{
            const desc = move? 'Go to #' + move:'Start the Game';
            return (
                <li keys={move}>
                    <button className="cursor" onClick={()=>{this.jumpTo(move)}}>
                        {desc}
                    </button>
                </li>
            )
        });
        // const currentMove = move? "Current Move" + move:"New Game";
        // const currentMove = move? "Current Move" + move:"New Game";
        const currentMove = "Viewing Current Game";
        if(this.state.stepNumber !== (history.length - 1)) {
            const currentMove = "Viewing Move # " + this.state.stepNumber;
        }

        let showText = true;

        if(this.state.gameType == "local") {
            console.log("in here");
            // $("#friendDiv").hide();
            showText = false;
        }

        const status = current.status.slice();
        // let blackTaken = this.state.blackTaken;
        // let whiteTaken = this.state.whiteTaken;
        // for (let j = 0; j < blackTaken.length; j++) {
        //     console.log(blackTaken[j].piece);
        // }

        // console.log(current.squares);
        // pass the indexes array into into the board element
        // console.log("Returning the board object with the information");
        return (
            <div>
                <div id = "friendDiv">
                    {/* <button onClick={(i)=>this.logout(i)}>friend</button> */}
                    {showText && <button onClick={(i)=>this.friend(i)}>friend</button>}
                </div>
                <div className="game">
                    <div id="chat">
                        <div id="chatlog">

                        </div>
                        <div id="chatForm">
                            <form id="getChatForm" onSubmit={this.sendMessage}><br/><br/>Message<br/><br/>
                                <input type="text" placeholder="Message" id="getChatMessage" />
                                <button class="button" type="submit" id="getChatBtn">Send</button>
                            </form>
                        </div>
                    </div>
                    <div className="game-board">
                        <div>{status}</div>
                        <button id="logout" onClick={(i)=>this.logout(i)}>logout</button>
                        <br />
                        <Board onClick={(i)=>this.handleClick(i)} 
                        squares={current.squares} validMoves={this.state.validMoves}/>
                    </div>
                    <div className="game-info">
                        <div>{currentMove}</div>
                        {/* Prints List of Moves */}
                        <ul class="MovesList">{moves}</ul>
                        {/* Prints a list of the taken pieces */}
                    </div>
                    <div className="game-info">
                        <p>Fallen Pieces</p><br />
                        <p>Black: </p>
                        <div className = "fallenPieces">
                            <PrintTakenPieces onClick={(i)=>this.retrievePiece(i)}
                            pieces={current.blackTaken} />
                        </div>
                        <p>White: </p>
                        <div className = "fallenPieces">
                            <PrintTakenPieces onClick={(i)=>this.retrievePiece(i)}
                            pieces={current.whiteTaken} />
                        </div>
                    </div>
                    {/* <div className="chat">
                        <input type="text" id="message_input"/>
                        <button>send</button>
                    </div> */}
                </div>
            </div>
        )
    }
}

// Calculate if a player is in CheckMate
function inCheckMate(squares, kingIndex, checking) {
    let array = kingCanMove(squares, kingIndex);
    let result = 2;
    // Check to see if he is in check at the index he is currently at
    if (!isCheck(squares, kingIndex, checking)) {
        console.log(checking + " King is not in check");
        return result;
    // Check to see if he can move to an index to get out of check
    } else if ((Array.isArray(array)) && (array.length)) {
        // console.log(array);
        result = 1;
        // console.log(checking + " King can move");
        return result;
    } else if (friendCanHelp(squares, kingIndex, checking)) {
        result = 1;
        console.log(checking + " Friend can help");
        return result;
    // Check to see if one the other pieces can get him out of checkmate
    } else {
        result = 0;
        console.log(checking + " is in checkmate");
        return result;
    }
}

// kingCanMove(squares, kingIndex).length > 0

// Check to see if a friend piece can get you out of checkmate. Takes squares, index of king, color of king as params
function friendCanHelp(squares, kingIndex, color) {
// console.log("In friend can help")

let validMoves = [];
for (let j = 0; j < 64; j++) {
    // If the color of the piece you are looking at is the same as the color of the king that is in check and the piece is not the king
    if ((squares[j].color === color) && (squares[j].piece !== "King")) {
        // Possible error here getting the valid moves of a nada piece
        // console.log("The piece we are looking at is " + j)
        validMoves = getValidMoves(squares, j);
        // console.log("Its valid moves are " + validMoves);
        for (let k = 0; k < validMoves.length; k++) {
            let tempTakenPiece = squares[validMoves[k]];
            // console.log("Index " + validMoves[k] + " is now whatevers at " + j);
            squares[validMoves[k]] = squares[j];
            // console.log("Index " + j + " is now nada");
            squares[j] = nada;
            // console.log("Calling is check with index " + kingIndex + " and color " + color);
            if (!isCheck(squares, kingIndex, color)) {
                // console.log("In is check of FCH");
                squares[j] = squares[validMoves[k]];
                squares[validMoves[k]] = tempTakenPiece;
                return true;
            }
            squares[j] = squares[validMoves[k]];
            squares[validMoves[k]] = tempTakenPiece;
        }
    }
}
return false;
}

// Checking if King is unable to move without being in check
function kingCanMove(squares, index) {
    let kingMoves = getValidMoves(squares, index);
    let validMoves = [];
    if (KingMoves === null) {
        return [];
    }
    for (let j = 0; j < kingMoves.length; j++) {
        // Temporary variables
        let tempTaken = squares[kingMoves[j]];
        squares[kingMoves[j]] = squares[index];
        squares[index] = nada;
        
        // If not in check after move, King can move
        if (!isCheck(squares, kingMoves[j], squares[index].color)) {
            validMoves.push(kingMoves[j]);
        } 

        // Returning Pieces to the correct locationsS
        squares[index] = squares[kingMoves[j]];
        squares[kingMoves[j]] = tempTaken;
    }
    return(validMoves);
}

// Does a looks at valid moves of all pieces to see if a king at index would be in check
function isCheck(squares, index, color){
    // Index is the index of the king. Color is the color of the king
    let check = false;
    let validMoves = [];
    for (let j=0; j < 64; j++) {
        validMoves = getValidMoves(squares, j);
        if (validMoves != null) {
            if (validMoves.includes(index) && squares[j].color !== color) {
                // I think we have to call the is check function in here?
                check = true;
                // console.log("king is in check");
            }
        }
    }
    if (check === false) {
        // console.log("King is not in check");
    }
    return (check);
}

// Find King of Specific Color
function findKing(squares, color) {
    for (let j=0; j < 64; j++) {
        if (squares[j].piece === "King" && squares[j].color === color) {
            return (j);
        }
    }
}

// Gets the valid moves for a selected piece
function getValidMoves(squares, index) {
    let validMoves = [];
    let color = squares[index].color;
    let pieceType = squares[index].piece;
    if (pieceType === "Rook") {
        validMoves = rookMoves(squares, index, color);
    }
    else if (pieceType === "Knight") {
        validMoves = knightMoves(squares, index, color);
    }
    else if (pieceType === "Bishop") {
        validMoves = bishopMoves(squares, index, color);
    }
    else if (pieceType === "Queen") {
        validMoves = queenMoves(squares, index, color);
    }
    else if (pieceType === "King") {
        validMoves = KingMoves(squares, index, color);
    }
    else if (pieceType === "Pawn") {
        validMoves = pawnMoves(squares, index, color);
    }
    return(validMoves);
}

// Check to see what valid moves the king can make
function KingMoves(squares, index, color) {
    let validMoves = [];
    let column = index%8;
    let row = Math.floor(index/8);
    //Checking Move Left
    if (column > 0 && (squares[index - 1].piece === null || squares[index - 1].color !== color)) {
        validMoves.push(index - 1);
    }
    //Checking Move Down
    if (row < 7 && (squares[index + 8] == null || squares[index + 8].color !== color)) {
        validMoves.push(index + 8);
    }
    //Checking Move Down and Left
    if (column > 0 && row < 7 && (squares[index + 7] == null || squares[index + 7].color !== color)) {
        validMoves.push(index + 7);
    }
    //Checking Move Up
    if (row > 0 && (squares[index - 8] == null || squares[index - 8].color !== color)) {
        validMoves.push(index - 8);
    }
    //Checking Move Up and Left
    if (row > 0 && column > 0 && (squares[index - 9].piece === null || squares[index - 9].color !== color)) {
        validMoves.push(index - 9);
    }
    //Checking Move Right
    if (column < 7 && (squares[index + 1] == null || squares[index + 1].color !== color)) {
        validMoves.push(index + 1);
    }
    //Checking Move Up and Right
    if (column < 7 && row > 0 && (squares[index - 7] == null || squares[index - 7].color !== color)) {
        validMoves.push(index - 7);
    }
    //Checking Move Down and Right
    if (row < 7 && column < 7 && (squares[index + 9] == null || squares[index + 9].color !== color)) {
        validMoves.push(index + 9);
    }
    return (validMoves)
}

// Check to see what valid moves that pawn can make
function pawnMoves(squares, index, color) {
    // console.log(index);
    let col = index % 8;
    let row = Math.floor(index / 8);
    let validmoves = [];
    let sign = -1;
    let otherColor = "Black";
    if (color == "Black") {
        sign = 1;
        otherColor = "White";
    }
    // You are at the pawns starting position
    if (row === (3.5 - 2.5*sign)){
        if ( (squares[index+(8*sign)].color === null) && (squares[index+(16*sign)].color === null)) {
            validmoves.push(index+(16*sign));
        }
    }

    // if not in end row
    if (row !== (3.5 + 3.5*sign)) {
        // If not on an edge and piece diagonal
        if (col !== (3.5 + 3.5*sign)) {
            // console.log(squares[index+(9*sign)].piece);
            if (squares[index+(9*sign)].color === otherColor) {
                validmoves.push(index+(9*sign));
            }
        }

        // If not on a different edge and piece diagonal
        if (col !== (3.5 - 3.5*sign)) {
            // console.log(squares[index+(7*sign)].piece);
            if (squares[index+(7*sign)].color === otherColor) {
                validmoves.push(index+(7*sign));
            }
        }

        // If a piece isn't in front of you
        if (squares[index+(8*sign)].color == null) {
            validmoves.push(index+(8*sign));
        }
    }
    // console.log(validmoves);
    return (
        validmoves
    )
}

function knightMoves(squares, index, color) { 
    let validmoves = [];
    let col = index % 8;
    let row = Math.floor(index / 8);
    // console.log("The row value is " + row);
    // console.log("The col value is " + col);

    // You can move to the left 2 spots and up 1
    if ((col > 1) && (row > 0)) {
        validmoves.push(index - 10);
    }
    // Right 2 up 1
    if ((col < 6) && (row > 0)) {
        validmoves.push(index - 6);
    }
    // Left 2 down 1
    if ((col > 1) && (row < 7)) {
        validmoves.push(index + 6);
    }
    // Right 2 down 1
    if ((col < 6) && (row < 7)) {
        validmoves.push(index + 10);
    }
    // Up 2 left 1
    if ((col > 0) && (row > 1)) {
        validmoves.push(index - 17);
    }
    // Up 2 right 1
    if ((col < 7) && (row > 1)) {
        validmoves.push(index - 15);
    }
    // Down 2 Left 1
    if ((col > 0) && (row < 6)) {
        validmoves.push(index + 15);
    }
    // Down 2 right 1
    if ((col < 7) && (row < 6)) {
        validmoves.push(index + 17);
    }
    
    // Remove all the valid indices that have a piece with the same color as ours
    for (let j = validmoves.length - 1; j > -1; j--) {
        if (squares[validmoves[j]].color == color) {
            validmoves.splice(j,1);
        }
    }
    return validmoves;
}
// Check to see what valid moves that rook can make
function rookMoves(squares, index, color) {
    // console.log("inside rookMoves function");
    let validMoves = [];
    validMoves = checkStraightLines(squares, index, color, validMoves);
    return(validMoves);
}

// Check to see what valid moves that bishop can make
function bishopMoves(squares, index, color) {
    let validMoves = [];
    validMoves = checkDiagonals(squares, index, color, validMoves);
    return (validMoves);
}

// Check to see what valid moves that Queen can make
function queenMoves(squares, index, color) {
    let validMoves = [];
    validMoves = checkStraightLines(squares, index, color, validMoves);
    validMoves = checkDiagonals(squares, index, color, validMoves);
    return (validMoves);
}

//Check Straight Lines helper function
function checkStraightLines(squares, index, color, validMoves) {
    let column = index%8;
    let row = Math.floor(index/8);

    //Check move upward
    let isValid = true;
    let tempIndex = index;
    let tempRow = row;
    // console.log(tempRow);
    while(isValid && tempRow > 0) {
        if (squares[tempIndex - 8].color === null) {
            validMoves.push(tempIndex-8);
            tempRow--;
            tempIndex = tempIndex - 8;
        }
        else if (squares[tempIndex - 8].color !== color) {
            validMoves.push(tempIndex - 8);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }
    
    //Check move left
    isValid = true;
    tempIndex = index;
    let tempColumn = column;
    while(isValid && tempColumn > 0) {
        if (squares[tempIndex - 1].color === null) {
            validMoves.push(tempIndex-1);
            tempColumn--;
            tempIndex--;
        }
        else if (squares[tempIndex - 1].color !== color) {
            validMoves.push(tempIndex - 1);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }

    //Check move right
    isValid = true;
    tempIndex = index;
    tempColumn = column;
    while(isValid && tempColumn < 7) {
        if (squares[tempIndex + 1].color === null) {
            validMoves.push(tempIndex + 1);
            tempColumn++;
            tempIndex++;
        }
        else if (squares[tempIndex + 1].color !== color) {
            validMoves.push(tempIndex + 1);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }

    //Check move down
    isValid = true;
    tempIndex = index;
    tempRow = row;
    while(isValid && tempRow < 7) {
        if (squares[tempIndex + 8].color === null) {
            validMoves.push(tempIndex + 8);
            tempRow++;
            tempIndex = tempIndex + 8;
        }
        else if (squares[tempIndex + 8].color !== color) {
            validMoves.push(tempIndex + 8);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }
    return(validMoves);
}

//Check Diagonals helper function
function checkDiagonals(squares, index, color, validMoves) {
    let column = index%8;
    let row = Math.floor(index/8);

    //Check move Up and Right
    let isValid = true;
    let tempIndex = index;
    let tempRow = row;
    let tempColumn = column;
    while(isValid && tempRow > 0 && tempColumn < 7) {
        if (squares[tempIndex - 7].color === null) {
            validMoves.push(tempIndex - 7);
            tempRow--;
            tempColumn++;
            tempIndex = tempIndex - 7;
        }
        else if (squares[tempIndex - 7].color !== color) {
            validMoves.push(tempIndex - 7);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }
    
    //Check move Up and Left
    isValid = true;
    tempIndex = index;
    tempRow = row;
    tempColumn = column;
    while(isValid && tempColumn > 0 && tempRow > 0) {
        if (squares[tempIndex - 9].color === null) {
            validMoves.push(tempIndex - 9);
            tempColumn--;
            tempRow--;
            tempIndex = tempIndex - 9;
        }
        else if (squares[tempIndex - 9].color !== color) {
            validMoves.push(tempIndex - 9);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }

    //Check move Down and Left
    isValid = true;
    tempIndex = index;
    tempRow = row;
    tempColumn = column;
    while(isValid && tempRow < 7 && tempColumn > 0) {
        if (squares[tempIndex + 7].color === null) {
            validMoves.push(tempIndex + 7);
            tempRow++;
            tempColumn--;
            tempIndex = tempIndex + 7;
        }
        else if (squares[tempIndex + 7].color !== color) {
            validMoves.push(tempIndex + 7);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }

    //Check move Down and Right
    isValid = true;
    tempIndex = index;
    tempRow = row;
    tempColumn = column;
    while(isValid && tempColumn < 7 && tempRow < 7) {
        if (squares[tempIndex + 9].color === null) {
            validMoves.push(tempIndex + 9);
            tempColumn++;
            tempRow++;
            tempIndex = tempIndex + 9;
        }
        else if (squares[tempIndex + 9].color !== color) {
            validMoves.push(tempIndex + 9);
            isValid = false;
        }
        else {
            isValid = false;
        }
    }
    return(validMoves);
}