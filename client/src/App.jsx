import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Landing from './components/layout/Landing.jsx';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';

import './App.css';

class App extends Component {
  render() {
    this.dummy = null;
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className="container">
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
