import React from 'react/addons'

import PureComponent from './PureComponent.js'
import {SQUARE_SIZE} from '../misc/dimensions.js'

export default class Square extends PureComponent {
    render() {
        let classes = React.addons.classSet({
            'lumines-square': true,
            'lumines-square-dark': this.props.color,
            'lumines-square-light': !this.props.color,
            'lumines-square-scanned': this.props.scanned
        });

        return (
            <rect x={this.props.x} y={this.props.y}
                  width={SQUARE_SIZE} height={SQUARE_SIZE}
                  className={classes} />
        )
    }
}