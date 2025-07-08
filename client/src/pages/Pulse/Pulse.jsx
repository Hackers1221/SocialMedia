import { useEffect, useState, useRef } from "react";
import PulseCard from "../../components/PulseCard";
import { useDispatch, useSelector } from "react-redux";
import { getPulseComments } from "../../redux/Slices/comment.slice";
import { getFollowerDetails } from "../../redux/Slices/auth.slice";
import usePulse from "../../hooks/usePulse";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { showToast } from "../../redux/Slices/toast.slice";

function Pulse () {
    const authState = useSelector((state) => state.auth);
    const [pulseState] = usePulse();

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { pulseId } = useParams();

    const [followers, setFollowers] = useState([]);
    const containerRef = useRef();
    const cardRefs = useRef([]);

    const source = location.state?.source || "pulseList";
    const array = source === "savedList" ? pulseState.savedList : pulseState.pulseList;

    const getDetails = async () => {
        const response = await dispatch(getFollowerDetails(authState.data._id));
        setFollowers(response.payload?.data?.userdata);
    };

    // Scroll to initial pulse if pulseId exists
    useEffect(() => {
    if (pulseId && array.length > 0) {
        const index = array.findIndex(p => p._id === pulseId);

        if (index >= 0 && cardRefs.current[index]) {
            cardRefs.current[index].scrollIntoView({ behavior: "instant", block: "start" });
        } else {
            navigate (-1);
            dispatch (showToast ({ type: "error", message: "Pulse no longer exists!" }));
        }
    }
}, [pulseId, array, dispatch]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        const pulse = array[index];
                        if (pulse && pulse._id !== pulseId) {
                            navigate(`/pulse/${pulse._id}`);
                        }
                    }
                }
            },
            {
                root: containerRef.current,
                threshold: 0.7, // Only change route when card is clearly in view
            }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [array, pulseId, navigate]);

    useEffect(() => {
        getDetails();
        dispatch(getPulseComments());
    }, []);

    return (
        <div className="fixed top-[4rem] md:top-[1rem] md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh]">
            <div className="heading hidden sm:flex justify-center text-[var(--text)] text-3xl">Pulse</div>
            <div ref={containerRef} className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
                {array.map((pulse, index) => (
                    <div
                        key={pulse._id}
                        data-index={index}
                        ref={(el) => (cardRefs.current[index] = el)}
                        className="snap-start h-full flex justify-center sm:pt-[2.5rem]"
                    >
                        <PulseCard pulse={pulse} followers={followers} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Pulse;
