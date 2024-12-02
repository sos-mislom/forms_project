import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [errorMessages, setErrorMessages] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};

        if (!name) errors.name = "Пожалуйста, введите имя.";
        if (!lastName) errors.lastName = "Пожалуйста, введите фамилию.";
        if (!email) errors.email = "Пожалуйста, введите E-mail.";
        if (!password) errors.password = "Пожалуйста, введите пароль.";
        if (password !== confirmPassword) {
            errors.confirmPassword = "Пароли не совпадают.";
        }
        if (!userType) {
            errors.userType = "Пожалуйста, выберите тип пользователя.";
        }
        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);
            return;
        }
        const registrationData = {
            name,
            lastName,
            email,
            password,
            userType,
        };
        try{
            const response = await fetch('http://92.118.115.96:8000/forms/', { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify(registrationData), 
            }); 
            const result = await response.json(); 
            console.log(result); 
            navigate('/authorization');
        }
        catch(error){
            console.log(error);
        }
    };

    return (
        <div className="registration">
            <h1>Регистрация</h1>
            <form className="container-registration" onSubmit={handleSubmit}>
                <div className="container-name">
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <input 
                            className={`name ${errorMessages.name ? '-error' : ''}`}
                            type="text" 
                            placeholder="Имя" 
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setErrorMessages(prev => ({ ...prev, name: undefined }));
                            }}
                        />
                        {errorMessages.name && <span className="error-message">{errorMessages.name}</span>}
                    </div>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <input 
                            className={`last-name ${errorMessages.lastName ? '-error' : ''}`}
                            type="text" 
                            placeholder="Фамилия" 
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value);
                                setErrorMessages(prev => ({ ...prev, lastName: undefined }));
                            }}
                        />
                        {errorMessages.lastName && <span className="error-message">{errorMessages.lastName}</span>}
                    </div>
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <input 
                        className={`email ${errorMessages.email ? '-error' : ''}`} 
                        type="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setErrorMessages(prev => ({ ...prev, email: undefined }));
                        }}
                    />
                    {errorMessages.email && <span className="error-message" style={{marginLeft:'600px'}}>{errorMessages.email}</span>}
                </div>

                <div className="container-password">
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <input 
                            className={`password ${errorMessages.password ? '-error' : ''}`}
                            type="password" 
                            placeholder="Пароль" 
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrorMessages(prev => ({ ...prev, password: undefined }));
                            }}
                        />
                        {errorMessages.password && <span className="error-message">{errorMessages.password}</span>}
                    </div>
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                        <input 
                            className={`repeat-password ${errorMessages.confirmPassword ? '-error' : ''}`} 
                            type="password" 
                            placeholder="Подтвердите пароль" 
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                setErrorMessages(prev => ({ ...prev, confirmPassword: undefined }));
                            }}
                        />
                        {errorMessages.confirmPassword && <span className="error-message">{errorMessages.confirmPassword}</span>}
                    </div>
                </div>
                <div>
                    <div className="radio-buttons">
                        <div className="checkedUser">
                            <input 
                                type="radio" 
                                name="userType" 
                                value="editor"
                                onChange={(e) => {
                                    setUserType(e.target.value);
                                    setErrorMessages(prev => ({ ...prev, userType: undefined }));
                                }} 
                            />
                            <span>Я редактор</span>
                        </div>
                        <div className="checkedUser">
                            <input 
                                type="radio" 
                                name="userType" 
                                value="intern"
                                onChange={(e) => {
                                    setUserType(e.target.value);
                                    setErrorMessages(prev => ({ ...prev, userType: undefined }));
                                }} 
                            />
                            <span>Я стажер</span>
                        </div>
                    </div>
                    {errorMessages.userType && <span className="error-message" style={{marginLeft:'556px'}}>{errorMessages.userType}</span>}
                </div>
                <div className="registration-button">
                    <button type="submit" className="registry">Зарегистрироваться</button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
