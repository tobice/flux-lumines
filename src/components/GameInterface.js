import React from 'react'

import PureComponent from './PureComponent.js'
import {GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE} from '../misc/dimensions.js'

import Move from './Move.js'
import Grid from './Grid.js'
import ScanLine from './ScanLine.js'


export default class GameInterface extends PureComponent {
    render() {
        const padding = {
            vertical: SQUARE_SIZE,
            horizontal: 3 * SQUARE_SIZE
        };
        const width = GRID_WIDTH + 2 * padding.horizontal;
        const height = GRID_HEIGHT + 2 * padding.vertical;

        return (
            <svg viewBox={"0 0 " + width + " " + height}>
                <rect x={0} y={0} width={width} height={height} className="lumines-background" />
                <Move x={padding.horizontal} y={padding.vertical}>
                    <Grid />
                    <ScanLine scanLine={this.props.scanLine}/>
                </Move>
            </svg>
        )
    }
}
