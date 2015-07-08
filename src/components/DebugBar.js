import React from 'react'
import PureComponent from './PureComponent.js'

const round2 = (number) => Math.round(number * 100) / 100;

export default class DebugBar extends PureComponent {
    render() {
        const {fps, fpsMin, update, updateMax, render, renderMax, gravity} = this.props;
        return (
            <g className="lumines-debug-bar">
                <text>{'FPS: ' + Math.round(fps) + '/' + Math.round(fpsMin)}</text>
                <text y={4}>{'Update: ' + round2(update) + 'ms'}</text>
                <text y={8}>{'Render: ' + round2(render) + 'ms'}</text>
                <text y={12}>{'Gravity: ' + round2(gravity)}</text>
            </g>
        );
    }
}
