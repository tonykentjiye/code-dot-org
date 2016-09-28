/** @file JavaScript run only on the /s/:script_name/edit page. */
/* global scriptData, i18nData, keyList */

import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Motion, spring} from 'react-motion';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import color from '../color';

const styles = {
  stage: {
    border: '1px solid #ccc',
    borderRadius: 5,
    margin: '10px 0',
    padding: 20,
    overflow: 'hidden'
  },
  stageName: {
    marginTop: 0
  },
  level: {
    float: 'left',
    clear: 'both',
    padding: '3px 6px',
    margin: '3px 0',
    background: color.cyan,
    color: '#fff',
    borderRadius: '4px',
    ':hover': {
      background: color.light_cyan
    }
  },
  remove: {
    marginLeft: 10
  }
};

const DRAG_THRESHOLD = 5;

const ScriptEditor = React.createClass({
  propTypes: {
    scriptData: React.PropTypes.object.isRequired,
    i18nData: React.PropTypes.object.isRequired,
    keyList: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  },

  handleMouseDown(index, {pageY}) {
    this.setState({
      dragging: index,
      delta: 0,
      overThreshold: false,
      startingPageY: pageY
    });
  },

  handleMouseMove({pageY}) {
    if (this.state.dragging > -1) {
      const delta = pageY - this.state.startingPageY;
      this.setState({
        delta,
        overThreshold: this.state.overThreshold || Math.abs(delta) > DRAG_THRESHOLD
      });
    }
  },

  handleMouseUp() {
    this.setState({
      dragging: -1,
      overThreshold: false
    });
  },

  updatePlc() {
    this.setState({
      isPlc: this.refs.plc.checked
    });
  },

  render() {
    return (
      <form>
        <div className="form-group">
        <label>Title <input className="form-control" defaultValue={this.props.i18nData.title} /></label>
        </div>
        <label>Short Description <input defaultValue={this.props.i18nData.descriptionShort} /></label>
        <label> Description <textarea defaultValue={this.props.i18nData.description} /></label>
        <label>Audience <input defaultValue={this.props.i18nData.descriptionAudience} /></label>
        <label>Professional Learning Course <input type="checkbox" ref="plc" onChange={this.updatePlc} /></label>
        {this.state.isPlc &&
          <label>Peer reviews to complete <input type="number" /></label>
        }
        <label>Hidden <input type="checkbox" /></label>
        <label>Login required <input type="checkbox" /></label>
        <label>Legacy PD script <input type="checkbox" /></label>
        <label>Allow stages to be hidden by teachers <input type="checkbox" /></label>
        <label>Wrap-up video <input defaultValue={this.props.scriptData.wrapup_video} /></label>
        <VirtualizedSelect options={this.props.keyList} clearable={false} />
        <div>
          {this.props.scriptData.stages.map(stage =>
            <div style={styles.stage} key={stage.title}>
              <h2 style={styles.stageName}>{stage.title}</h2>
              <div>
                {stage.levels.map((level, levelIndex) => {
                  const config = {stiffness: 500, damping: 30};
                  const style = this.state.overThreshold && this.state.dragging === levelIndex ? {
                      y: this.state.delta,
                      scale: spring(1.1, config),
                      shadow: spring(7, config)
                    } : {
                      y: 0,
                      scale: 1,
                      shadow: 0
                    };
                  return (
                    <Motion style={style} key={levelIndex}>
                      {({y, scale, shadow}) =>
                        <div
                          onMouseDown={this.handleMouseDown.bind(null, levelIndex)}
                          style={Object.assign({}, styles.level, {
                            transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                            boxShadow: `${color.shadow} 0 ${shadow}px ${shadow * 2}px`,
                            zIndex: this.state.dragging === levelIndex ? 1000 : 'auto'
                          })}
                          key={stage.title + ':' + level.name}
                        >
                          {level.name}
                          <i className="fa fa-times" style={styles.remove}/>
                        </div>
                      }
                    </Motion>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
});

ReactDOM.render(
  <ScriptEditor scriptData={scriptData} i18nData={i18nData} keyList={keyList} />,
  document.querySelector('.edit_container')
);
