import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Sign from './sign';
import reportWebVitals from './reportWebVitals';

const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; 
const inspirecloud = new InspireCloud({ serviceId });

class Index extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      isSignUp:false
    };
  }
 
  getUser(){
    inspirecloud.run('getUser', {}).then(res => {
      if(res.user){
        console.log(res.user._id);
        this.setState({
          userID:res.user._id,
          isSignUp:true
        })
      }else{
        this.setState({
          isSignUp:false
        })
      }
    });
  }

  componentDidMount() {
    this.getUser()
  }
  getDatas(msg){
    //把子组件传递过来的值赋给this.state中的属性
    this.getUser()
    this.setState({
      isSignUp: msg,
    });
    
  }

  render(){
     const isSignUp = this.state.isSignUp;
     const user_id = this.state.userID
    
     let app;
      if (isSignUp && user_id !== undefined ) {
        app =  <App userID={user_id} /> ;
      }else {
        app = <Sign getdata={this.getDatas.bind(this)} /> ;
      }
      return(
        <div className='grid  sm:grid-cols-6 md:grid-cols-12  gap-2  p-4 h-screen '>
          {app}
          {console.log('现在的状态是:'+this.state.isSignUp)}
          <div className='hidden sm:flex sm:col-span-3 md:col-span-7 lg:col-span-8 bg-fill-2 p-4 '>
            123 
          </div>
        </div>
      );
      
  }
}



ReactDOM.render(

  <React.StrictMode>
    <Index/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
