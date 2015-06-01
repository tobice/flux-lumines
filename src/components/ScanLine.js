import React from 'react'

import PureComponent from './PureComponent.js'
import dimensions from '../misc/dimensions.js'

export default class ScanLine extends PureComponent {
    render() {
        const {scanLine} = this.props;
        return (
            <rect x={scanLine.get('position') - 2} y={0}
                width={2}
                height={dimensions.GRID_HEIGHT}
                style={{stroke: "#000000", fill: "green"}}/>
        )
    }
}