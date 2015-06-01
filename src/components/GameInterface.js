import React from 'react'

import PureComponent from './PureComponent.js'
import dimensions from '../misc/dimensions.js'

import Grid from './Grid.js'
import ScanLine from './ScanLine.js'

export default class GameInterface extends PureComponent {
    render() {
        const {scanLine} = this.props;
        const viewBox = "0 0 " + dimensions.GRID_WIDTH + " " + dimensions.GRID_HEIGHT;
        return (
            <svg viewBox={viewBox}>
                <Grid />
                <ScanLine scanLine={scanLine}/>
            </svg>
        )
    }
}
