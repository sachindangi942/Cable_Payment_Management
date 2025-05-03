import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import Store, { persister } from './redux/Store';
import { ConfigProvider } from 'antd';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persister}>
      <ConfigProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ConfigProvider>
    </PersistGate>
  </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
