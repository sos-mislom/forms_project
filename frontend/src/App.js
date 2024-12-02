import './styles/App.css';
import Main from "./Main/Main";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header/Header';
import CreateForm from './CreateForm/CreateForm';
import MainSample1 from './MainSample1/MainSample1';
import MainSample2 from './MainSample2/MainSample2';
import Authorization from './Authorization/Authorization';
import Registration from './Registration/Registration';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<CreateForm />}/>
        <Route path="/create-form" element={<Main />}/>
        <Route path="/create-form-with-template1" element={<MainSample1 />}/>
        <Route path="/create-form-with-template2" element={<MainSample2 />}/>
        <Route path="/authorization" element={<Authorization />}/>
        <Route path="/registration" element={<Registration />}/>
      </Routes>
    </Router>
  );
}

export default App;
