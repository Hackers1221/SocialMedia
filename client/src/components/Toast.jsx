// components/Toast.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/Slices/toast.slice';

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((state) => state.toast);
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
        fixed bottom-5 left-1/2 transform -translate-x-1/2  flex items-center gap-2 z-50 px-4 py-2 rounded-lg text-black font-extralight shadow-md
        border-2 transition-all duration-300 ease-in-out transform
        ${type === 'success' ? 'bg-[#D0F0C0] border-green-800 text-green-800' : 'bg-red-200 border-red-700 text-red-700'}
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <i className={`fa-solid fa-circle-${type === 'success' ? 'check' : 'xmark'}`}></i>
      <h2>{message}</h2>
    </div>
  );
};

export default Toast;
