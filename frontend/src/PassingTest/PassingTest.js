import React, { useState, useEffect } from "react";
import { json, useNavigate, useParams } from "react-router-dom";
import QuestionsContainer from "./QuestionsContainer/QuestionsContainer";
import ModalResult from "./ModalResult/ModalResult";

const PassingTest = () => {
    const { uniqueLink } = useParams();
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [maxScore, setMaxScore] = useState(0);
    const [resultMessage, setResultMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTestData = async () => {
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
                    throw new Error('Ошибка при загрузке теста');
                }
                const data = await response.json();
                const questions = data.questions.map(question => ({
                    ...question,
                    questionText: question.textQuestion || '',
                    ratingFrom: question.ratingFrom || '',
                    ratingTo: question.ratingTo || '',
                    fieldText: question.textField || '',
                    fieldDescription: question.descriptionField || '',
                    titleField: data.title || '',
                    url: question.url,
                    options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
                }));
                setParsedQuestions(questions);
            } catch (error) {
                console.error('Ошибка при загрузке теста', error);
            }
        };
        fetchTestData();
    }, [uniqueLink]);

    const handleAnswerChange = (question_id, answer) => {
        setAnswers((prevAnswers) => {
            const existingAnswerIndex = prevAnswers.findIndex(answerObj => answerObj.question_id === question_id);
            if (existingAnswerIndex > -1) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[existingAnswerIndex] = { question_id, answer };
                console.log(answers);
                return updatedAnswers;
            } else {
                return [...prevAnswers, { question_id, answer }];
            }
        });
    };

    const handleSubmit = async () => {
        try {
            console.log({ answers: answers });
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ answers })
            });
    
            if (!response.ok) {
                throw new Error('Ошибка при отправке ответов');
            }
    
            const resultResponse = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}/result`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            if (!resultResponse.ok) {
                throw new Error('Ошибка при получении результата теста');
            }
    
            const resultData = await resultResponse.json();
            const proc = (resultData.total_score / resultData.max_score) * 100;
            const result = resultData.is_passed ? 'Вы приняты на стажировку! С вами свяжется работодатель.' : 'Вы не приняты на стажировку.'; 
            setTotalScore(resultData.total_score);
            setMaxScore(resultData.max_score);
            setResultMessage(`Ваш результат: ${proc.toFixed(2)}%, ${result}`); 
            setModalOpen(true);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    const closeModal = () => {
        setModalOpen(false);
        navigate('/passed-tests')
    };

    return (
        <div className="test-take">
            <div className="test-passing">
                <QuestionsContainer 
                    questions={parsedQuestions} 
                    onAnswerChange={handleAnswerChange}
                />
            </div>
            <div style={{margin: "0px 351px 0px 353px"}}>
                <button className="saved-form" type="button" onClick={handleSubmit}>
                    Отправить
                </button>
            </div>
            <ModalResult
                isOpen={modalOpen}
                onClose={closeModal}
                totalScore={totalScore}
                maxScore={maxScore}
                resultMessage={resultMessage} 
            />
        </div>
    );
};

export default PassingTest;
