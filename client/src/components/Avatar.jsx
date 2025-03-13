function Avatar ({size, url}) {
  let width = 'w-12';
  if (size === 'lg') {
    width = 'w-20 md:w-32';
  }
  if (size === 'md') {
    width = 'w-8';
  }
  return (
    <div className={`${width}`}>
      <div className="rounded-full overflow-hidden hover:cursor-pointer object-cover bg-yellow-600">
        <img src={url} alt="" className="w-full h-full"/>
      </div>
    </div>
  );
}

export default Avatar;