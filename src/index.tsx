import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
<<<<<<< HEAD
    <React.StrictMode>
        <CookiesProvider>
            <App />
        </CookiesProvider>
    </React.StrictMode>
);
=======
    <App />
)

 
>>>>>>> 898ffd89e3fcea48dae5e54df1f43351a8dbd513
