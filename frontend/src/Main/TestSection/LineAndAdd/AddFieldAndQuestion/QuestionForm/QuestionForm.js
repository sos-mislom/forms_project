import React, { useState } from 'react';

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
                    <li><button onClick={() => addQuestion('dropdown')}>Список</button></li>
                    <li><button onClick={() => addQuestion('short')}>Краткий ответ</button></li>
                    <li><button onClick={() => addQuestion('long')}>Развернутый ответ</button></li>
                    <li><button onClick={() => addQuestion('scale')}>Шкала</button></li>
                </ul>
            </section>
        </div>
    );
};

export default QuestionForm;
