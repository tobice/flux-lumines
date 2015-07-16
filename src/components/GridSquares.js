import React from 'react';

import {isMonoblock} from '../game/squareHelpers.js';
import PureComponent from './PureComponent.js';
import Square from './Square.js';
import Monoblock from './Monoblock.js';

export default class GridSquares extends PureComponent {
    render() {
        const squares = this.props.grid.flatten(1).filter(square => square !== null);
        return (
            <g>
                {squares.map((square, i) =>
                    <Square key={i} color={square.color} x={square.x} y={square.y} />
                )}
                {squares.filter(square => isMonoblock(square)).reverse().map((square, i) =>
                    <Monoblock key={i} color={square.color} x={square.x} y={square.y} />
                )}
                {squares.filter(square => square.scanned).map((square, i) =>
                    <Square key={i} color={square.color} x={square.x} y={square.y} scanned />
                )}
            </g>
        );
    }
}