import React from 'react';
import DropdownQuestions from './DropdownQuestions/DropdownQuestions';
import FieldText from './Fields/FieldText'
import FieldTitle from './Fields/FieldTitle';
import QuestionSingle from './Questions/QuestionSingle';
import QuestionMultiple from './Questions/QuestionMultiple';
import QuestionDropdown from './Questions/QuestionDropdown';
import QuestionShort from './Questions/QuestionShort';
import QuestionLong from './Questions/QuestionLong';
import QuestionScale from './Questions/QuestionScale';
 
const AddContainer = ({questionsAndFields, onAddQuestionOrField, onDeleteQuestionOrField, onUpdateQuestionOrField}) => {

    const render = (item) => {
        switch (item.type) {
            case 'picture':
                return  <div className="uploaded">
                            <img className='uploaded-picture' key={item.id} src={item.url} alt="Uploaded"/>
                            <button className='delete-uploaded' onClick={() => onDeleteQuestionOrField(item.id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="#F5F5F5" stroke-width="1.5"/>
                                    <path d="M14 17L14 11" stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 17L10 11" stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>
            case 'video':
                return  <div className="uploaded">
                            <video className='uploaded-video' key={item.id}>
                                <source src={item.url} type="video/mp4" />
                            </video>;
                            <button className='delete-uploaded' onClick={() => onDeleteQuestionOrField(item.id)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5"/>
                                    <path d="M14 17L14 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10 17L10 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
                                </svg>
                            </button>
                        </div>     
            case 'text':
                return  <FieldText key={item.id } id={item.id} onUpdate={onUpdateQuestionOrField} onDelete={onDeleteQuestionOrField} fieldText={item.fieldText}/>;
            case 'title':
                return  <FieldTitle key={item.id } id={item.id} onUpdate={onUpdateQuestionOrField} fieldDescription={item.fieldDescription}/>;
            case 'single':
                return <QuestionSingle key={item.id } id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText} initialOptions={item.options}/>;
            case 'multiple':
                return <QuestionMultiple key={item.id} id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText} initialOptions={item.options}/>;
            case 'dropdown':
                return <QuestionDropdown key={item.id} id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText}/>;
            case 'short':
                return <QuestionShort key={item.id} id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText}/>;
            case 'long':
                return <QuestionLong key={item.id} id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText}/>;
            case 'scale':
                return <QuestionScale key={item.id} id={item.id} onDelete={onDeleteQuestionOrField} onUpdate={onUpdateQuestionOrField} questionText={item.questionText}/>;
            default:
                return null;
        }
    };
    return (
        <div className="add-container">
            <div className="question-container">
                {questionsAndFields.map(render)}
            </div>
            <DropdownQuestions onAddQuestion={onAddQuestionOrField} />
        </div>
    );
};

export default AddContainer;
