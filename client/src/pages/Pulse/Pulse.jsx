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
    <div className="fixed top-[9rem] md:top-[2rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[75vh] md:h-[92vh]">
      <div className="heading flex justify-center text-white text-3xl">Pulses</div>
      <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {pulseState?.downloadedPulse?.map((pulse, index) => (
          <div key={index} className="snap-start h-full flex justify-center pt-[2.5rem]">
            <PulseCard pulse={pulse} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pulse;
