import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Answers.css';

const Answers = ({ uniqueLink }) => {
    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}/result`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке формы ${response.error}`);
                }
                const data = await response.json();
                setAnswers(data);
            } catch (error) {
                console.error('Ошибка при загрузке ответов', error);
            }
        };

        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке формы ${response.error}`);
                }
                const data = await response.json();
                const parsedQuestions = data.questions.map(question => ({
                    ...question,
                    score: question.score || '', 
                    correctAnswers: question.correctAnswers || '', 
                    questionText: question.textQuestion || '',
                    fieldText: question.textField || '',
                    fieldDescription: question.descriptionField || '',
                    titleField: data.title || '',
                    url: question.url,
                    options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
                }));
                setQuestions(parsedQuestions);
            } catch (error) {
                console.error('Ошибка при загрузке вопросов', error);
            }
        };

        fetchAnswers();
        fetchQuestions();
    }, [uniqueLink]);

    return (
        <div className="answers">
            <table className="answers-table">
                <thead>
                    <tr>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>№</th>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>Пользователь</th>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>Дата прохождения</th>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>Результат</th>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>Прошел на стажировку</th>
                        <th style={{padding:'35px 0px 20px 10px', fontWeight:'600'}}>Ответы</th>
                    </tr>
                </thead>
                <tbody>
                    {answers.map((answer, index) => (
                        <tr key={answer.user_id}>
                            <td style={{padding:'20px 0px 20px 20px', fontWeight:'400'}}>{index + 1}</td>
                            <td style={{padding:'20px 0px 20px 20px', fontWeight:'400'}}>{answer.username}</td>
                            <td style={{padding:'20px 0px 20px 20px', fontWeight:'400'}}>{new Date(answer.timestamp).toLocaleString()}</td>
                            <td style={{padding:'20px 0px 20px 25px', fontWeight:'400'}}>
                                {`${(answer.total_score / answer.max_score * 100).toFixed(2)}%`}
                            </td>
                            <td style={{padding:'20px 0px 20px 120px', fontWeight:'400'}}>
                                {answer.is_passed ? `Да` : 'Нет'}
                            </td>
                            <td style={{padding:'20px 0px 20px 20px', fontWeight:'400'}}>
                                <Link to={`/answers/${answer.user_id}`} state={{ questions, answers: answer.answers }}>Ответы</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Answers;
