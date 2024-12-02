import React, {useState} from "react";
import LineAndAdd from "../Main/TestSection/LineAndAdd/LineAndAdd";
import AddContainer from "../Main/TestSection/AddContainer/AddContainer";
import ModalPublic from "../Main/TestSection/ModalPublic/ModalPublic";
import {v4 as uuidv4} from 'uuid';

const TestSample1 = () => {
    const defaultQuestions = [
        { id: uuidv4(), fieldTitle:"", fieldDescription: "Мы рады, что вы решили принять участие в нашем отборе на стажировку. Данный тест поможет нам лучше понять ваши навыки, знания и личные качества.", type: "title"}, 
        { id: uuidv4(), type: "picture", url:"https://psv4.userapi.com/s/v1/d/gD3zL8d2FSopgfV54L8bj1C5vcFv1XJd-cO2VQ9N7XdFOGurN9qK_6KpaPu7e1eDPeNovigkEIfIpeZZm13WQg8m4bsuebejslWPi1vM2TQ21snRbG3Rkg/abstract-green-background_2.jpg"}, 
        { id: uuidv4(), fieldText:"Процесс прохождения тестирования: \n     Введите ваше контактные данные. Эти данные необходимы для связи с вами в будущем.\n     Укажите ваше образование и предыдущий опыт работы. Это поможет нам понять ваш профессиональный путь и уровень подготовки.\n     Отметьте необходимую информацию о прохождении стажировки ", type: "text"},
        { id: uuidv4(), questionText: "ФИО", type: "short" },
        { id: uuidv4(), questionText: "Электронная почта", type: "short" },
        { id: uuidv4(), questionText: "Номер телефона", type: "short" },
        { id: uuidv4(), questionText: "Образование", type: "single" , options:["Среднее общее", "Среднее профессиональное", "Высшее", "Неоконченное высшее"]},
        { id: uuidv4(), questionText: "Опыт работы", type: "long" },
        { id: uuidv4(), questionText: "Ваша цель", type: "single" , options:["Стажировки в компании", "Прохождение практики от ВУЗа"]},
        { id: uuidv4(), questionText: "Желаемые даты прохождения стажировки/практики", type: "single" , options:["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"]},
        { id: uuidv4(), questionText: "Желаемая вакансия", type: "single" , options:["Вариант 1", "Вариант 2", "Вариант 3", "Вариант 4"]}
    ];

    const [questionsAndFields, setQuestionsAndFields] = useState(defaultQuestions);
    const [isModalOpen, setModalOpen] = useState(false);
    const [formLink, setFormLink] = useState('');

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
            const response = await fetch('http://92.118.115.96:8000/forms/', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify({ questionsAndFields }), 
            });

            const result = await response.json(); 
            setFormLink(result.formLink);
            setModalOpen(true);
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
                <AddContainer 
                    questionsAndFields={ questionsAndFields } 
                    onAddQuestionOrField={addQuestionOrField} 
                    onDeleteQuestionOrField={onDeleteQuestionOrField} 
                    onUpdateQuestionOrField={onUpdateQuestionOrField} 
                />
                <LineAndAdd 
                    onAddQuestionOrField={addQuestionOrField}
                />
            </div>
            <button className="publiced" type="button" onClick={saveForm}>Опубликовать</button>
            <ModalPublic isOpen={isModalOpen} onClose={handleCloseModal}/>
        </section>
    );
};
export default TestSample1;
