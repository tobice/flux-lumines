import React from 'react';
import PureComponent from './PureComponent.js';

export default (modifier, SquareComponent) => class Column extends PureComponent {
    render() {
        const squares = modifier(this.props.squares);
        return squares.count() === 0 ? null : (<g>
            {squares.map((square, i) =>
                <SquareComponent key={i}
                    color={square.color} x={square.x} y={square.y}
                    scanned={!!square.scanned} />
            )}
        </g>);
    }
};
