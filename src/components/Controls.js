import React from 'react'
import PureComponent from './PureComponent.js'

export default class Controls extends PureComponent {
    render() {
        return (
            <g className="lumines-controls">
                <text x={-2} className="lumines-control-legend">Pause/Resume</text>
                <text x={2} className="lumines-control-key">Esc</text>

                <text x={-2} y={5} className="lumines-control-legend">Restart</text>
                <text x={2} y={5} className="lumines-control-key">R</text>

                <text x={-2} y={10} className="lumines-control-legend">Move left/right</text>
                <text x={2} y={10} className="lumines-control-key">Arrow left/right</text>

                <text x={-2} y={15} className="lumines-control-legend">Rotate left</text>
                <text x={2} y={15} className="lumines-control-key">A</text>

                <text x={-2} y={20} className="lumines-control-legend">Rotate right</text>
                <text x={2} y={20} className="lumines-control-key">D, Arrow up</text>

                <text x={-2} y={25} className="lumines-control-legend">Drop</text>
                <text x={2} y={25} className="lumines-control-key">Arrow down</text>
            </g>);
    }
}
