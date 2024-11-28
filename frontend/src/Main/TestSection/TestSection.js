import React, {useState} from "react";
import LineAndAdd from "./LineAndAdd/LineAndAdd";
import AddContainer from "./AddContainer/AddContainer";
import ModalPublic from "./ModalPublic/ModalPublic";
import axios from "axios";

const TestSection = () => {
    const [questionsAndFields, setQuestionsAndFields] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const addQuestionOrField = (element) =>{
        const newQuestionOrField = {...element, id: questionsAndFields.length + 1};
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
            console.log('форма сохранена успешно', questionsAndFields)
            setModalOpen(true);
        } catch(error){
            console.error('Ошибка при сохранении формы', error);
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setQuestionsAndFields([]);
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
export default TestSection;