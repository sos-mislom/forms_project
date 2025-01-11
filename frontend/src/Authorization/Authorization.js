import React, {useState} from "react";
import {useNavigate, Link} from 'react-router-dom';
import './Authorization.css';

const Authorization = ({setIsAuthenticated, setUserType}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const authorizationData = {
        username,
        password
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch('https://uralitern-forms.ru/api/login', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify(authorizationData)
            }); 
            const result = await response.json();
            if (!response.ok) {
                setServerError(result.error || 'Не удалось войти');
                return;
            }    
            else{
                localStorage.setItem('authToken', result.access_token); 
                localStorage.setItem('refreshToken', result.refresh_token);
                localStorage.setItem('userType', result.userType);
                setIsAuthenticated(true); 
                setUserType(result.userType);
                if(result.userType === 'editor'){
                    navigate('/'); 
                } else{
                    navigate('/passed-tests')
                }
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
            setServerError('Произошла ошибка при входе');
        }
    };
    return (
        <div className="Authorization">
            <h1>Авторизация</h1>
            {serverError && <div className="server-error-authorization">{serverError}</div>}
            <form onSubmit={handleSubmit}>
                <div className="input-authorization">
                    <input 
                        type="text" 
                        placeholder="E-mail" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                    />
                </div>
                <div className="button-authorization">
                    <Link to="/registration" className="registry-button">Регистрация</Link>
                    <button type="submit" className="login-button">Войти</button>
                </div>
            </form>
        </div>
    );
};
export default Authorization;