import React from 'react'

import PureComponent from './PureComponent.js'
import {GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE} from '../misc/dimensions.js'

import Move from './Move.js'
import GridBackground from './GridBackground.js'
import ScanLine from './ScanLine.js'
import Block from './Block.js'
import Queue from './Queue.js'
import GridSquares from './GridSquares.js'
import DetachedSquares from './DetachedSquares.js'

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

                <Move x={SQUARE_SIZE / 2} y={3 * SQUARE_SIZE}>
                    <Queue queue={this.props.queue} />
                </Move>

                <Move x={padding.horizontal} y={padding.vertical}>
                    <GridBackground />
                    <GridSquares grid={this.props.grid} />
                    <DetachedSquares detachedSquares={this.props.detachedSquares} />
                    <Block block={this.props.block} />
                    <ScanLine scanLine={this.props.scanLine} />
                </Move>
            </svg>
        )
    }
}
