import React from 'react'
import PureComponent from './PureComponent.js'

import Move from './Move.js'

export default class Footer extends PureComponent {
    render() {
        let {width} = this.props;
        return (
            <g className="lumines-footer">
                <text x={width / 2}>
                    {'React.js, Flux and Immutable.js implementation of the legendary PSP game Lumines'}
                </text>
                <Move x={0} y={4}>
                    <g dangerouslySetInnerHTML={{__html:
                        '<a xlink:href="https://github.com/tobice/flux-lumines" target="_blank">' +
                        '    <text x="' + (width / 2) + '">View sources on GitHub</text>' +
                        '</a>'
                     }}></g>
                </Move>
            </g>
        );
    }
}
