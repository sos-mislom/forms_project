import React, {useState, useEffect} from "react";

const FieldTitle = ({id, onUpdateField}) => {
    const [placeholderTitle, setPlaceholderTitle] = useState('Название');
    const [fieldTitle, setFieldTitle] = useState('');
    const [placeholderDescription, setPlaceholderDescription] = useState('Описание');
    const [fieldDescription, setFieldDescription] = useState('');

    useEffect(() => { 
        onUpdateField(id, { type: 'title', fieldTitle, fieldDescription}); 
    }, [fieldTitle, fieldDescription]);

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
                className="textarea-field" 
                placeholder= {placeholderDescription }
                onFocus={() => setPlaceholderDescription('')} 
                onBlur={() => setPlaceholderDescription('Описание')}
                value={fieldDescription} 
                onChange={(e) => setFieldDescription(e.target.value)}
                rows={1}
                style={{ overflow: 'hidden' }}
            />
        </div>
    );
};

export default FieldTitle;