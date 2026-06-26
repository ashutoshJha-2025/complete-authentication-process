import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccess = (message) => {
    toast.success(message);
};

export const showError = (message) => {
    toast.error(message);
};

export const showInfo = (message) => {
    toast.info(message);
};

export const showWarning = (message) => {
    toast.warning(message);
};

const ToastMessageBox = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={1000}
            closeOnClick={true}
            pauseOnHover={false}
        />
    );
};

export { ToastMessageBox };