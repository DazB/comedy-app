/*
* In Redux, all the application state is stored as a single object
* The Store holds the application state, allows access to the state, allows it to be updated, lets people subscribe
* and unsubscribe listeners
*/

import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import rootReducer from '../reducers/index'

export default function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
    )
  )
}