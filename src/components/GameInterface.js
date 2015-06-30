import React from 'react'

import PureComponent from './PureComponent.js'
import {GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE} from '../game/dimensions.js'
import {WELCOME, PLAYING} from '../game/gameStates.js'

import Move from './Move.js'
import GridBackground from './GridBackground.js'
import ScanLine from './ScanLine.js'
import Block from './Block.js'
import Queue from './Queue.js'
import GridSquares from './GridSquares.js'
import DetachedSquares from './DetachedSquares.js'
import DebugBar from './DebugBar.js'
import HudPanel from './HudPanel.js'
import Overlay from './Overlay.js'

export default class GameInterface extends PureComponent {
    render() {
        let GUTTER = SQUARE_SIZE / 2,
            QUEUE_WIDTH = SQUARE_SIZE * 2,
            HUD_PANEL_WIDTH = SQUARE_SIZE * 3;

        let width = GUTTER + QUEUE_WIDTH + GUTTER + GRID_WIDTH + GUTTER + HUD_PANEL_WIDTH + GUTTER,
            height = GUTTER + GRID_HEIGHT + GUTTER;

        let {state} = this.props;

        return (
            <svg viewBox={"0 0 " + width + " " + height} className="lumines">
                <rect x={0} y={0} width={width} height={height} className="lumines-background" />

                <Move x={GUTTER} y={GUTTER + 2 * SQUARE_SIZE}>
                    <Queue queue={this.props.queue} />
                </Move>

                <Move x={GUTTER + QUEUE_WIDTH + GUTTER} y={GUTTER}>
                    <GridBackground />
                    <GridSquares grid={this.props.grid} />
                    <DetachedSquares detachedSquares={this.props.detachedSquares} />

                    {state != WELCOME && <g>
                        <Block block={this.props.block} />
                        <ScanLine scanLine={this.props.scanLine} />
                    </g>}
                </Move>

                <Move x={width - GUTTER - HUD_PANEL_WIDTH} y={GUTTER}>
                    <DebugBar {...this.props.debug} />
                </Move>

                <Move x={width - GUTTER - HUD_PANEL_WIDTH} y={GUTTER + 2 * SQUARE_SIZE}>
                    <HudPanel {...this.props.hud} />
                </Move>

                {state != PLAYING &&
                <Move x={0} y={3 * SQUARE_SIZE}>
                    <Overlay width={width} height={6 * SQUARE_SIZE}
                             show={state != PLAYING}
                             label="Welcome to Lumines">
                    </Overlay>
                </Move>
                }
            </svg>
        )
    }
}
