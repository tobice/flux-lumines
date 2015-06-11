import React from 'react'

import {isMonoblock} from '../misc/squareHelpers.js'
import PureComponent from './PureComponent.js'
import Square from './Square.js'
import Monoblock from './Monoblock.js'

export default class GridSquares extends PureComponent {
    render() {
        const squares = this.props.grid.flatten().filter(square => square != null);
        return (
            <g>
                {squares.map((square, i) =>
                    <Square key={i} color={square.color} x={square.x} y={square.y} />
                )}
                {squares.filter(square => isMonoblock(square)).reverse().map((square, i) =>
                    <Monoblock key={i} color={square.color} x={square.x} y={square.y} />
                )}
            </g>
        )
    }
}