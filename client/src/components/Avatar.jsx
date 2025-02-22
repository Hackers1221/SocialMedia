function Avatar ({size, url}) {
  let width = 'w-12';
  if (size === 'lg') {
    width = 'w-20 md:w-32';
  }
  return (
    <div className={`${width}`}>
      <div className="rounded-full overflow-hidden hover:cursor-pointer">
        <img src={url} alt="" className="w-full"/>
      </div>
    </div>
  );
}

export default Avatar;