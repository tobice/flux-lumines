import React from 'react'
import PureComponent from './PureComponent.js'

export default class Hud extends PureComponent {
    render() {
        const {label, value} = this.props;
        return (
            <g className="lumines-hud">
                <text className="lumines-hud-label">{label}</text>
                <text className="lumines-hud-value" y={7}>{value}</text>
            </g>
        );
    }
}
