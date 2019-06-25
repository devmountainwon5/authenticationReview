import React, { Component } from 'react';
import './App.css';
import Login from './login/login';
import Home from './home/home';
import axios from 'axios';
import { Switch, Route, withRouter } from 'react-router-dom';

class App extends Component {
	componentDidMount() {
    // verify that the user is still logged in on page refresh. 
    axios.get('/auth/user')
      .then(response => {
        if(!response.data.success){
          this.props.history.push('/')
        }
      });
	}
	render() {
		return (
			<div>
					<Switch>
						<Route path="/home" component={Home} />
						<Route path="/" component={Login} />
					</Switch>
			</div>
		);
	}
}
  // With router imported above give us access this.props.history.push and the other router props
export default withRouter(App);
