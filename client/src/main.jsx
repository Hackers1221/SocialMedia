import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import Store from './redux/store.js'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={Store}>
      <App/>
      <Toaster
        position='bottom-left'
      />
    </Provider>
  </BrowserRouter>,
)
