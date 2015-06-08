import React from 'react'

import PureComponent from './PureComponent.js'
import Square from './Square.js'

export default class DetachedSquares extends PureComponent {
    render() {
        return (
            <g>
                {this.props.detachedSquares.map((square, i) =>
                    <Square key={i} color={square.color} x={square.x} y={square.y}/>
                )}
            </g>
        )
    }
}