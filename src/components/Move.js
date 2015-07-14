import React from 'react';

import PureComponent from './PureComponent.js';

export default class Move extends PureComponent {
    render() {
        return (
            <g transform={'translate(' + this.props.x + ' ' + this.props.y + ')'}>
                {this.props.children}
            </g>
        );
    }
}