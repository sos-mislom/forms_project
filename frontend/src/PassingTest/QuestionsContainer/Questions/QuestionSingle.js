import React, { useState } from 'react';

const QuestionSingle = ({ questionText, options, onAnswerChange, question_id }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        onAnswerChange(question_id, [event.target.value]);
    };

    return (
        <div className="question question-single">
            <div>
                <h3 className='quest-title'>{questionText}</h3>
                <hr />
                <div style={{display:'flex', flexDirection:"column", margin:"10px auto 15px 15px"}}>
                    {options.map((option, index) => (
                        <div className="option-container" key={index}>
                            <input 
                                className="option-radioButton"
                                type="radio"
                                name={`question-${question_id}`} 
                                value={option}
                                checked={selectedOption === option}
                                onChange={handleOptionChange}
                            />
                            <label className='label-option'>{option}</label>
                        </div>
                    ))}
                </div>      
            </div>
        </div>
    );
};

export default QuestionSingle;
