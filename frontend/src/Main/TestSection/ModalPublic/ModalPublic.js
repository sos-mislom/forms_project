import React from "react";

const ModalPublic = ({ isOpen, onClose}) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText('https://uralintern/forms/document/d/12flHLHvd-Jmhhm.ru')
            .then(() => {
                alert('Ссылка скопирована в буфер обмена!');
            })
            .catch(err => {
                console.error('Ошибка при копировании ссылки', err);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay-public">
            <div className="modal-public">
                <h2>Форма успешно создана</h2>
                <p>Вы можете поделиться формой по ссылке:</p>
                <div className="link-container">
                    <span className="link">https://uralintern/forms/document/d/12flHLHvd-Jmhhm.ru</span>
                    <button onClick={copyToClipboard}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.375 21.625H4.74999C2.67893 21.625 1 19.946 1 17.875V4.74999C1 2.67893 2.67893 1 4.74999 1H17.875C19.9461 1 21.625 2.67893 21.625 4.74999V10.375M10.375 21.625V27.25C10.375 29.321 12.054 31 14.125 31H27.25C29.3211 31 31 29.321 31 27.25V14.125C31 12.0539 29.3211 10.375 27.25 10.375H21.625M10.375 21.625V12.375C10.375 11.2704 11.2705 10.375 12.375 10.375H21.625" stroke="#001F28" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <button className="close-form" onClick={onClose}>Продолжить</button>
            </div>
        </div>
    );
};

export default ModalPublic;