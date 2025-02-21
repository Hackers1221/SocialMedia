function Avatar ({size, url}) {
  let width = 'w-12';
  if (size === 'lg') {
    width = 'w-24 md:w-36';
  }
  return (
    <div className={`${width}`}>
      <div className="rounded-full overflow-hidden">
        <img src={url} alt="" className="w-full"/>
      </div>
    </div>
  );
}

export default Avatar;