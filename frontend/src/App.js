import './styles/App.css';
import Main from "./Main/Main"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header/Header'
import CreateForm from './CreateForm/CreateForm';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route exact path="/" element={<CreateForm />}/>
        <Route path="/create" element={<Main />}/>
      </Routes>
    </Router>
  );
}

export default App;
