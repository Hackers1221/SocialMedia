import React, { useEffect, useState } from "react";
import PulseCard from "../../components/PulseCard";
import { useDispatch, useSelector } from "react-redux";
import { getPulseComments } from "../../redux/Slices/comment.slice";
import { getFollowerDetails } from "../../redux/Slices/auth.slice";
import 

function Pulse() {
    const authState = useSelector ((state) => state.auth);
    const [pulseState] = usePulse ();

    const dispatch = useDispatch();

    const [followers, setFollowers] = useState ([]);

    async function getAllComments () {
        await dispatch (getPulseComments ());
    }

    const getDetails = async() => {
        const response = await dispatch(getFollowerDetails (authState.data._id));
        setFollowers(response.payload?.data?.userdata);
    }

    useEffect (() => {
        getDetails ();
        getAllComments ();
    }, [])

    return (
        <div className="fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh]">
        <div className={`heading hidden sm:flex justify-center text-[var(--text)] text-3xl`}>Pulse</div>
        <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide ">
            {pulseState?.downloadedPulse?.map((pulse, index) => (
            <div key={index} className="snap-start h-full flex justify-center sm:pt-[2.5rem]">
                <PulseCard pulse={pulse} followers={followers}/>
            </div>
            ))}
        </div>
        </div>
    );
}

export default Pulse;
