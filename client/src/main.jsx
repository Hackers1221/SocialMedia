import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from './redux/store.js'

import { SkeletonTheme } from 'react-loading-skeleton';
import { ThemeProvider } from './ThemeContext.jsx'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
    <SkeletonTheme baseColor={`${_COLOR.border}`}>
    <BrowserRouter>
      <Provider store={Store}>
        <ThemeProvider>
            <App/>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </SkeletonTheme>
)
