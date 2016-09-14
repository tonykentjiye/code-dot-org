/**
 * Entry point to build a bundle containing a set of globals used when displaying
 * tutorialExplorer.
 */

require('babel-polyfill');
import React from 'react';
import ReactDOM from 'react-dom';
import update from 'react-addons-update';
import FilterSet from './filterSet';
import TutorialSet from './tutorialSet';

window.TutorialExplorerManager = function (options) {
  this.options = options;

  const TutorialExplorer = React.createClass({
    propTypes: {
      filterGroups: React.PropTypes.array.isRequired,
      tutorials: React.PropTypes.array.isRequired,
      locale: React.PropTypes.string.isRequired
    },

    getInitialState: function () {
      let filters = {};

      for (const filterGroup of this.props.filterGroups) {
        filters[filterGroup.name] = [];
      }
      return {
        filters: filters
      };
    },

    /**
     * Called when a filter in a filter group has its checkbox
     * checked or unchecked.  Updates the filters in state.
     *
     * @param {string} filterGroup - The name of the filter group.
     * @param {string} filterEntry - The name of the filter entry.
     * @param {bool} value - Whether the entry was checked or not.
     */
    handleUserInput: function (filterGroup, filterEntry, value) {
      let filterEntryChange = {};

      if (value) {
        // Add value to end of array.
        filterEntryChange["$push"] = [filterEntry];

      } else {
        const itemIndex = this.state.filters[filterGroup].indexOf(filterEntry);

        // Find and remove specific value from array.
        filterEntryChange["$splice"] = [[itemIndex, 1]];
      }

      const stateChange = {
        filters: {
          [filterGroup]: filterEntryChange
        }
      };

      const newState = update(this.state, stateChange);

      this.setState(newState);
    },

    render() {
      return (
        <div>
          <FilterSet
            filterGroups={this.props.filterGroups}
            onUserInput={this.handleUserInput}
            selection={this.state.filters}
          />
          <TutorialSet
            tutorials={this.props.tutorials}
            filters={this.state.filters}
            locale={this.props.locale}
          />
        </div>
      );
    }
  });

  ReactDOM.render(
    <TutorialExplorer
      filterGroups={options.filters}
      tutorials={options.tutorials.contents}
      locale={options.locale}
    />,
    document.getElementById('tutorials')
  );
};
