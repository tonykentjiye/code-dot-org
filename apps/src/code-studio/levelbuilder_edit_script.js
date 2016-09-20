/** @file JavaScript run only on the /s/:script_name/edit page. */

import React from 'react';
import ReactDOM from 'react-dom';
import {Motion, spring} from 'react-motion';

/**
 * TODO
 */
var TestComponent = React.createClass({
  propTypes: {
    // alignment: React.PropTypes.string,
    // assetChosen: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {reverse: true, currentStyle: spring(800, {stiffness: 300, damping: 50})};
  },

  reset() {
    this.setState({
      reverse: !this.state.reverse,
      currentStyle: spring(this.state.reverse ? 0 : 800, {stiffness: this.refs.stiffness.value, damping: this.refs.damping.value})
    });
  },

  render() {
    return (
      <div>
        <Motion defaultStyle={{x: 0}} style={{x: this.state.currentStyle}}>
          {value =>
            <div
              style={{background: '#0f0', marginLeft: value.x, width: 100, height: 100}}
            >
              Hello world
            </div>
          }
        </Motion>
        <br/>
        <p><input type="range" min="1" max="1000" defaultValue="250" ref="stiffness"/> Stiffness</p>
        <p><input type="range" min="1" max="100" defaultValue="7" ref="damping"/> Damping</p>
        <button onClick={this.reset}>Animate</button>
      </div>
    );
  }
});

ReactDOM.render(
  <TestComponent />,
  document.querySelector('.edit_container')
);
