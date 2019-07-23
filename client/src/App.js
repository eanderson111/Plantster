import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Plants from "./pages/Plants";
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Tessel from "./pages/Tessel"
import axios from "axios";
import {Component} from "react"


class App extends Component{
constructor() {
  super()
  this.state = {
    loggedIn: false,
    username: null
  }

  this.updateUser = this.updateUser.bind(this)
}


updateUser (userObject) {
  this.setState(userObject)
}

render() {
    return (
    <Router>
      <div>
        
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route exact path="/Login" render={(props) => <Login {...props} updateUser={this.updateUser} />} />
          <Route exact path="/Signup" component={Signup} />
          <Route exact path="/Profile" component={Profile} />
          <Route exact path="/Plants" component={Plants} />
          <Route exact path="/Tessel" component={Tessel} />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </Router>
  );
}
}

export default App;
