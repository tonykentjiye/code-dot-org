/** @file JavaScript run only on the /s/:script_name/edit page. */

import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import {Motion, spring} from 'react-motion';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-virtualized/styles.css';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';

const styles = {
  stage: {
    border: '1px solid #ccc',
    borderRadius: 5,
    margin: '10px 0',
    padding: 20
  },
  stageName: {
    marginTop: 0
  },
  level: {
    ':hover': {
      fontWeight: 'bold'
    }
  }
};

const ScriptEditor = Radium(React.createClass({
  propTypes: {
    scriptData: React.PropTypes.object.isRequired,
    i18nData: React.PropTypes.object.isRequired,
    keyList: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {};
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
        <StageList stages={this.props.scriptData.stages} />
      </form>
    );
  }
}));

const StageList = Radium(React.createClass({
  propTypes: {
    stages: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
        {this.props.stages.map(stage =>
          <div style={styles.stage} key={stage.title}>
            <h2 style={styles.stageName}>{stage.title}</h2>
            <LevelList levels={stage.levels} />
          </div>
        )}
      </div>
    );
  }
}));

const LevelList = Radium(React.createClass({
  propTypes: {
    levels: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div>
        {this.props.levels.map(level =>
          <div style={styles.level} key={level.title}>
            {level.name}
          </div>
        )}
      </div>
    );
  }
}));

/**
 * TODO
 */
const TestComponent = React.createClass({
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
  <ScriptEditor scriptData={scriptData} i18nData={i18nData} keyList={keyList} />,
  document.querySelector('.edit_container')
);
