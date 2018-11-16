import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducers from './reducer'

export default createStore(reducers, applyMiddleware(...[ thunk, logger ]))
