import React, { useState, useEffect } from "react";
import './PassedTests.css';

const PassedTests = () => {
    const [forms, setForms] = useState([]);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchFormsData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch('https://uralitern-forms.ru/api/completed-tests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке форм');
                }
                const data = await response.json();
                data.sort((a, b) => b.is_passed - a.is_passed);
                setForms(data);

                const resultsData = {}; 
                for (const form of data) { 
                    const resultResponse = await fetch(`https://uralitern-forms.ru/api/tests/${form.unique_link}/result`, { 
                        method: 'GET', 
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Authorization': `Bearer ${token}` 
                        }
                    }); 
                    if (!resultResponse.ok) { 
                        throw new Error('Ошибка при загрузке результатов'); 
                    } 
                    const resultData = await resultResponse.json(); 
                    resultsData[form.unique_link] = resultData; 
                } 
                setResults(resultsData);
            } catch (error) {
                console.error('Ошибка при загрузке форм', error);
            }
        };
        fetchFormsData();
    }, []);

    return (
        <div className="passed-tests">
            <h1>Пройденные тесты</h1>
            <ul style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '67px', padding: '0px' }}>
                {forms.map((form) => (
                    <div key={form.id} className="passed-tests-block">
                        <div className="test-link" style={{display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                            <div className="passed-test"></div>
                            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', width: '300px'}}>
                                <div>
                                    <span>{form.title}</span>
                                    <div style={{display:'flex', flexDirection:'row'}}>
                                        <span>Результат:</span>
                                        <span>{`${(results[form.unique_link]?.total_score / results[form.unique_link]?.max_score * 100).toFixed(2)} %`}</span>
                                    </div>
                                </div>
                                {form.is_passed ? <div style={{marginRight:'10px', alignSelf:'center'}}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_419_459)">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.4815 1.71216C20.0896 2.21476 20.1753 3.11521 19.6726 3.7234L8.18694 17.6223L8.18348 17.6265C7.92223 17.9402 7.59434 18.1918 7.22367 18.3628C6.85298 18.5339 6.44884 18.6202 6.04063 18.6155C5.62573 18.6103 5.2161 18.5112 4.84497 18.3256C4.47508 18.1408 4.15174 17.8746 3.89904 17.5473L0.30093 12.9212C-0.183455 12.2984 -0.0712639 11.4009 0.551517 10.9165C1.1743 10.4321 2.07184 10.5443 2.55623 11.1671L6.07561 15.692L17.4702 1.90336C17.9727 1.29517 18.8733 1.20957 19.4815 1.71216Z" fill="black"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_419_459">
                                                <rect width="20" height="20" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div> :
                                    <div style={{marginRight:'10px', alignSelf:'center'}}>
                                        <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.07107 1.92893L15.2132 16.0711M1.07107 16.0711L15.2132 1.92893" stroke="#001F28" stroke-opacity="0.9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>                                
                                }      
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default PassedTests;
