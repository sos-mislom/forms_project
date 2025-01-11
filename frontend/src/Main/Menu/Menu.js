import React from "react";
import './Menu.css'

const Menu = ({ currentTab, setCurrentTab }) => {
    return(
        <div className="menu">
            <span className={currentTab === 'test' ? 'active' : ''} onClick={() => setCurrentTab('test')}>Тест</span>
            <span className={currentTab === 'answers' ? 'active' : ''} onClick={() => setCurrentTab('answers')}>Ответы</span>
        </div>
    );
};

export default Menu;
 