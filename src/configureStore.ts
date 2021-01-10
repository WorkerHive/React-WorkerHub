import { createStore, applyMiddleware, Reducer, Store, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, Persistor } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import rootReducer from './reducers'

const persistConfig = {
  key: 'root',
  storage,
}

export default function() : any {
  const persistedReducer : Reducer<any, never> = persistReducer(persistConfig, rootReducer)
  let store : Store<any, AnyAction> = createStore(persistedReducer, applyMiddleware(thunk))
  let persistor : Persistor = persistStore(store)
  return { store, persistor }
}
