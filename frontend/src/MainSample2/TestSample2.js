import React, {useState} from "react";
import LineAndAdd from "../Main/TestSection/LineAndAdd/LineAndAdd";
import AddContainer from "../Main/TestSection/AddContainer/AddContainer";
import ModalPublic from "../Main/TestSection/ModalPublic/ModalPublic";
import {v4 as uuidv4} from 'uuid';
import { useNavigate } from "react-router-dom";

const TestSample1 = () => {
    const defaultQuestions = [
        { id: uuidv4(), fieldTitle:"", descriptionField: "Мы рады, что вы решили принять участие в нашем отборе на стажировку. Данный тест поможет нам лучше понять ваши навыки, знания и личные качества.", type: "title"}, 
        { id: uuidv4(), type: "picture", url:"https://proza.ru/pics/2021/07/16/912.jpg"}, 
        { id: uuidv4(), textField:"Ответьте на все тестовые вопросы. Обратите внимание, что некоторые вопросы могут иметь несколько вариантов ответов, а другие требуют развернутого ответа. Пожалуйста, старайтесь давать полные и четкие ответы.", type:"text"}, 
        { id: uuidv4(), textQuestion: "Какие из следующих навыков у вас развиты на базовом уровне?", options:['Microsoft Office (Word, Excel, PowerPoint)', 'Основы программирования (Python, Java, C++)', 'Управление проектами (Trello, Asana, JIRA)', 'Ведение переписки по электронной почте', 'Другие'], type:"multiple"},
        { id: uuidv4(), textQuestion: "Какие из этих методов вы используете для организации своего рабочего времени?", options:['Составление списка дел', 'Использование календаря или приложений для планирования', 'Постановка приоритетов (важное и срочное)', 'Тайм-менеджмент (метод Помодоро, блоки времени)', 'Не использую специальные методы'], type:"multiple" },
        { id: uuidv4(), textQuestion: "Как вы относитесь к выполнению рутинных или однообразных задач?", options:['Я готов выполнять такие задачи, если это нужно для достижения целей компании', 'Мне сложно заниматься однообразной работой, но я справляюсь', 'Я избегаю однообразной работы, предпочитаю разнообразие'], type:"single"}, 
        { id: uuidv4(), textQuestion: "Как вы предпочитаете получать обратную связь о своей работе?", options:['Личное общение (в лицо или по видеосвязи)', 'Электронная почта', 'Сообщение в мессенджере', 'Прямое указание на улучшения в ходе работы'], type:"single"}, 
        {id: uuidv4(), textQuestion: "Какие из следующих ситуаций вы считаете наиболее стрессовыми?", options:['Работа с жесткими сроками', 'Работы, которые требуют высокой точности', 'Многозадачность и работа с несколькими проектами одновременно', 'Неопределенность в заданиях или инструкциях', 'Не считаю работу в стрессовых условиях сложной'], type:"multiple"},
        {id: uuidv4(), textQuestion: "Какие из этих характеристик вы цените в коллективе? ", options:['Открытость и честность', 'Гибкость в работе', 'Поддержка и помощь коллег', 'Строгие правила и процедуры', 'Дружелюбие и неформальная атмосфера'], type:"multiple"}
    ]; 

    const [questionsAndFields, setQuestionsAndFields] = useState(defaultQuestions);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formLink, setFormLink] = useState('');
    const [threshold, setThreshold] = useState(80);
    
    const navigate = useNavigate();

    const addQuestionOrField = (element) =>{
        const newQuestionOrField = {...element, id: uuidv4() };
        setQuestionsAndFields([...questionsAndFields, newQuestionOrField]);
    };

    const onDeleteQuestionOrField = (id) => {
        setQuestionsAndFields(questionsAndFields.filter((questionsAndFields) => questionsAndFields.id !== id));
    };

    const onUpdateQuestionOrField = (id, updatedQuestionOrField) => {
        setQuestionsAndFields(questionsAndFields.map(
            q => q.id === id ? {...updatedQuestionOrField, id} : q
        ));
    };
    
    const saveForm = async () => {
        try{
            if (questionsAndFields.length < 1){
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
            else{
                const result = await response.json(); 
                setFormLink(result.link);
                setModalOpen(true);
                navigate("/my-forms")
            }
        } catch(error){
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
            <button className="save" type="button" onClick={saveForm}>Сохранить</button>
            <ModalPublic isOpen={isModalOpen} onClose={handleCloseModal} formLink={formLink}/>
        </section>
    );
};
export default TestSample1;
