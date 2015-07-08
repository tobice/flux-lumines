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

        // Calculate strength of the blur effect depending on the speed
        let blurDeviation = block.dropped ? block.speed / 150 : 0;

        return (
            <g className="lumines-block" style={{ filter: "url('#blur')" }}>
                <defs>
                    <filter id="blur" x={0} y={0} dangerouslySetInnerHTML={{__html:
                    '<feGaussianBlur in="SourceGraphic" stdDeviation="0,' + blurDeviation + '"/>'}}>
                    </filter>
                </defs>
                {block.squares.map((color, i) =>
                    <Square key={i} color={color}
                        x={block.x + getBlockSquareX(i)}
                        y={discretize(block.y + getBlockSquareY(i))} />
                )}
            </g>
        )
    }
}