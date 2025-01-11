import React from 'react';
import FieldText from './Fields/FieldText';
import FieldTitle from './Fields/FieldTitle';
import QuestionSingle from './Questions/QuestionSingle';
import QuestionMultiple from './Questions/QuestionMultiple';
import QuestionShort from './Questions/QuestionShort';

const QuestionContainer = ({ questions, onAnswerChange }) => {
    const renderQuestion = (item) => {
        switch (item.type) {
            case 'picture':
                return  <div className="uploaded">
                            <img className='uploaded-picture' key={item.id} src={item.url} alt="picture"/>
                        </div>
            case 'video':
                return  <div className="uploaded">
                            <video className='uploaded-video' key={item.id}>
                                <source src={item.url} type="video/mp4" />
                            </video>;
                        </div>   
            case 'text':
                return <FieldText key={item.id} textField={item.fieldText} />;
            case 'title':
                return <FieldTitle key={item.id} titleField={item.titleField} fieldDescription={item.fieldDescription} />;
            case 'single':
                return <QuestionSingle key={item.id} questionText={item.questionText} options={item.options} onAnswerChange={onAnswerChange} question_id={item.id}/>;
            case 'multiple':
                 return <QuestionMultiple key={item.id} questionText={item.questionText} options={item.options} onAnswerChange={onAnswerChange} question_id={item.id}/>;
            case 'short':
                return <QuestionShort key={item.id} questionText={item.questionText} onAnswerChange={onAnswerChange} question_id={item.id}/>;
            default:
                return null;
        }
    };

    return (
        <div className="question-container">
            {questions.map(renderQuestion)}
        </div>
    );
};

export default QuestionContainer;
