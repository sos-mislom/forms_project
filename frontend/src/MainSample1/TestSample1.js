import React, { useState } from "react";
import LineAndAdd from "../Main/TestSection/LineAndAdd/LineAndAdd";
import AddContainer from "../Main/TestSection/AddContainer/AddContainer";
import ModalPublic from "../Main/TestSection/ModalPublic/ModalPublic";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

const TestSample1 = () => {
    const defaultQuestions = [
        { id: uuidv4(), fieldTitle: "", descriptionField: "Мы рады, что вы решили принять участие в нашем отборе на стажировку. Данный тест поможет нам лучше понять ваши навыки, знания и личные качества.", type: "title" },
        { id: uuidv4(), type: "picture", url: "https://psv4.userapi.com/s/v1/d/gD3zL8d2FSopgfV54L8bj1C5vcFv1XJd-cO2VQ9N7XdFOGurN9qK_6KpaPu7e1eDPeNovigkEIfIpeZZm13WQg8m4bsuebejslWPi1vM2TQ21snRbG3Rkg/abstract-green-background_2.jpg" },
        { id: uuidv4(), textQuestion: "Как вы предпочитаете учиться новому?", options: ["Чтение инструкций и учебников", "Онлайн-курсы и видеоуроки", "Учебные группы и общение с коллегами", "Самостоятельное исследование и пробные действия"], type: "single" },
        { id: uuidv4(), textQuestion: "Какие из следующих черт личности вам ближе?", type: "multiple", options: ["Инициативность", "Открытость к новым идеям", "Способность работать в команде", "Ответственность и дисциплинированность", "Предпочтение работать индивидуально"] },
        { id: uuidv4(), textQuestion: "Какую роль вы чаще всего занимаете в группе?", type: "single", options: ["Лидер, который организует работу", "Исполнитель, который выполняет задачи по указаниям", "Идеолог, который генерирует идеи", "Поддерживающий, который помогает другим"] },
        { id: uuidv4(), textQuestion: "Что для вас важнее при решении задачи?", type: "single", options: ["Найти самое быстрое решение, даже если оно не идеально", "Найти оптимальное решение, которое будет работать в долгосрочной перспективе", "Решить задачу, получив подтверждение от коллег или наставников", "Решить задачу самостоятельно, даже если решение не будет идеальным"] }
    ];

    const [questionsAndFields, setQuestionsAndFields] = useState(defaultQuestions);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formLink, setFormLink] = useState('');
    const [threshold, setThreshold] = useState(80);

    const navigate = useNavigate();

    const addQuestionOrField = (element) => {
        const newQuestionOrField = { ...element, id: uuidv4() };
        setQuestionsAndFields([...questionsAndFields, newQuestionOrField]);
    };

    const onDeleteQuestionOrField = (id) => {
        setQuestionsAndFields(questionsAndFields.filter((questionsAndFields) => questionsAndFields.id !== id));
    };

    const onUpdateQuestionOrField = (id, updatedQuestionOrField) => {
        setQuestionsAndFields(questionsAndFields.map(
            q => q.id === id ? { ...updatedQuestionOrField, id } : q
        ));
    };

    const saveForm = async () => {
        try {
            if (questionsAndFields.length < 1) {
                alert('Пожалуйста, добавьте поля или вопросы.');
                return;
            }

            const titleField = questionsAndFields.find(field => field.type === 'title');
            const requestBody = {
                title: titleField ? titleField.fieldTitle : 'Test',
                description: titleField ? titleField.descriptionField : 'SomeTest',
                questions: questionsAndFields,
                threshold: threshold,
                is_published: 'False'
            };
            const token = localStorage.getItem('authToken');
            const response = await fetch('https://uralitern-forms.ru/api/tests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                const error = await response.text();
                console.error(error)
            }
            else {
                const result = await response.json();
                setFormLink(result.link);
                setModalOpen(true);
                navigate("/my-forms")
            }
        } catch (error) {
            console.error('Ошибка при сохранении формы', error);
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setQuestionsAndFields([]);
        setFormLink("");
    };

    return (
        <section className="test">
            <div className="test-block">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '20px' }}>
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
            <button className="save" type="button" onClick={saveForm}>Сохранить</button>
            <ModalPublic isOpen={isModalOpen} onClose={handleCloseModal} formLink={formLink} />
        </section>
    );
};

export default TestSample1;