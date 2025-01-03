import React, { useEffect, useState } from "react";

const PopUpComponent = ({ type, message, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
          
        <div className={`popup-notification ${type}`}>
            {message}
        </div>
    );
};


export default PopUpComponent;

