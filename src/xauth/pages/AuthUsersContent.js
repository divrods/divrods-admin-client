import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { action } from '../../redux/actions';
import { LOAD_USERS_PAGE } from '../../xauth/actions'
import Button from 'react-toolbox/lib/button/Button';
import UsersActionToolbar from './UsersActionToolbar';
import Grid from './Grid';

class AuthUsersContent extends Component {
  componentWillMount() {
    this.props.loadRulesetData();
  }
  render() {
    let next_cursor = this.props.next_cursor;
    let more = this.props.more;
    return (
      <div>
        <UsersActionToolbar />
        <Grid entities={this.props.entities} />
        { more && (<div style={{textAlign:'center', paddingTop:'20px'}}><Button onClick={() => this.props.loadRulesetData(next_cursor) } primary raised>Load More</Button></div>) }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { pagination: { auth_users }, } = state;

  let entities = [];
  let more = false;
  let next_cursor = undefined;

  const paginator = auth_users.all;
  if (paginator) {
    more = paginator.more;
    entities = paginator.ids;
    next_cursor = paginator.cursor;
  }


  return {entities, more, next_cursor};
}

function mapDispatchToProps(dispatch) {
  return {
    loadRulesetData: bindActionCreators((next_cursor) => action(LOAD_USERS_PAGE, {next_cursor}), dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthUsersContent);


AuthUsersContent.propTypes = {
  loadRulesetData : PropTypes.func, // bound action creator
  next_cursor : PropTypes.string, // next page cursor string
  more : PropTypes.bool, // if there are more entities to load
  entities: PropTypes.array
};