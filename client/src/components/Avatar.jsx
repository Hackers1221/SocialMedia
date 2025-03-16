function Avatar ({size, url, border}) {
  let width = 'w-12';
  if (size === 'lg') {
    width = 'w-20 md:w-32';
  }
  if (size === 'md') {
    width = 'w-8';
  }
  if (size === 'sm') {
    width = 'w-6';
  }
  let bord = ''
  if (border === "true") {
    bord = 'border-4 border-white';
  }
  return (
    <div className={`${width}`}>
      <div className={`rounded-full overflow-hidden hover:cursor-pointer bg-black ${bord}`}>
        <img src={url} alt="" className="object-fit"/>
      </div>
    </div>
  );
}

export default Avatar;