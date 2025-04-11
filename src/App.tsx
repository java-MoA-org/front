
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/header';
import MyUserPage from './views/UserPage';
import { MY_USER_PATH } from './constants';

function App() {
  return (
    <Routes>
      <Route element = { <Header/>}>
      <Route path={MY_USER_PATH} element={<MyUserPage />} />
      </Route>
    </Routes>
  );
}

export default App;
