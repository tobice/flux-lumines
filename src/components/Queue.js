import React from 'react'

import PureComponent from './PureComponent.js'
import Square from './Square.js'
import {SQUARE_SIZE} from '../misc/dimensions.js'
import {blockSquareColumn, blockSquareRow, columnToX, yToRow} from '../misc/squareHelpers.js'

export default class Queue extends PureComponent {
    render() {
        const gap = SQUARE_SIZE / 2;
        return (
            <g className="queue">
                {this.props.queue.take(3).map((squares, j) =>
                    <g className="lumines-block" key={j}>
                        {squares.map((color, i) =>
                            <Square key={i} color={color}
                                x={SQUARE_SIZE * blockSquareColumn(i)}
                                y={j * (2 * SQUARE_SIZE + gap) + SQUARE_SIZE * blockSquareRow(i)} />
                        )}
                    </g>
                )}
            </g>
        )
    }
}