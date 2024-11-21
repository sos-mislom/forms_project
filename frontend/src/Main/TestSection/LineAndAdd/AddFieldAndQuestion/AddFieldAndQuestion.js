import React from 'react';
import FieldForm from "./FieldForm/FieldForm";
import QuestionForm from "./QuestionForm/QuestionForm"

const AddFieldAndQuestion = ({onAddField, onAddQuestion}) => {
    return (
        <div className="add-field-and-question">
            <FieldForm onAddField={onAddField}/>
            <QuestionForm onAddQuestion={onAddQuestion}/>
        </div>
    );
};

export default AddFieldAndQuestion;