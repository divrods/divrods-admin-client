import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { action, LOAD_RULESETS_PAGE } from '../../redux/actions';
import Button from 'react-toolbox/lib/button/Button';
import RulesetToolbar from './RulesetToolbar';
import Grid from './Grid';

class RulesetsContent extends Component {
  componentWillMount() {
    this.props.loadRulesetData();
  }
  render() {

    let next_cursor = this.props.next_cursor;
    let more = this.props.more;

    return (
      <div>
        <RulesetToolbar />

        <Grid entities={this.props.entities} />
        { more && (<div style={{textAlign:'center', paddingTop:'20px'}}><Button onClick={() => this.props.loadRulesetData(next_cursor) } primary raised>Load More</Button></div>) }
      </div>
    );
  }r
}

function mapStateToProps(state) {
  const { pagination: { rulesets }, } = state;

  let entities = [];
  let more = false;
  let next_cursor = undefined;

  const paginator = rulesets.all;
  if (paginator) {
    more = paginator.more;
    entities = paginator.ids;
    next_cursor = paginator.cursor;
  }

  return {entities, more, next_cursor};
}

function mapDispatchToProps(dispatch) {
  return {
    loadRulesetData: bindActionCreators((next_cursor) => action(LOAD_RULESETS_PAGE, {next_cursor}), dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RulesetsContent);

RulesetsContent.propTypes = {
  loadRulesetData : PropTypes.func, // bound action creator
  next_cursor : PropTypes.string, // next page cursor string
  more : PropTypes.bool, // if there are more entities to load
  entities: PropTypes.array,
};