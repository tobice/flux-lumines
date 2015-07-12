import React from 'react'

import PureComponent from './PureComponent.js'
import {GRID_WIDTH, GRID_HEIGHT, SQUARE_SIZE} from '../game/dimensions.js'
import {WELCOME, PLAYING, PAUSED, OVER} from '../game/gameStates.js'
import {formatNumber} from '../misc/jshelpers.js'

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
import Footer from './Footer.js'

export default class GameInterface extends PureComponent {
    render() {
        let GUTTER = SQUARE_SIZE / 2,
            QUEUE_WIDTH = SQUARE_SIZE * 2,
            HUD_PANEL_WIDTH = SQUARE_SIZE * 3,
            FOOTER_HEIGHT = 5;

        let width = GUTTER + QUEUE_WIDTH + GUTTER + GRID_WIDTH + GUTTER + HUD_PANEL_WIDTH + GUTTER,
            height = GUTTER + GRID_HEIGHT + GUTTER + FOOTER_HEIGHT;

        let overlayWidth = width,
            overlayHeight = 6 * SQUARE_SIZE;

        let {state} = this.props;

        return (
            <svg viewBox={"0 0 " + width + " " + height} className={"lumines lumines-" + this.props.color}>
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

                <Move x={GUTTER + QUEUE_WIDTH + GUTTER} y={GUTTER + GRID_HEIGHT + GUTTER}>
                    <Footer width={GRID_WIDTH} />
                </Move>

                <Move x={width - GUTTER - HUD_PANEL_WIDTH} y={GUTTER}>
                    <DebugBar {...this.props.debug} />
                </Move>

                <Move x={width - GUTTER - HUD_PANEL_WIDTH} y={GUTTER + 2 * SQUARE_SIZE}>
                    <HudPanel {...this.props.hud} />
                </Move>

                <Move x={0} y={3 * SQUARE_SIZE}>
                    {state == WELCOME &&
                    <Overlay width={overlayWidth} height={overlayHeight} label="Welcome to Lumines">
                        <tspan>Press </tspan>
                        <tspan className="lumines-text-colored">R</tspan>
                        <tspan> to start the game</tspan>
                    </Overlay>
                    }

                    {state == PAUSED &&
                    <Overlay width={overlayWidth} height={overlayHeight} label="Game paused">
                        <tspan>Press </tspan>
                        <tspan className="lumines-text-colored">Esc</tspan>
                        <tspan> to continue the game</tspan>
                    </Overlay>
                    }

                    {state == OVER &&
                    <Overlay width={overlayWidth} height={overlayHeight}
                        label={"Game over. Your score is " + formatNumber(this.props.hud.score)}>
                        <tspan>Press </tspan>
                        <tspan className="lumines-text-colored">R</tspan>
                        <tspan> to restart the game</tspan>
                    </Overlay>
                    }
                </Move>
            </svg>
        )
    }
}
