import React from 'react';
import FieldForm from "./FieldForm/FieldForm";
import QuestionForm from "./QuestionForm/QuestionForm"

const AddFieldAndQuestion = ({onAddQuestionOrField}) => {
    return (
        <div className="add-field-and-question">
            <FieldForm onAddField={onAddQuestionOrField}/>
            <QuestionForm onAddQuestion={onAddQuestionOrField}/>
        </div>
    );
};

export default AddFieldAndQuestion;