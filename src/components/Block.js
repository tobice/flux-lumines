import React from 'react'

import PureComponent from './PureComponent.js'
import Square from './Square.js'
import {SQUARE_SIZE} from '../misc/dimensions.js'
import {blockSquareColumn, blockSquareRow, columnToX, yToRow} from '../misc/squareHelpers.js'

export default class Block extends PureComponent {
    render() {
        const block = this.props.block.toJS();

        // Block that hasn't been dropped yet moves discretely in the vertical direction
        const yModifier = y => block.dropped ? y : yToRow(y) * SQUARE_SIZE;

        return (
            <g className="lumines-block">
                {block.squares.map((color, i) =>
                    <Square key={i} color={color}
                        x={columnToX(block.column) + SQUARE_SIZE * blockSquareColumn(i)}
                        y={yModifier(block.y + SQUARE_SIZE * blockSquareRow(i))} />
                )}
            </g>
        )
    }
}