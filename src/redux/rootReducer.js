import * as ActionTypes from './actions'
import merge from 'lodash'
import paginate from './reducers/paginate'
import { combineReducers } from 'redux';
import layoutReducers from './layout/reducers';
import { authStateReducer } from '../xauth/reducers';
import { routerReducer } from 'react-router-redux';


/*
function router(state = { pathname: '/' }, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_ROUTER_STATE:
      return action.state
    default:
      return state
  }
}
*/

// Updates an entity cache in response to any action with response.entities.
function entities(state = { users: {}, repos: {} }, action) {
  // TODO: This only works for our style of api...
  if (action.response) { // is a list
    let new_state = merge({}, state, action.response);
    return new_state;
  }

  return state
}

/*
// Updates error message to notify about the failed fetches.
function errorMessage(state = null, action) {
  const { type, error } = action

  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return null
  } else if (error) {
    return action.error
  }

  return state
}
*/

// Updates the pagination data for different actions.
const pagination = combineReducers({
  prefs: paginate({
    mapActionToKey: action => 'all',
    types: [
      ActionTypes.PREFS.REQUEST,
      ActionTypes.PREFS.SUCCESS,
      ActionTypes.PREFS.FAILURE
    ]
  }),
  stargazersByRepo: paginate({
    mapActionToKey: action => action.fullName,
    types: [
      ActionTypes.STARGAZERS.REQUEST,
      ActionTypes.STARGAZERS.SUCCESS,
      ActionTypes.STARGAZERS.FAILURE
    ]
  })
})

export default combineReducers({
  entities,
  pagination,
  router: routerReducer,
  layout: layoutReducers,
  auth: authStateReducer
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