import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPulse } from "../redux/Slices/pulse.slice";

function usePulse () {
    const pulseState = useSelector ((state) => state.pulse);

    const dispatch = useDispatch ();

    function loadPulse () {
        if(!pulseState?.downloadedPulse?.length) dispatch (getAllPulse ()); 
    }

    useEffect (() => {
        loadPulse ();
    }, [pulseState?.downloadedPulse]);

    return [pulseState];
}

export default usePulse;