import React, {useState, useEffect} from "react";
import {Link, useNavigate} from 'react-router-dom';
import './MyForms.css'

const MyForms = () => {
    const [forms, setForms] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://uralitern-forms.ru/api/tests', { 
                    method: 'GET', 
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }); 

                if (!response.ok) {
                    throw new Error(`Ошибка при загрузке форм : ${response.error}`);
                }
                
                const data = await response.json();
                setForms(data);
            } catch (error) {
                setError(error.message);
            }
        };
    
        fetchForms();
    }, []);
    
    const handleDelete = async (uniqueLink) => { 
        try { 
            const token = localStorage.getItem('authToken'); 
            const response = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}`, { 
                method: 'DELETE', 
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                } 
            }); 
            
            if (!response.ok) { 
                throw new Error(`Ошибка при удалении формы ${response.error}`); 
            } 
            setForms((prevForms) => {
                const updatedForms = prevForms.filter(form => form.unique_link !== uniqueLink);
                return updatedForms;
            });
        } 
        catch (error) { 
            setError(error.message); 
        } 
    };

    const handleEdit = (uniqueLink) => { 
        navigate(`/create-form/${uniqueLink}`); 
    };

    const handlePublishToggle = async (uniqueLink) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`https://uralitern-forms.ru/api/tests/${uniqueLink}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка:${response.error}`);
            }
            const data = await response.json();
            setForms(prevForms => 
                prevForms.map(form => 
                    form.unique_link === uniqueLink ? { ...form, is_published: data.is_published } : form
                )
            );
        } catch (error) {
            setError(error.message);
        }
    };

    if (error) {
        return <div>{error}</div>;
    }
       
    return(
        <div className="my-forms">
            <h1>Мои формы</h1>
            <ul style={{display:'flex', 'flexWrap':'wrap', marginLeft:'67px', padding:'0px'}}>
                <div className="create-new-form-myforms">
                    <Link to="/create-form">
                        <svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="300" height="200" fill="#F5F5F5"/>
                            <line x1="147" y1="35" x2="147" y2="155" stroke="#001F28" stroke-opacity="0.9" stroke-width="4"/>
                            <line x1="85" y1="93" x2="205" y2="93" stroke="#001F28" stroke-opacity="0.9" stroke-width="4"/>
                        </svg>
                    </Link>
                    <span>Создать форму</span>
                </div>
                {forms.map((form) => (
                    <div key={form.id} className="myform-block" onClick={() => handleEdit(form.unique_link)}>
                        <div className="test-link">
                            <div className="test-myform"></div>
                            <button className="delete-test" onClick={(e) => { e.stopPropagation(); handleDelete(form.unique_link)}}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.05063 8.73418C4.20573 7.60763 5.00954 6 6.41772 6H17.5823C18.9905 6 19.7943 7.60763 18.9494 8.73418V8.73418C18.3331 9.55584 18 10.5552 18 11.5823V18C18 20.2091 16.2091 22 14 22H10C7.79086 22 6 20.2091 6 18V11.5823C6 10.5552 5.66688 9.55584 5.05063 8.73418V8.73418Z" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5"/>
                                        <path d="M14 17L14 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10 17L10 11" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M16 6L15.4558 4.36754C15.1836 3.55086 14.4193 3 13.5585 3H10.4415C9.58066 3 8.81638 3.55086 8.54415 4.36754L8 6" stroke="#001F28" stroke-opacity="0.9" stroke-width="1.5" stroke-linecap="round"/>
                                    </svg>
                            </button>
                            <button 
                                className="toggle-publish" 
                                onClick={(e) => { e.stopPropagation(); handlePublishToggle(form.unique_link) }}>
                                {form.is_published ? 
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.53 9.47L9.47 14.53M14.53 9.47C13.88 8.82 12.99 8.42 12 8.42C10.02 8.42 8.42 10.02 8.42 12C8.42 12.99 8.82 13.88 9.47 14.53M14.53 9.47L22 2M9.47 14.53L2 22M17.82 5.77C16.07 4.45 14.07 3.73 12 3.73C8.47 3.73 5.18 5.81 2.89 9.41C1.99 10.82 1.99 13.19 2.89 14.6C3.68 15.84 4.6 16.91 5.6 17.77M8.42 19.53C9.56 20.01 10.77 20.27 12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.4C20.78 8.88 20.42 8.39 20.05 7.93M15.51 12.7C15.25 14.11 14.1 15.26 12.69 15.52" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                    : 
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.5798 12C15.5798 13.98 13.9798 15.58 11.9998 15.58C10.0198 15.58 8.41984 13.98 8.41984 12C8.41984 10.02 10.0198 8.41997 11.9998 8.41997C13.9798 8.41997 15.5798 10.02 15.5798 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M11.9998 20.27C15.5298 20.27 18.8198 18.19 21.1098 14.59C22.0098 13.18 22.0098 10.81 21.1098 9.39997C18.8198 5.79997 15.5298 3.71997 11.9998 3.71997C8.46984 3.71997 5.17984 5.79997 2.88984 9.39997C1.98984 10.81 1.98984 13.18 2.88984 14.59C5.17984 18.19 8.46984 20.27 11.9998 20.27Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                }
                            </button>
                            <span>{form.title}</span>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default MyForms;