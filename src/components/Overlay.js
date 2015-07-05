import React from 'react'
import PureComponent from './PureComponent.js'
import Move from './Move.js'
import Controls from './Controls.js'

export default class Overlay extends PureComponent {
    render() {
        const {label, width, height, show} = this.props;
        const padding = 5;
        return (
            <g className="lumines-overlay">
                <rect x={0} y={0} width={width} height={height} className="lumines-overlay-bg" />
                <text className="lumines-overlay-label" x={width / 2} y={padding}>{label}</text>
                <text className="lumines-overlay-message" x={width / 2} y={padding + 16}>
                    {this.props.children}
                </text>

                <Move x={width / 2} y={padding + 24}>
                    <Controls />
                </Move>
            </g>
        );
    }
}
