import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducers from './reducers'

const loggerMiddleware = createLogger()
const middleware = []

// For redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(preloadedState) {
    return createStore(
        rootReducers,
        preloadedState,
        composeEnhancers(applyMiddleware(...middleware, loggerMiddleware))
    )
}