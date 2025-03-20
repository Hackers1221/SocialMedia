import React, { useEffect } from "react";
import PulseCard from "../../components/PulseCard";
import { getAllPulse } from "../../redux/Slices/pulse.slice";
import { useDispatch, useSelector } from "react-redux";

function Pulse() {
  const pulseState = useSelector((state) => state.pulse);
  const dispatch = useDispatch();

  async function getPulses () {
    const res = await dispatch (getAllPulse());
    if (!res) toast.error ("Something went wrong");
  }
  useEffect (() => {
    getPulses();
  }, [])

  return (
    <div className="fixed top-[4rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[93%] md:w-[50%] h-[90vh] md:h-[97vh]">
      <div className={`heading hidden sm:flex justify-center text-[var(--text)] text-3xl`}>Pulse</div>
      <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide ">
        {pulseState?.downloadedPulse?.map((pulse, index) => (
          <div key={index} className="snap-start h-full flex justify-center sm:pt-[2.5rem]">
            <PulseCard pulse={pulse} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pulse;
