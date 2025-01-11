import React, {useState, useEffect} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import './Header.css';

const Header = ({isAuthenticated, setIsAuthenticated, userType, setUserType}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken'); 
        const userTypeFromStorage = localStorage.getItem('userType');
        setIsAuthenticated(!!token);
        setUserType(userTypeFromStorage);
    }, [setIsAuthenticated, setUserType]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType')
        setIsAuthenticated(false);
        setUserType(null)
        navigate('/authorization'); 
    };

    return (
        <header>
            <a href="#"><p className="logotip">Uralintern</p></a>
            <div className="navigation-menu">
                {isAuthenticated && userType === 'editor' && (
                    <>
                        <Link to="/" className="navigation-main">Главная</Link>
                        <Link to="/my-forms" className="navigation-myForms">Мои формы</Link>
                    </>
                )}   
                {isAuthenticated && userType === 'student' && (
                    <>
                        <Link to="/open-tests" className="navigation-tests">Тесты</Link>
                        <Link to="/passed-tests" className="navigation-passed-tests">Пройденные тесты</Link>
                    </>
                )}      
                {isAuthenticated ? (
                    <button onClick={handleLogout} className="navigation-login">Выйти</button>
                ) : (
                    <Link to="/Authorization" className="navigation-login">Войти</Link>
                )}              
            </div>
        </header>
    );
};

export default Header;
