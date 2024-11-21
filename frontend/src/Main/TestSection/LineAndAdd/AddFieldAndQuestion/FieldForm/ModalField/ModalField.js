import React from 'react';

const ModalField = ({ isOpen, onClose, onFileSelect, fileType  }) => {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onFileSelect(URL.createObjectURL(file));
            onClose();
        }
    };

    if (!isOpen) return null;
    

    return (
        <div className="modal-overlay-field">
            <div className="modal-field">
                <h2>Хотите добавить файл?</h2>
                <input type="file" accept={fileType} onChange={handleFileChange} />
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
};

export default ModalField;

