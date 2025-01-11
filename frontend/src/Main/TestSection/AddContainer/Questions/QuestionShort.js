import React, { useState, useEffect, useRef } from 'react';

const QuestionShort = ({ id, onDelete, onUpdate, questionText, initialCorrectAnswers, isUserAnswer, userAnswer,  currentScore }) => {
    const [placeholder, setPlaceholder] = useState('Вопрос');
    const [textQuestion, setTextQuestion] = useState(questionText || '');
    const [score, setScore] = useState(currentScore || 0);
    const [correctAnswers, setCorrectAnswers] = useState(initialCorrectAnswers || ['']);
    const textareaRef = useRef(null);

    useEffect(() => {
        adjustHeight();
    }, []);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleQuestionChange = (e) => {
        setTextQuestion(e.target.value);
        adjustHeight();
    };

    const handleScoreChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (value >= 0) {
            setScore(value);
        }
    };

    const handleCorrectAnswerChange = (index, value) => {
        const newAnswers = [...correctAnswers];
        newAnswers[index] = value;
        setCorrectAnswers(newAnswers);
    };

    const addCorrectAnswer = () => {
        setCorrectAnswers([...correctAnswers, '']);
    };

    const removeCorrectAnswer = (index) => {
        const newAnswers = correctAnswers.filter((_, i) => i !== index);
        setCorrectAnswers(newAnswers);
    };

    useEffect(() => { 
        onUpdate(id, { type: 'short', textQuestion, score, correctAnswers }); 
    }, [textQuestion, score, correctAnswers]);

    return (
        <div className="question question4">
            <div>
                <textarea
                    ref={textareaRef}
                    type="text"
                    className='question-title'
                    placeholder={placeholder}
                    onFocus={() => setPlaceholder('')}
                    onBlur={() => setPlaceholder('Вопрос')}
                    value={textQuestion}
                    rows={1}
                    onChange={handleQuestionChange}
                    disabled={isUserAnswer}
                />
                <hr />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        type="number"
                        value={score}
                        min="0"
                        onChange={handleScoreChange}
                        style={{ width: '45px', marginRight: '5px', marginLeft:'533px' }}
                        placeholder="0"
                        disabled={isUserAnswer}
                    />
                    <span style={{fontSize:'16px', fontWeight:'300', color:'rgba(0, 31, 40, 0.9)' }}>балл</span>
                </div>
                <input 
                    type="text" 
                    className='question-answer' 
                    value="Ответ"
                    disabled
                />
                <hr className='answer-line' />
                <div>
                    <span style={{marginLeft: '30px', fontSize:'20px', fontWeight:'400'}}>Правильные ответы:</span>
                    <div style={{marginTop: '20px'}}>
                        {correctAnswers.map((answer, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px', marginLeft: '30px' }}>
                                <input
                                    type="text"
                                    value={answer}
                                    className='input-answer-short'
                                    onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                                    placeholder={`Правильный ответ`}
                                    disabled={isUserAnswer}
                                />
                                {!isUserAnswer && <button onClick={() => removeCorrectAnswer(index)} style={{ marginLeft: '30px' , marginBottom:'7px'}}>
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L13 13M1 13L13 1" stroke="#001F28" strokeOpacity="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>}
                            </div>
                        ))}
                    </div>
                    {!isUserAnswer && <button onClick={addCorrectAnswer} style={{ marginLeft:'30px', fontSize:'16px', fontWeight:'400', color:'rgba(0, 31, 40, 0.6)'}}>Добавить правильный ответ</button>}
                </div>
            </div>
            {!isUserAnswer && <button className='delete-question' onClick={() => onDelete(id)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="#001F28" strokeOpacity="0.9" strokeWidth="1.5"/>
                    <path d="M14 17L14 11" stroke="#001F28" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 17L10 11" stroke="#001F28" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="#001F28" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>}
            {isUserAnswer && 
                <div style={{margin: '20px 10px 20px 30px'}}> 
                    <span style={{fontSize:'20px', fontWeight:'500'}}>Ответ пользователя:</span>
                    {Array.isArray(userAnswer) ? ( 
                        <ul> 
                            {userAnswer.map((answer) => ( 
                                <li style={{marginBottom:'10px', listStyle:'none', padding:'0px', fontSize:'16px', fontWeight:'300'}}>{answer}</li> 
                            ))} 
                        </ul> 
                    ) : ( 
                        <span>{userAnswer}</span> 
                    )} 
                </div>}
        </div>
    );
};

export default QuestionShort;
