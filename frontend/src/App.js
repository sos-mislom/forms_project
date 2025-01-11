import './styles/App.css';
import Main from "./Main/Main";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header/Header';
import CreateForm from './CreateForm/CreateForm';
import MainSample1 from './MainSample1/MainSample1';
import MainSample2 from './MainSample2/MainSample2';
import Authorization from './Authorization/Authorization';
import Registration from './Registration/Registration';
import MyForms from './MyForms/MyForms';
import OpenTests from './OpenTests/OpenTests';
import PassedTests from './PassedTests/PassedTests';
import PassingTest from './PassingTest/PassingTest';
import React, {useState} from 'react';
import Answer from './Main/Answer/Answer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userType, setUserType] = useState(null);

  return (
    <Router>
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userType={userType} setUserType={setUserType}/>
        <Routes>
          <Route path="/" element={<CreateForm />}/>
          <Route path="/create-form" element={<Main />}/>
          <Route path="/create-form/:uniqueLink" element={<Main />}/>
          <Route path="/create-form-with-template1" element={<MainSample1 />}/>
          <Route path="/create-form-with-template2" element={<MainSample2 />}/>
          <Route exact path="/authorization" element={<Authorization setIsAuthenticated={setIsAuthenticated} setUserType={setUserType}/>}/>
          <Route path="/registration" element={<Registration />}/>
          <Route path="/my-forms" element={<MyForms />}/>
          <Route path="/open-tests" element={<OpenTests />}/>
          <Route path="/passed-tests" element={<PassedTests />}/>
          <Route path="/passing-test/:uniqueLink" element={<PassingTest />}/>
          <Route path="/answers/:userId" element={<Answer />}/>
        </Routes>
    </Router>
  );
}

export default App;
