import { toast, Zoom } from 'react-toastify';

export const errorMessage = (message: string) => {
  return toast.error(message, {
    position: 'bottom-right',
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: Zoom,
  });
};
