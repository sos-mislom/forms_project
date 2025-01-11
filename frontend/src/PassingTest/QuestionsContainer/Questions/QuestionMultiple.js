import React, { useState, useEffect } from 'react';

const QuestionMultiple = ({ questionText, options, onAnswerChange, question_id }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        onAnswerChange(question_id, selectedOptions); 
    }, []); 

    const handleOptionChange = (event) => {
        const { value } = event.target;

        setSelectedOptions(prevSelected => {
            const newSelectedOptions = prevSelected.includes(value)
                ? prevSelected.filter(option => option !== value)
                : [...prevSelected, value];

            onAnswerChange(question_id, newSelectedOptions);
            return newSelectedOptions;
        });
    };

    return (
        <div className="question question-multiple">
            <h3 className='quest-title'>{questionText}</h3>
            <hr />
            <div style={{ display: 'flex', flexDirection: "column", margin: "10px auto 15px 15px" }}>
                {options.map((option, index) => (
                    <div className="option-container" key={index} style={{ display: 'flex' }}>
                        <input
                            className="option-checkbox"
                            type="checkbox"
                            name={`question-${question_id}`}
                            value={option}
                            checked={selectedOptions.includes(option)}
                            onChange={handleOptionChange}
                        />
                        <label className='label-option'>{option}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionMultiple;
