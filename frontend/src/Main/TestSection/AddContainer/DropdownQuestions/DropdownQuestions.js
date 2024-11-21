import React, {useState} from "react";

const DropdownQuestions = ({onAddQuestion}) => {
    const [questions, setQuestions] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const addQuestion = (type) => {
        const newQuestion = { type, id: questions.length + 1 };
        setQuestions([...questions, newQuestion]);
        onAddQuestion(newQuestion);
        setSelectedType('');
        setIsOpen(false);
    };
    const handleToggle = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="dropdown-questions">
            <div className="dropdown-toggle" onClick={handleToggle}>
                <span className="plus-symbol">
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="12.5011" x2="12.5011" y2="25" stroke="#475866" stroke-width="3"/>
                        <line x1="25.0011" y1="12.5" x2="0.00109863" y2="12.5" stroke="#475866" stroke-width="3"/>
                    </svg>
                </span>
                <span className="add-question-text">Добавить вопрос</span>
                {isOpen && 
                    <span className="arrow-down">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 9L11.2191 14.3306C11.6684 14.7158 12.3316 14.7158 12.7809 14.3306L19 9" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </span>}
            </div>
            {isOpen && (
                <div className="dropdown-options">
                    <div className="dropdown-option" onClick={() => addQuestion('single')}>Один ответ</div>
                    <div className="dropdown-option" onClick={() => addQuestion('multiple')}>Несколько ответов</div>
                    <div className="dropdown-option" onClick={() => addQuestion('dropdown')}>Список</div>
                    <div className="dropdown-option" onClick={() => addQuestion('short')}>Краткий ответ</div>
                    <div className="dropdown-option" onClick={() => addQuestion('long')}>Развернутый ответ</div>
                    <div className="dropdown-option" onClick={() => addQuestion('scale')}>Шкала</div>
                </div>
            )}
        </div>
    );
};
export default DropdownQuestions;