import React from 'react'
import PureComponent from './PureComponent.js'
import Move from './Move.js'
import Hud from './Hud.js'

export default class HudPanel extends PureComponent {
    render() {
        let HUD_HEIGHT = 18;
        return (
            <g className="lumines-hud-panel">
                <Hud label="Time" value="34:12" />
                <Move x={0} y={HUD_HEIGHT}>
                    <Hud label="Score" value="2,134" />
                </Move>
                <Move x={0} y={HUD_HEIGHT * 2}>
                    <Hud label="High score" value="52,134" />
                </Move>
            </g>
        );
    }
}
