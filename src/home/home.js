import React, { Component } from 'react'
import axios from 'axios'
export default class home extends Component {

    componentDidMount(){
        // checks to see if middle ware works. 
        axios.get('/api/test')
        .then((response)=>{
            if(response.data.success){
                console.log(response.data.message)
            }else{
                this.props.history.push('/')
            }
        })
    }

    // logs users out
    logout = () => {
        axios.post('/auth/logout')
        .then((response)=>{
            if(response.data.success){
                this.props.history.push('/')
            }else{
                alert(response.data.err)
            }
        })
    }
    render() {
        return (
            <div>
            <button onClick={this.logout}>logout</button>
                Home
            </div>
        )
    }
}
