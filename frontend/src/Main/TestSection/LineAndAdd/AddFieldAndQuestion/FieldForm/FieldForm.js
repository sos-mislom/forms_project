import React, {useState} from 'react';
import ModalField from './ModalField/ModalField';
 
const FieldForm = ({onAddField}) => {
    const [fields, setFields] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentFileType, setCurrentFileType] = useState('');

    const addField = (type) => {
        if (type === 'picture') {
            setCurrentFileType('image/*');
            setModalOpen(true); 
        } else if(type === 'video'){
            setCurrentFileType('video/*');
            setModalOpen(true);
        } else {
            const newField = {type, id: fields.length + 1};
            setFields([...fields, newField])
            onAddField(newField);
        }
    };

    const handleFileSelect = (fileUrl) => {
        const newField = { type: currentFileType === 'image/*' ? 'picture' : 'video', id: fields.length + 1, url: fileUrl };
        setFields([...fields, newField]);
        onAddField(newField);
    };

    return (
        <div className="add-field">
            <h2>Добавить поле</h2>
            <ul>
                <li><button onClick={() => addField('picture')}>Изображение</button></li>
                <li><button onClick={() => addField('video')}>Видео</button></li>
                <li><button onClick={() => addField('text')}>Текст</button></li>
                <li><button onClick={() => addField('title')}>Название</button></li>
            </ul>
            <ModalField isOpen={isModalOpen} onClose={() => setModalOpen(false)} onFileSelect={handleFileSelect} fileType={currentFileType}/>
        </div>
    );
};

export default FieldForm;