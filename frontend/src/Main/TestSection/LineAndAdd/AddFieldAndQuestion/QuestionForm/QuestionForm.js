import React, { useState } from 'react';
import './QuestionForm.css'

const QuestionForm = ({onAddQuestion}) => {
    const [questions, setQuestions] = useState([]);

    const addQuestion = (type) => {
        const newQuestion = { type, id: questions.length + 1 };
        setQuestions([...questions, newQuestion]);
        onAddQuestion(newQuestion);
    };

    return (
        <div className="add-question">
            <h2>Добавить вопрос</h2>
            <section className="answers">
                <ul>
                    <li><button onClick={() => addQuestion('single')}>Один ответ</button></li>
                    <li><button onClick={() => addQuestion('multiple')}>Несколько ответов</button></li>
                    <li><button onClick={() => addQuestion('short')}>Краткий ответ</button></li>
                </ul>
            </section>
        </div>
    );
};

export default QuestionForm;
