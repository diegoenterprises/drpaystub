import { createStore, applyMiddleware } from 'redux';
import Reducer from '../reducers';

import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'Paystub',
    storage,
};

const persistedReducer = persistReducer(persistConfig, Reducer);

export default () => {
    let store = createStore(Reducer, applyMiddleware(thunk));
    let persistor = persistStore(store);
    return { store, persistor };
};
