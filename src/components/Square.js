import React from 'react'

import PureComponent from './PureComponent.js'
import {SQUARE_SIZE} from '../misc/dimensions.js'

export default class Square extends PureComponent {
    render() {
        const colorClass = this.props.color ? 'lumines-square-dark' : 'lumines-square-light';

        return (
            <rect x={this.props.x} y={this.props.y}
                  width={SQUARE_SIZE} height={SQUARE_SIZE}
                  className={'lumines-square ' + colorClass} />
        )
    }
}