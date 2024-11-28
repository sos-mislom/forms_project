import React from "react";
import AddFieldAndQuestion from "./AddFieldAndQuestion/AddFieldAndQuestion";

const LineAndAdd = ({ onAddQuestionOrField}) =>{
    return (
        <div className="line-and-add">
            <div className="line"></div>
            <AddFieldAndQuestion onAddQuestionOrField={onAddQuestionOrField}/>
        </div>
    );
};

export default LineAndAdd;