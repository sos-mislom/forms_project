import React, {useState, useEffect, useRef} from "react";

const FieldTitle = ({id, onUpdate, fieldDescription, titleField}) => {
    const [placeholderTitle, setPlaceholderTitle] = useState('Название');
    const [fieldTitle, setFieldTitle] = useState(titleField || '');
    const [placeholderDescription, setPlaceholderDescription] = useState('Описание');
    const [descriptionField, setDescriptionField] = useState(fieldDescription || '');
    const textareaRef = useRef(null);

    useEffect(() => { 
        onUpdate(id, { type: 'title', fieldTitle, descriptionField}); 
    }, [fieldTitle, descriptionField]);

    useEffect(() => {
        adjustHeight(); 
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; 
            textareaRef.current.style.height =  `${textareaRef.current.scrollHeight}px`
        }
    };

    const handleChange = (e) => {
        setDescriptionField(e.target.value);
        adjustHeight(); 
    };

    return (
        <div className="field-title">
            <input 
                type="text" 
                className="input-field" 
                placeholder= {placeholderTitle }
                onFocus={() => setPlaceholderTitle('')} 
                onBlur={() => setPlaceholderTitle('Название')}
                value={fieldTitle} 
                onChange={(e) => setFieldTitle(e.target.value)}
            />
            <hr className="divider" />
            <textarea 
                ref={textareaRef}
                className="textarea-field" 
                placeholder= {placeholderDescription }
                onFocus={() => setPlaceholderDescription('')} 
                onBlur={() => setPlaceholderDescription('Описание')}
                value={descriptionField} 
                onChange={(e) => handleChange(e)}
                style={{ overflow: 'hidden', recize:'none'   }}
            />
        </div>
    );
};

export default FieldTitle;