import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken'); 
        setIsAuthenticated(!!token);
    }, []);
    return (
        <header>
            <a href="#"><p className="logotip">Uralintern</p></a>
            <div className="navigation-menu">
                <Link to="/" className="navigation-main">Главная</Link>
                <a className="navigation-myForms" href="#">Мои формы</a>
                {isAuthenticated ? (
                    <svg style={{marginLeft:"65px"}} width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M46.3333 47.5V43.3333C46.3333 41.1232 45.4554 39.0036 43.8926 37.4408C42.3298 35.878 40.2101 35 38 35H21.3333C19.1232 35 17.0036 35.878 15.4408 37.4408C13.878 39.0036 13 41.1232 13 43.3333V47.5" stroke="#001F28" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M29.6673 29.6667C34.2697 29.6667 38.0007 25.9357 38.0007 21.3333C38.0007 16.731 34.2697 13 29.6673 13C25.0649 13 21.334 16.731 21.334 21.3333C21.334 25.9357 25.0649 29.6667 29.6673 29.6667Z" stroke="#001F28" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="30" cy="30" r="28.5" stroke="#001F28" stroke-opacity="0.9" stroke-width="3"/>
                    </svg>                    
                ) : (<Link to="/Authorization" className="navigation-login">Войти</Link>)}               
            </div>
        </header>
    );
};

export default Header;
