import React from 'react'
import PureComponent from './PureComponent.js'
import Move from './Move.js'
import Hud from './Hud.js'
import {formatNumber} from '../misc/jshelpers.js'

export default class HudPanel extends PureComponent {
    render() {
        let HUD_HEIGHT = 18;

        return (
            <g className="lumines-hud-panel">
                <Hud label="Time" value={this.props.elapsed} />
                <Move x={0} y={HUD_HEIGHT}>
                    <Hud label="Score" value={formatNumber(this.props.score)} />
                </Move>
                <Move x={0} y={HUD_HEIGHT * 2}>
                    <Hud label="High score" value={formatNumber(this.props.highScore)} />
                </Move>
            </g>
        );
    }
}
