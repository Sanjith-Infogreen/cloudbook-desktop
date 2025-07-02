"use client";

// components/ToastMessage.jsx
import { useState, useEffect } from "react";

type ToastMessageProps = {
    message: string;
    type?: "info" | "success" | "error" | "warning";
    duration?: number;
    onClose?: () => void;
};

const ToastMessage: React.FC<ToastMessageProps> = ({
    message,
    type = "info",
    duration = 3000,
    onClose,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose(); // Call the parent's onClose to clear the message state
                }
            }, duration);

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [message, duration, onClose]);

    if (!isVisible) return null;

    
    let Color = "text-[#0066CC]"; 
    if (type === "success") {
        Color = "text-[#009333]";
    } else if (type === "error") {
        Color = "text-[#CC0000]";
    } else if (type === "warning") {
        Color = "text-[#E6A100]";
    }

      
    let bgColor = "bg-[#0066CC]"; 
    if (type === "success") {
        bgColor = "bg-[#009333]";
    } else if (type === "error") {
        bgColor = "bg-[#CC0000]";
    } else if (type === "warning") {
        bgColor = "bg-[#E6A100]";
    }

     let alertType = "Info"; 
    if (type === "success") {
        alertType = "Success";
    } else if (type === "error") {
        alertType = "Error";
    } else if (type === "warning") {
        alertType = "Warning";
    }

    return (
        <div
            className={`fixed top-14 right-3 p-3 rounded-md shadow-lg bg-white  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } z-50 w-[280px]`}
            role="alert"
        >
            <div className="flex items-start relative">
                {/* Pipe-like left bar */}
                <div className={`w-2 h-full ${bgColor} absolute left-0 top-0 bottom-0 rounded-md`}></div>

                {/* Content Wrapper */}
                <div className="ml-6.5  flex-1">
                    <div className="flex justify-between ">
                        <h4 className={`${Color} font-semibold text-[17px]`}>{alertType} !</h4>
                        <button
                            onClick={onClose}
                            className="text-gray-700 cursor-pointer  items-center hover:text-black text-lg leading-none"
                        >
                            <i className="ri-close-line"></i>
                        </button>

                    </div>

                    <p className="text-gray-600 text-sm  leading-snug pr-7">{message}</p>
                </div>
            </div>
        </div>

    );
};

export default ToastMessage;
