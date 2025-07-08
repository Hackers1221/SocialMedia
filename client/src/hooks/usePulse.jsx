import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPulse, getSavedPulse } from "../redux/Slices/pulse.slice";
import { useLocation } from "react-router-dom";

function usePulse () {
    const authState = useSelector ((state) => state.auth);
    const pulseState = useSelector ((state) => state.pulse);

    const dispatch = useDispatch ();
    const location = useLocation ();

    function loadPulse () {
        if(!pulseState?.downloadedPulse?.length || !location.state?.source) {
            dispatch (getAllPulse ()); 
            dispatch(getSavedPulse (authState?.data?._id));
        }

        if (location.pathname === '/saved' || location.pathname === '/explore') dispatch(getSavedPulse (authState?.data?._id));
    }

    useEffect (() => {
        loadPulse ();
    }, []);

    return [pulseState];
}

export default usePulse;