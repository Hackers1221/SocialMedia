// import React from 'react'
// import PulseCard from '../../components/PulseCard'

// function Pulse() {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const videoUrls = [
//         "https://www.w3schools.com/html/mov_bbb.mp4",
//         "https://www.w3schools.com/html/movie.mp4",
//         "https://www.w3schools.com/html/mov_bbb.mp4"
//       ];

//     return (
//     <div className="fixed top-[9rem] md:top-[2rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[82vh] md:h-[97vh]">
//         <div className="heading flex justify-center text-white text-3xl">Pulses</div>
//         {videoUrls.map((ele) => (
//             <div>
//                 <PulseCard URL = {ele}/>
//             </div>
//         ))}
//     </div>
//   )
// }


import React, { useState } from "react";
import PulseCard from "../../components/PulseCard";

function Pulse() {
  const videoUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://www.w3schools.com/html/movie.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740330241/socialMedia/videos/1740330232651-videoplayback%20%284%29.mp4.mp4",
    "https://res.cloudinary.com/dxyeuw5s7/video/upload/v1740333146/socialMedia/videos/1740333139819-MAX%20QUALITY%20FILE%20IN%20BIO%20From%20the%20magnetic%20presence%20of%20Nayanthara%2C%20the%20versatile%20performances%20of%20Samantha%20Akkineni%2C%20and%20the%20powerful%20portrayals%20of%20Anushka%20Shetty%20to%20the%20graceful%20charm%20of%20Trisha%20Krishnan%2C%20these%20l%20%281%29.mp4.mp4"
  ];

  return (
    <div className="fixed top-[9rem] md:top-[2rem] md:left-[20rem] left-[1rem] w-[85%] md:w-[50%] h-[75vh] md:h-[92vh]">
      <div className="heading flex justify-center text-white text-3xl">Pulses</div>
      <div className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
        {videoUrls.map((ele, index) => (
          <div key={index} className="snap-start h-full flex justify-center pt-[2.5rem]">
            <PulseCard URL={ele} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pulse;
