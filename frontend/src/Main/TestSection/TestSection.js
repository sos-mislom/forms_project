import React, {useState} from "react";
import LineAndAdd from "./LineAndAdd/LineAndAdd";
import AddContainer from "./AddContainer/AddContainer";
import ModalPublic from "./ModalPublic/ModalPublic";
import axios from "axios";

const TestSection = () => {
    const [questions, setQuestions] = useState([]);
    const [fields, setFields] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    const addQuestion = (element) =>{
        setQuestions([...questions, element]);
    };

    const addField = (element) => {
        setFields([...fields, element]);
    };

    const onDeleteQuestion = (id) => {
        setQuestions(questions.filter((question) => question.id !== id));
    };
    const onDeleteField = (id) => {
        setFields(fields.filter((field) => field.id !== id));
    };

    const onUpdateQuestion = (id, updatedQuestion) => {
        setQuestions(questions.map(
            q => q.id === id ? {...updatedQuestion, id} : q
        ));
    };

    const onUpdateField = (id, updatedField) => {
        setFields(fields.map(
            f => f.id === id ? {...updatedField, id} : f
        ));
    };
    
    const saveForm = async () => {
        try{
            console.log('форма сохранена успешно', questions, fields)
            setModalOpen(true);
        } catch(error){
            console.error('Ошибка при сохранении формы', error);
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setQuestions([]);
        setFields([]);
    };

    return (
        <section className="test">
            <div className="test-block">
                <AddContainer 
                    fields={fields} 
                    questions={ questions } 
                    onAddQuestion={addQuestion} 
                    onDeleteQuestion={onDeleteQuestion} 
                    onUpdateQuestion={onUpdateQuestion} 
                    onUpdateField={onUpdateField} 
                    onDeleteField={onDeleteField}
                />
                <LineAndAdd 
                    onAddField={addField} 
                    onAddQuestion={addQuestion}
                />
            </div>
            <button className="publiced" type="button" onClick={saveForm}>Опубликовать</button>
            <ModalPublic isOpen={isModalOpen} onClose={handleCloseModal}/>
        </section>
    );
};
export default TestSection;