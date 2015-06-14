import React from 'react'
import PureComponent from './PureComponent.js'
import Move from './Move.js'
import Hud from './Hud.js'

export default class HudPanel extends PureComponent {
    render() {
        let HUD_HEIGHT = 18;

        // Separate thousands by comma
        let score = this.props.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return (
            <g className="lumines-hud-panel">
                <Hud label="Time" value={this.props.elapsed} />
                <Move x={0} y={HUD_HEIGHT}>
                    <Hud label="Score" value={score} />
                </Move>
                <Move x={0} y={HUD_HEIGHT * 2}>
                    <Hud label="High score" value="52,134" />
                </Move>
            </g>
        );
    }
}
