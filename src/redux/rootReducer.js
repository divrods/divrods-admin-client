import * as ActionTypes from './actions';
import paginate from './reducers/paginate';
import { combineReducers } from 'redux';
import layoutReducers from './layout/reducers';
import { authStateReducer, createUserFormState, changePasswordFormState } from '../xauth/reducers';
import { routerReducer } from 'react-router-redux';
import { USERS } from '../xauth/actions';


// This is a simple entty cache that supports data like {resource_id: guid, ...}
// Currently, don't check it, but this should be the source of "truth" for an entity
// Note: This only works with

function entities(state = {}, action) {
  // TODO: This only works for our style of api...

  if (action.type && action.type.indexOf('SUCCESS') !== -1) { // is a list
    var resources = action.response.results;
    if(!Array.isArray(resources)){
      resources = [resources];
    }

    let new_resources = {};
    resources.forEach(function (resource) {
      if (false && resource.resource_id) {
        new_resources[resource.resource_id] = resource;
        return;
      }

      console.debug('Resource did not have resource_id property. Is verbose=true?');
    });

    return Object.assign({}, state, new_resources);
  }

  return state
}


function makeRulesetDefaultFormState(state={index:{}}, action) {
  switch(action.type) {
    case 'INITFORMSTATE': {
      const updatedFormState =  { async_success: false, error_message: '', showDialog: true};
      const updatedFormStates = Object.assign({}, state.index, {[action.formstateId]: updatedFormState});
      return Object.assign({}, state, {index: updatedFormStates});
    }
    case 'RESETFORMSTATE': {
      const updatedFormState = {async_success: false, error_message: '', showDialog: false };
      const updatedFormStates = Object.assign({}, state.index, {[action.formstateId]: updatedFormState});
      return Object.assign({}, state, {index: updatedFormStates});
    }
    case ActionTypes.MAKE_RULESET_DEFAULT.SUCCESS: {
      const updatedFormState = { async_success: true, error_message: '', showDialog: false }
      const updatedFormStates = Object.assign({}, state.index, {[action.formstateId]: updatedFormState});
      return Object.assign({}, state, {index: updatedFormStates});
    } case ActionTypes.MAKE_RULESET_DEFAULT.FAILURE: {
      const updatedFormState = { async_success: false, error_message: action.error, showDialog: true }
      const updatedFormStates = Object.assign({}, state.index, {[action.formstateId]: updatedFormState});
      return Object.assign({}, state, {index: updatedFormStates});
    } default: {
      return state
    }
  }
}


// Updates the pagination data for different actions.
const pagination = combineReducers({
  prefs: paginate({
    mapActionToKey: () => 'all',
    types: [
      ActionTypes.PREFS.REQUEST,
      ActionTypes.PREFS.SUCCESS,
      ActionTypes.PREFS.FAILURE
    ]
  }),
  rulesets: paginate({
    mapActionToKey: () => 'all',
    types: [
      ActionTypes.RULESETS.REQUEST,
      ActionTypes.RULESETS.SUCCESS,
      ActionTypes.RULESETS.FAILURE
    ]
  }),
  ruleset_rules: paginate({
    mapActionToKey: action => action.ruleset_id,
    types: [
      ActionTypes.RULES.REQUEST,
      ActionTypes.RULES.SUCCESS,
      ActionTypes.RULES.FAILURE
    ]
  }),
  auth_users: paginate({
    mapActionToKey: () => 'all',
    types: [
      USERS.REQUEST,
      USERS.SUCCESS,
      USERS.FAILURE
    ]
  })
})

export default combineReducers({
  entities,
  pagination,
  router: routerReducer,
  layout: layoutReducers,
  auth: authStateReducer,
  createUserFormState,
  changePasswordFormState,
  makeRulesetDefaultFormState
});


/*
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)
*/