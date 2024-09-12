/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {store} from './src/services/redux/store';
import {useRef} from 'react';

const StoreProvider = ({children}) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = store();
  }
  return (
    <Provider store={storeRef.current}>
      <App />
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => StoreProvider);
