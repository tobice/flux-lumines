import React from 'react'

import PureComponent from './PureComponent.js'
import {SQUARE_SIZE, SCAN_LINE_WIDTH, GRID_HEIGHT} from '../game/dimensions.js'

export default class ScanLine extends PureComponent {
    render() {
        const {scanLine} = this.props;
        return (
            <g className="lumines-scanline">
                <linearGradient id="scanLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "rgba(255,255,255,0)" }} />
                    <stop offset="95%" style={{ stopColor: "rgba(255,255,255,0.2)" }}/>
                    <stop offset="100%" style={{ stopColor: "rgba(255,255,255,0.8)" }}/>
                </linearGradient>
                <rect x={scanLine.get('position') - SCAN_LINE_WIDTH} y={2 * SQUARE_SIZE}
                    width={SCAN_LINE_WIDTH}
                    height={GRID_HEIGHT - 2 * SQUARE_SIZE}
                    style={{stroke: false, fill: "url(#scanLineGradient)"}}/>
            </g>
        )
    }
}