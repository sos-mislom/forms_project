import React from "react";
import { Link } from "react-router-dom";

const CreateForm = () => {
    return (
        <div>
            <h1>Создайте новую форму</h1>
            <ul class="forms">
                <li class="form">
                    <Link to="/create"><div class="form-rectangle"></div></Link>
                    <p class="form-text"><Link to="/create">Пустая форма</Link></p>
                </li>
                <li class="form">
                    <a href="#"><div class="form-rectangle"></div></a>
                    <p class="form-text"><a href="#">Шаблон 1</a></p>
                </li>
                <li class="form">
                    <a href="#"><div class="form-rectangle"></div></a>
                    <p class="form-text"><a href="#">Шаблон 2</a></p>
                </li>
            </ul>
        </div>
    );
};

export default CreateForm;