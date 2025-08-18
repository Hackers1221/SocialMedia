import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import Store from './redux/store.js'

import { SkeletonTheme } from 'react-loading-skeleton';

createRoot(document.getElementById('root')).render(
    <SkeletonTheme baseColor={`${_COLOR.border}`}>
        <BrowserRouter>
            <Provider store={Store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </SkeletonTheme>
)
