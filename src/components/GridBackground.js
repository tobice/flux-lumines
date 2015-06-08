import React from 'react'

import PureComponent from './PureComponent.js'
import {GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE, GRID_ROWS, GRID_COLUMNS} from '../misc/dimensions.js'
import {range} from '../misc/jshelpers.js'

export default class GridBackground extends PureComponent {
    render() {
        return (
            <g className="lumines-grid">
                {range(GRID_COLUMNS + 1).map(i =>
                    <line
                        key={i}
                        x1={i * SQUARE_SIZE}
                        y1={2 * SQUARE_SIZE}
                        x2={i * SQUARE_SIZE}
                        y2={GRID_HEIGHT}/>
                )}
                {range(GRID_ROWS - 1).map(i =>
                    <line
                        key={i}
                        x1={0}
                        y1={(i+2) * SQUARE_SIZE}
                        x2={GRID_WIDTH}
                        y2={(i+2) * SQUARE_SIZE}/>
                )}
            </g>
        )
    }
}