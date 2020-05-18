import React, { Component } from 'react'
import TakenPiece from './takenPiece';
import { thisExpression } from '@babel/types';

export default class printTakenPieces extends Component {
    renderPiece(i){
        // console.log("In the renderPiece function");
        return <TakenPiece
        onClick={()=>this.props.onClick(i)}
        pieces={this.props.pieces[i].src}
        />
        
    }

    // https://blog.cloudboost.io/for-loops-in-react-render-no-you-didnt-6c9f4aa73778
    createTable = () => {
        let table = []
    
        if (this.props.pieces != null) {
            for (let i = 0; i < this.props.pieces.length; i++) {
                let takenPiece = table.push(this.renderPiece(i));

                // table.push(<tr>{takenPiece}</tr>)
            }
        }
        else {
            table = [];
        }
        return table
      }
      render() {
        return(
            <div>
                {this.createTable()}
            </div>
        )
      }
}