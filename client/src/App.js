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
              <Route exact path="/dashboard" component={Dashboard} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
} 

export default App;
