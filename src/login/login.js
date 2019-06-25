import React, { Component } from 'react'
import axios from  'axios';
export default class login extends Component {
    state = {
        email:'',
        password:''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    // Logs user in and alert error if there was an issue. 
    login = () => {
        const loginObject = {
            email:this.state.email,
            password:this.state.password
        }
        axios.post('/auth/login', loginObject)
        .then((response)=>{
            if(response.data.success){
                this.props.history.push('/home')
            }else{
                alert(response.data.err)
            }
        })  
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.email} name="email" onChange={this.handleChange}/>
                <input type="password" value={this.state.password} name="password" onChange={this.handleChange}/>
                <button onClick={this.login}>Login</button>
            </div>  
        )
    }
}
