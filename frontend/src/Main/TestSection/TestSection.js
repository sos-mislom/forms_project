import React, { useState, useEffect } from "react";
import LineAndAdd from "./LineAndAdd/LineAndAdd";
import AddContainer from "./AddContainer/AddContainer";
import ModalPublic from "./ModalPublic/ModalPublic";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import './TestSection.css'

const TestSection = ({ uniqueLink }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [formLink, setFormLink] = useState('');
    const [isNewTest, setIsNewTest] = useState(true);
    const [threshold, setThreshold] = useState(80);
    const navigate = useNavigate();

    const defaultQuestion = [
        { id: uuidv4(), fieldTitle:"", descriptionField: "", type: "title"}
    ]

    const [questionsAndFields, setQuestionsAndFields] = useState(defaultQuestion);
    useEffect(() => {
        const fetchForm = async () => {
            if (uniqueLink) {
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
                        throw new Error('Ошибка при загрузке формы');
                    }
                    const data = await response.json();
                    setThreshold(data.threshold || 80);
                    const parsedQuestions = data.questions.map(question => ({
                        ...question,
                        score: question.score || '', 
                        correctAnswers: question.correctAnswers || '', 
                        correctAnswers: question.correctAnswers || '',
                        questionText: question.textQuestion || '',
                        fieldText: question.textField || '',
                        fieldDescription: question.descriptionField || '',
                        titleField: data.title || '',
                        url: question.url,
                        options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
                    }));
                    setQuestionsAndFields(parsedQuestions);
                    setIsNewTest(false);

                } catch (error) {
                    console.error('Ошибка при загрузке формы', error);
                }
            } else {
                localStorage.removeItem('testData');
            }
        };
        fetchForm();  
    }, [uniqueLink]);

    const addQuestionOrField = (element) => {
        const newQuestionOrField = { ...element, id: uuidv4() };
        setQuestionsAndFields([...questionsAndFields, newQuestionOrField]);
    };

    const onDeleteQuestionOrField = (id) => {
        setQuestionsAndFields(questionsAndFields.filter(q => q.id !== id));
    };

    const onUpdateQuestionOrField = (id, updatedQuestionOrField) => {
        setQuestionsAndFields(questionsAndFields.map(
            q => q.id === id ? { ...updatedQuestionOrField, id } : q,
        ));
    };

    const saveForm = async (isPublish) => {
            if (questionsAndFields.length < 1) {
                alert('Пожалуйста, добавьте поля или вопросы.');
                return;
            }
        
        try {
            const titleField = questionsAndFields.find(field => field.type === 'title');
            const requestBody = {
                title: titleField ? titleField.fieldTitle : 'Test',
                description: titleField ? titleField.descriptionField : 'SomeTest',
                questions: questionsAndFields,
                threshold: threshold,
                is_published: isPublish
            };
            console.log(requestBody);
            const token = localStorage.getItem('authToken');

            let testLink;

            if (isNewTest) {
                const response = await fetch(`https://uralitern-forms.ru/api/tests`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestBody)
                });
                if (!response.ok) {
                    const error = await response.text();
                    alert(error);
                } else {
                    const result = await response.json();
                    testLink = result.link.split('/').pop();
                    localStorage.setItem('testData', JSON.stringify({ link: result.link }));
                    setFormLink(result.link);
                    setModalOpen(true);
                    setIsNewTest(false);
                }
            } else {
                testLink = uniqueLink; 
                const response = await fetch(`https://uralitern-forms.ru/api/tests/${testLink}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(requestBody),
                });

                if (!response.ok) {
                    const error = await response.text();
                    alert(error);
                } else {
                    setFormLink(`https://uralitern-forms.ru/tests/${uniqueLink}`);
                    setModalOpen(true);
                }
            }
        } catch (error) {
            alert('Ошибка при сохранении формы', error);
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setQuestionsAndFields([]);
        setFormLink("");
        setIsNewTest(true);
        navigate("/my-forms");
    };

    return (
        <section className="test">
            <div className="test-block">
                <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{marginBottom:'20px'}}>
                        <label className="label-threshold" htmlFor="threshold">Установите порог прохождения на стажировку (в процентах):</label>
                        <input
                            type="number"
                            className="input-threshold"
                            id="threshold"
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            min="0"
                            max="100"
                            required
                        />
                    </div>
                    <AddContainer
                        questionsAndFields={questionsAndFields}
                        onAddQuestionOrField={addQuestionOrField}
                        onDeleteQuestionOrField={onDeleteQuestionOrField}
                        onUpdateQuestionOrField={onUpdateQuestionOrField}
                    />
                </div>
                <LineAndAdd
                    onAddQuestionOrField={addQuestionOrField}
                /> 
            </div>
            <div style={{ display: 'flex', margin: '30px 296px 32px 299px', justifyContent: 'space-between' }}>
                <button className="saved" type="button" onClick={() => saveForm(false)}>Сохранить</button>
                {!isNewTest && (
                    <button className="publiced" type="button" onClick={() => saveForm(true)}>Опубликовать</button>
                )}
            </div>
            <ModalPublic isOpen={isModalOpen} onClose={handleCloseModal} formLink={formLink} />
        </section>
    );
};

export default TestSection;
