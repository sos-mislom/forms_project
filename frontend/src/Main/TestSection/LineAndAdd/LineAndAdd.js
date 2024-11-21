import React from "react";
import AddFieldAndQuestion from "./AddFieldAndQuestion/AddFieldAndQuestion";

const LineAndAdd = ({ onAddField, onAddQuestion}) =>{
    return (
        <div className="line-and-add">
            <div className="line"></div>
            <AddFieldAndQuestion onAddField={onAddField} onAddQuestion={onAddQuestion}/>
        </div>
    );
};

export default LineAndAdd;