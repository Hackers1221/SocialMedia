const images = [
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "row-span-2" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "row-span-2" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg0", span: "" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "row-span-2" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "" },
    { src: "https://res.cloudinary.com/dxyeuw5s7/image/upload/v1740424179/socialMedia/images/1740424177844-Rukmini_Vasanth1.jpg.jpg", span: "" },
  ];
  
  const ExploreGrid = () => {
    return (
      <div className="grid grid-cols-3 gap-1 md:gap-2 md:p-4 z-[100]">
        {images.map((image, index) => (
          <div key={index} className={`relative ${image.span}`}>
            <img src={image.src} alt={`Explore ${index}`} className="w-full h-full object-cover" />
            {/* Play icon for reels (if applicable) */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
              🎥
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ExploreGrid;
  