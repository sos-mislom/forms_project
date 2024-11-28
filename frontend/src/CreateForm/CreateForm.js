import React from "react";
import { Link } from "react-router-dom";
import image2 from './2.png';
import image3 from './3.png'

const CreateForm = () => {
    return (
        <div>
            <h1>Создайте новую форму</h1>
            <ul className="forms">
                <li className="form">
                    <Link to="/create-form"><svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="300" height="200" fill="#F5F5F5"/>
                                                <line x1="147" y1="35" x2="147" y2="155" stroke="#001F28" stroke-opacity="0.9" stroke-width="4"/>
                                                <line x1="85" y1="93" x2="205" y2="93" stroke="#001F28" stroke-opacity="0.9" stroke-width="4"/>
                                            </svg></Link>
                    <p className="form-text"><Link to="/create">Пустая форма</Link></p>
                </li>
                <li className="form">
                    <Link to="/create-form-with-template1">
                        <img className="form-rectangle" src={image2} />
                    </Link>
                    <p className="form-text"><a href="#">Анкета</a></p>
                </li>
                <li className="form">
                    <Link to="/create-form-with-template2">
                        <img className="form-rectangle" src={image3}/>
                        </Link>
                    <p className="form-text"><a href="#">Тест</a></p>
                </li>
            </ul>
        </div>
    );
};

export default CreateForm;