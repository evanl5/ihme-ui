import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import map from 'lodash/map';
import { CommonPropTypes } from '../../../utils';

import style from './slider.css';

export default class Ticks extends React.PureComponent {
  render() {
    return (
      <svg
        className={classNames(style['track-ticks'], this.props.className)}
        style={this.props.style}
        width="100%"
        height="100%"
      >
        {
          map(this.props.x, (x) => (
            <line
              key={x}
              className={this.props.tickClassName}
              style={this.props.tickStyle}
              x1={x} x2={x}
              y1="0%" y2="100%"
              stroke="black"
            />
          ))
        }
      </svg>
    );
  }
}

Ticks.propTypes = {
  /* class name and style for the component */
  className: CommonPropTypes.className,
  style: PropTypes.object,

  /* class name and style for each tick */
  tickClassName: CommonPropTypes.className,
  tickStyle: PropTypes.object,

  /* list of x tick positions */
  x: PropTypes.arrayOf(PropTypes.number).isRequired,
};
