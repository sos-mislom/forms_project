import React, { useState } from 'react';

const QuestionShort = ({ questionText, onAnswerChange, question_id }) => {
    const [answer, setAnswer] = useState('');

    const handleInputChange = (event) => {
        setAnswer(event.target.value);
        onAnswerChange(question_id, [event.target.value]);
    };

    return (
        <div className="question question-short">
            <h3 className='quest-title'>{questionText}</h3>
            <hr />
            <input 
                type="text" 
                className='input-short'
                value={answer} 
                onChange={handleInputChange} 
                placeholder="Ответ" 
            />
            <div style={{backgroundColor:"rgba(0, 31, 40, 0.6)", width:"242px", height:"1px", margin:"0px 409px 27.5px 29px"}}></div>
        </div>
    );
};

export default QuestionShort;