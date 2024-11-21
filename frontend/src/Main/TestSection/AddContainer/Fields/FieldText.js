import React, {useState, useEffect} from "react";

const FieldText = ({id, onUpdateField}) => {
    const [placeholderText, setPlaceholderText] = useState('Текст');
    const [fieldText, setFieldText] = useState('');

    useEffect(() => { 
        onUpdateField(id, { type: 'text', fieldText }); 
    }, [fieldText]);

    return (
        <div className="field-text">
            <textarea 
                placeholder= {placeholderText }
                onFocus={() => setPlaceholderText('')} 
                onBlur={() => setPlaceholderText('Текст')}
                value={fieldText} 
                onChange={(e) => setFieldText(e.target.value)}
                rows={1}
                style={{ overflow: 'hidden' }}
            />
            <hr />
        </div>
    );
};

export default FieldText;