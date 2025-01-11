import React from "react";
import "./ModalResult.css";

const ModalResult = ({ isOpen, onClose, resultMessage}) =>{
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Ответы отправлены!</h2>
                <p>{resultMessage}</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};
export default ModalResult;