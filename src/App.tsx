import { useState } from 'react';
import './App.css';
import LoginForm from './LoginForm';
import Activities from './FindActivity';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Favorites from './Favorites';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  
  return isLoggedIn ? (
    <Router basename="/PilvipalvelutHarjoitus">
      <Routes>
        <Route path="" element={<Activities />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  ) : (
    <LoginForm onLogin={handleLogin} />
  );
}
  export default App;