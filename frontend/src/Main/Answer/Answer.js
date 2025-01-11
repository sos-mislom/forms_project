import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddContainer from "../TestSection/AddContainer/AddContainer";

const Answer = () => {
    const location = useLocation();
    const { questions, answers } = location.state;
    const [questionsAndFields, setQuestionsAndFields] = useState([]);

    useEffect(() => {
        const mergedData = answers.map(answer => {
            const question = questions.find(q => q.id === answer.question_id);
            return {
                ...question,
                userAnswer: answer.answer
            };
        });
        setQuestionsAndFields(mergedData);
    }, [questions, answers]);

    return (
        <section className="test-take">
            <div className="test-block">
                <AddContainer 
                    questionsAndFields={questionsAndFields} 
                    onAddQuestionOrField={() => {}} 
                    onDeleteQuestionOrField={() => {}} 
                    onUpdateQuestionOrField={() => {}} 
                    isUserAnswer={true}
                />
            </div>
        </section>
    );
};

export default Answer;