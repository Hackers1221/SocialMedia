function Avatar ({size, url}) {
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
  return (
    <div className={`${width}`}>
      <div className="rounded-full overflow-hidden hover:cursor-pointer bg-black">
        <img src={url} alt="" className="object-cover"/>
      </div>
    </div>
  );
}

export default Avatar;