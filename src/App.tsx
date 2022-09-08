/* components */
import { ToastContainer } from 'Components/Atomes/ToastContainer';
import { useLocation } from 'react-router';
/* main routes */
import Routings from 'Routings';
/* styles */
import './App.css';

export default function App(): JSX.Element {
    const location = useLocation();
    return (
        <>
            <Routings />
            <ToastContainer />
        </>
    );
}
