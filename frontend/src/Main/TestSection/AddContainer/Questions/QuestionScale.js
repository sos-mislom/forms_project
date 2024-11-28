import React, {useState, useEffect, useRef } from 'react';

const QuestionScale = ({id, onDelete, onUpdate, questionText}) => {
    const [placeholder, setPlaceholder] = useState('Вопрос');
    const [textQuestion, setTextQuestion] = useState('');
    const [ratingFrom, setRatingFrom] = useState(0);
    const [ratingTo, setRatingTo] = useState(10);
    const textareaRef = useRef(null);
    
    useEffect(() => { 
        onUpdate(id, { type: 'scale', textQuestion, ratingFrom, ratingTo }); 
    }, [textQuestion, ratingFrom, ratingTo]);

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
        setTextQuestion(e.target.value);
        adjustHeight(); 
    };

    return (
        <div className="question question6">
            <div>
                <textarea
                    ref={textareaRef}
                    type="text" 
                    className='question-title' 
                    placeholder={placeholder} 
                    onFocus={() => setPlaceholder('')} 
                    onBlur={() => setPlaceholder('Вопрос')}
                    value={questionText} 
                    rows={1}
                    onChange={(e) => handleChange(e)}
                />
                <hr />
                <div className='scale'>
                    <label>Оценка от 
                        <select 
                            className="rating-select" 
                            style={{ width: '40px' }}
                            value={ratingFrom} 
                            onChange={(e) => setRatingFrom(Number(e.target.value))}
                            >
                            <option value="0">0</option>
                            <option value="1">1</option>
                        </select>
                    </label>   
                    <span> до </span>
                    <label>
                        <select 
                            className="rating-select" 
                            style={{ width: '40px' }}
                            value={ratingTo}
                            onChange={(e) => setRatingTo(Number(e.target.value))}
                            >
                            {[...Array(9)].map((_, index) => (
                                <option key={index + 2} value={index + 2}>{index + 2}</option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <button className='delete-question' onClick={() => onDelete(id)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5"/>
                    <path d="M14 17L14 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 17L10 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    );
};

export default QuestionScale;