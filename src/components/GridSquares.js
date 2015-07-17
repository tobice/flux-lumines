import React from 'react';

import {isMonoblock} from '../game/squareHelpers.js';
import PureComponent from './PureComponent.js';
import Square from './Square.js';
import Monoblock from './Monoblock.js';

import Column from './Column.js';

// Define a column component for each type of squares. This might seem cumbersome but
// it's done for a reason. Each of these components will receive column of squares directly from the
// immutable global state. Therefore shouldComponentUpdate() will be able to
// correctly detect changes (or ignore props when there are no changes at all). Only after that
// we can actually modify the list of squares and print only what we need.

const SquareColumn = Column(squares => squares.filter(square =>
    square !== null && !square.scanned && !isMonoblock(square)), Square);
const MonoblockColumn = Column(squares => squares.filter(square =>
    square !== null && isMonoblock(square)).reverse(), Monoblock);
const ScannedColumn = Column(squares => squares.filter(square =>
    square !== null && square.scanned), Square);

let previousGrid;

export default class GridSquares extends PureComponent {
    render() {
        const {grid} = this.props;

        // As the order matters in SVG (it replaces z-index), we can't render all squares in a
        // single run.
        return (
            <g>
                {grid.map((squares, i) =>
                    <SquareColumn key={i} squares={squares} />
                )}
                {grid.map((squares, i) =>
                    <MonoblockColumn key={i} squares={squares} />
                )}
                {grid.map((squares, i) =>
                    <ScannedColumn key={i} squares={squares} />
                )}
            </g>
        );
    }
}