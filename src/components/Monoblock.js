import React from 'react';

import PureComponent from './PureComponent.js';
import {SQUARE_SIZE} from '../game/dimensions.js';

export default class Monoblock extends PureComponent {
    render() {
        const colorClass = this.props.color ? 'lumines-monoblock-dark' : 'lumines-monoblock-light';

        return (
            <rect x={this.props.x} y={this.props.y}
                  width={SQUARE_SIZE * 2} height={SQUARE_SIZE * 2}
                  className={'lumines-monoblock ' + colorClass}/>
        );
    }
}