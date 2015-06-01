import React from 'react'

import PureComponent from './PureComponent.js'
import dimensions from '../misc/dimensions.js'

export default class Grid extends PureComponent {
    render() {
        return (
            <rect x={0} y={0}
                width={dimensions.GRID_WIDTH}
                height={dimensions.GRID_HEIGHT}
                style={{stroke: "#000000", fill: "blue"}}/>
        )
    }
}