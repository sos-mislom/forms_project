import React, { useState, useEffect } from "react";
import Menu from './Menu/Menu';
import { useParams } from 'react-router-dom';
import TestSection from "./TestSection/TestSection";
import Answers from "./Answers/Answers";
 
const Main = () => {
    const { uniqueLink } = useParams();
    const [currentTab, setCurrentTab] = useState('test');

    return (
        <div>
            <Menu currentTab={currentTab} setCurrentTab={setCurrentTab} />
            {currentTab === 'test' && <TestSection uniqueLink={uniqueLink} />}
            {currentTab === 'answers' && <Answers uniqueLink={uniqueLink} />}
        </div>
    );
};

export default Main;