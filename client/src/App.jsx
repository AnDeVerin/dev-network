import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';

import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import Landing from './components/layout/Landing.jsx';
import Register from './components/auth/Register.jsx';
import Login from './components/auth/Login.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';
import CreateProfile from './components/create-profile/CreateProfile.jsx';
import EditProfile from './components/edit-profile/EditProfile.jsx';
import AddExperience from './components/add-credentials/AddExperience.jsx';
import AddEducation from './components/add-credentials/AddEducation.jsx';
import Profiles from './components/profiles/Profiles.jsx';
import Profile from './components/profile/Profile.jsx';
import NotFound from './components/not-found/NotFound.jsx';
import Posts from './components/posts/Posts.jsx';
import Post from './components/post/Post.jsx';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token to auth-header
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration date
  const decodedData = jwtDecode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decodedData));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decodedData.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    this.dummy = null;
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className="container">
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:handle' component={Profile} />
              <Switch>
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/add-experience' component={AddExperience} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/add-education' component={AddEducation} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/feed' component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path='/post/:id' component={Post} />
              </Switch>
              <Route exact path='/not-found' component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
