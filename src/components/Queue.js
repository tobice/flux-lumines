import React from 'react'

import PureComponent from './PureComponent.js'
import Square from './Square.js'
import {SQUARE_SIZE} from '../game/dimensions.js'
import {getBlockSquareX, getBlockSquareY, columnToX, yToRow} from '../game/squareHelpers.js'

export default class Queue extends PureComponent {
    render() {
        const gap = SQUARE_SIZE / 2;
        return (
            <g className="queue">
                {this.props.queue.take(3).map((block, j) =>
                    <g className="lumines-block" key={j}>
                        {block.squares.map((color, i) =>
                            <Square key={i} color={color}
                                x={getBlockSquareX(i)}
                                y={block.y + getBlockSquareY(i)} />
                        )}
                    </g>
                )}
            </g>
        )
    }
}