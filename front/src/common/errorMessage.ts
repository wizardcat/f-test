import { Bounce, toast } from 'react-toastify';

export const errorMessage = (message: string) => {
  return toast.error(message, {
    position: 'bottom-center',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Bounce,
  });
};
