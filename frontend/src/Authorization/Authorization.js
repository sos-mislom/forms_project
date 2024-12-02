import React, {useState} from "react";
import {useNavigate, Link} from 'react-router-dom';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const authorizationData = {
        email,
        password,
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await fetch('http://92.118.115.96:8000/forms/', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify(authorizationData), 
            }); 
            const result = await response.json();

            if (result.token) { 
                localStorage.setItem('authToken', result.token); 
                navigate('/'); 
            } else { 
                console.error('Ошибка аутентификации:', result.message); 
            }
        } catch (error) {
            console.error('Ошибка сети:', error);
        }
    };
    return (
        <div className="Authorization">
            <h1>Авторизация</h1>
            <form onSubmit={handleSubmit}>
                <div className="input-authorization">
                    <input 
                        type="email" 
                        placeholder="E-mail" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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