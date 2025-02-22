import { useState, useEffect } from "react";

const Explore = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages([
      "https://tse1.mm.bing.net/th?id=OIP.eD9-ocppLL5dduPpP7lzPAHaEK&w=266&h=266&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.URX3g3SmLfWwSuPr459ibwHaHw&w=474&h=474&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
      "https://tse1.mm.bing.net/th?id=OIP.eD9-ocppLL5dduPpP7lzPAHaEK&w=266&h=266&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.URX3g3SmLfWwSuPr459ibwHaHw&w=474&h=474&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
      "https://tse1.mm.bing.net/th?id=OIP.eD9-ocppLL5dduPpP7lzPAHaEK&w=266&h=266&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.URX3g3SmLfWwSuPr459ibwHaHw&w=474&h=474&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
      "https://tse3.mm.bing.net/th?id=OIP.Oc-T0TUXo2iuOBfQfLSbDAHaEo&w=296&h=296&c=7",
      "https://tse4.mm.bing.net/th?id=OIP.Mvcr0QDsGXOx29cSBfXd6AHaE7&w=315&h=315&c=7",
    ]);
  }, []);

  return (
    <div className="fixed top-[8rem] md:top-[1rem]  md:left-[20rem] left-[1rem] w-[85%] md:w-[49%] h-[97vh] flex flex-col flex-grow overflow-y-auto">
      <div className="max-w-5xl w-full">
      <h2 className={`text-[${_COLOR.lightest}] heading text-[2rem] mb-4`}>Explore</h2>
        <div className="relative w-full mb-6">
          <input
            type="text"
            placeholder="Search for ideas..."
            className={`w-full p-3 border border-gray-300 rounded-md shadow-md focus:outline-none text-[${_COLOR.lightest}]`}
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg hover:cursor-pointer">
              <img
                src={image}
                alt="Explore"
                className="w-full h-auto object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
                View
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
