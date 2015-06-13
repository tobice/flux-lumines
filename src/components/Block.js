import React from 'react'

import PureComponent from './PureComponent.js'
import Square from './Square.js'
import {SQUARE_SIZE} from '../game/dimensions.js'
import {getBlockSquareX, getBlockSquareY, columnToX, yToRow} from '../game/squareHelpers.js'

export default class Block extends PureComponent {
    render() {
        const block = this.props.block.toJS();

        // Block that hasn't been dropped yet moves discretely in the vertical direction
        const discretize = y => block.dropped ? y : yToRow(y) * SQUARE_SIZE;

        return (
            <g className="lumines-block">
                {block.squares.map((color, i) =>
                    <Square key={i} color={color}
                        x={block.x + getBlockSquareX(i)}
                        y={discretize(block.y + getBlockSquareY(i))} />
                )}
            </g>
        )
    }
}