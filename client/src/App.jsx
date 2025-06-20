import './App.css'
import MainRoutes from '../src/routing/mainRoutes'
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {
    const theme = useSelector ((state) => state.theme.value);

    useEffect (() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    return (
        <>
            <MainRoutes/>
        </>
    )
}

export default App
