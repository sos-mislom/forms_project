import React from "react";

const FieldTitle = ({titleField, fieldDescription}) => {
    
    return (
        <div className="field-text" style={{margin: "25px 37px 25px 38px"}}>
            <div>
                <h1 className="fieldTitle">{titleField}</h1>
                <hr/>
                <p className="fieldDescription">{fieldDescription}</p>
            </div>
        </div>
    );
};

export default FieldTitle;