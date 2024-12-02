import React, {useState} from "react";
import LineAndAdd from "../Main/TestSection/LineAndAdd/LineAndAdd";
import AddContainer from "../Main/TestSection/AddContainer/AddContainer";
import ModalPublic from "../Main/TestSection/ModalPublic/ModalPublic";
import {v4 as uuidv4} from 'uuid';

const TestSample1 = () => {
    const defaultQuestions = [
        { id: uuidv4(), fieldTitle:"", fieldDescription: "Мы рады, что вы решили принять участие в нашем отборе на стажировку. Данный тест поможет нам лучше понять ваши навыки, знания и личные качества.", type: "title"}, 
        { id: uuidv4(), type: "picture", url:"https://s3-alpha-sig.figma.com/img/4712/5c08/5e27e50ae79dd566524bf5f3d3592e2e?Expires=1733097600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=EhOdCCYCLNkZhncqfmDKGqTv3kr7Q0dsAi4P6oOkCVaoZvDLH1kVrI7HVkyB9CxIoG5RvEzl5PT6wW7qqHLWakTnyuLaCuLfv5-jom5zIhw58G3eQTjvr6XDgGglKAiaYWK8Tq~WHnudTaBOYBYtvspc8d~I2PM69aub0zYYrSfq4RWwBVIJbnylxHmQmuxSZWJQ-zWyvkrDVtM08IVpDNVhxN-nZEqnQN7RlJAVof0SGP-tEwsDtBWvrRYjvJch4XwZ5x5Di2B7OufF1Ip9lvhXZbI6rejM4fHN99ecFzjBxuB4zg9mN50pTR-dKTLwhoc434c5~CMnhTr0O37cAA__"}, 
        { id: uuidv4(), fieldText:"Ответьте на все тестовые вопросы. Обратите внимание, что некоторые вопросы могут иметь несколько вариантов ответов, а другие требуют развернутого ответа. Пожалуйста, старайтесь давать полные и четкие ответы.", type:"text"}, 
        { id: uuidv4(), questionText: "Вопрос 1", options:['Вариант 1', 'Вариант 2', 'Вариант 3'], type:"single"},
        { id: uuidv4(), questionText: "Вопрос 2", options:['Вариант 1', 'Вариант 2', 'Вариант 3'], type:"single"}, 
        { id: uuidv4(), questionText: "Вопрос 3", options:['Вариант 1', 'Вариант 2', 'Вариант 3'], type:"single"}, 
        {id: uuidv4(), questionText: "Вопрос 4", options:['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'], type:"multiple"},
        {id: uuidv4(), questionText: "Вопрос 5", options:['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'], type:"multiple"},
        {id: uuidv4(), questionText: "Вопрос 6", options:['Вариант 1', 'Вариант 2', 'Вариант 3', 'Вариант 4'], type:"multiple"}, 
        {id: uuidv4(), questionText: "Вопрос 7", type: "short"},
        {id: uuidv4(), questionText: "Вопрос 8", type: "short"},
        {id: uuidv4(), questionText: "Вопрос 9", type: "long"},
        {id: uuidv4(), questionText: "Вопрос 10", type:"long"}
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
