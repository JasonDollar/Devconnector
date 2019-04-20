import React, { Component } from 'react';
import {Router, Switch, Route} from 'react-router-dom'
import {Provider} from 'react-redux'
import jwt_decode from 'jwt-decode'

import setAuthToken from './utils/setAuthToken'
import store from './store/store'
import history from './history'
import {setCurrentUser, logoutUser, clearProfile} from './store/actions'

import Navbar from './components/Layout/Navbar'
import Landing from './components/Layout/Landing'
import Footer from './components/Layout/Footer'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './components/Dashboard/Dashboard'
import PrivateRoute from './components/common/PrivateRoute'
import CreateProfile from './components/CreateProfile/CreateProfile'
import EditProfile from './components/EditProfile/EditProfile'
import AddEducation from './components/add-credentials/AddEducation'
import AddExperience from './components/add-credentials/AddExperience'

import './App.css';

if (localStorage.jwtToken) {
  const decoded = jwt_decode(localStorage.jwtToken)
  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken')
    setAuthToken(false)
    store.dispatch(clearProfile())
    store.dispatch(logoutUser())
    window.location.href= '/login'
  } else {

    console.log(decoded.exp, Date.now())
    setAuthToken(localStorage.jwtToken)
    store.dispatch(setCurrentUser(decoded))
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <div>
            <Navbar />
            <Route path="/" exact component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
                <PrivateRoute exact path="/add-education" component={AddEducation} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
} 

export default App;
