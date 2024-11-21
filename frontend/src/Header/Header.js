import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <a href="#"><p className="logotip">Uralintern</p></a>
            <div className="navigation-menu">
                <Link to="/" className="navigation-main">Главная</Link>
                <a className="navigation-myForms" href="#">Мои формы</a>
            </div>
        </header>
    );
};

export default Header;
