import React from "react";
import './FieldText.css';
const FieldText = ({textField}) => {

    return (
        <div className="field-text" style={{margin: "25px 37px 25px 38px"}}>
            <div>
                <p className="fieldText">{textField}</p>
            </div>
        </div>
    ); 
};

export default FieldText;