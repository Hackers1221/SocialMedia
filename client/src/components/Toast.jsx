// components/Toast.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/Slices/toast.slice';

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type, image, visible } = useSelector((state) => state.toast);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true); // trigger entrance animation

      const timer = setTimeout(() => {
        setShow(false); // trigger exit animation
        setTimeout(() => dispatch(hideToast()), 300); // remove from Redux after animation
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  if (!visible && !show) return null; // wait for exit animation to finish

  return (
    <div
      className={`
        fixed bottom-5 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 z-[9999] px-4 py-2 rounded-lg text-black font-extralight shadow-md
        border-2 transition-all duration-300 ease-in-out transform w-[min(max-content,80%)] md:w-max
        ${type !== 'error' ? 'bg-[#AFEEEE] border-[var(--buttons)]' : 'bg-red-200 border-red-700 text-red-700'}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {(type == "success" || type == "error") && <i className={`fa-solid fa-circle-${type === 'success' ? 'check' : 'xmark'} ${type !== 'error' ? 'text-[var(--buttons)]' : 'text-red-700'}`}></i>}
      {type == "save" && <img src={image} className='w-8 h-8'></img>}
      {type == "private" && <i className="fa-solid fa-lock text-[var(--buttons)]"></i>}
      {type == "public" && <i className="fa-solid fa-lock-open text-[var(--buttons)]"></i>}
      <h2>{message}</h2>
    </div>
  );
};

export default Toast;
