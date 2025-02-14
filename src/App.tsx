import React from 'react';
// import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import './App.css';
import Todolist from './Components/Todolist';
import Login from './Components/Login';
import TodoMain from './Components/TodoMain';
import { UserProvider } from './Components/UserContext';
import PrivateRoute from './Components/privateRoute'; 

function App() {
  return (
    <div className="containerdiv">
      <UserProvider>
      <Router>
        <Routes>
          
            <Route path="/" element={<Login />} />
            
            <Route element={<PrivateRoute />}>
            <Route path="/todomain" element={<TodoMain />} />
            </Route>
          
        </Routes>
      </Router>
      </UserProvider>
      {/* <Todolist /> */}
    </div>
  );
}

export default App;
