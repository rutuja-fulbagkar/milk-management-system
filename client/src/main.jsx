import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { store } from "./redux/store";
import ThemeProvider from './utils/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <HelmetProvider>
            <ThemeProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                style={{ zIndex: 100000 }}
                theme="colored"
              />
              <App />
            </ThemeProvider>
          </HelmetProvider>
        </AuthProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);
