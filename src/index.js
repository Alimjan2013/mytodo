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
  
  isLogin() {
    inspirecloud.user.isLogin().then(isLogin => {
      if (!isLogin) {
        
        console.log('您还没有登录，请登录')
        
      } else {
        console.log('您已登录，可以正常使用');
        this.setState({
          isSignUp: true
        });
      }
    });
  }
  needLogin(){
    if(this.state.isSignUp === true){
      return false
    }else{
      this.isLogin()
      return true
    }
  }
  getDatas(msg){
    //把子组件传递过来的值赋给this.state中的属性
    this.setState({
      isSignUp: msg,
    });
  }

  render(){
      return(
        <div className='grid  sm:grid-cols-6 md:grid-cols-12  gap-2  p-4 h-screen '>
          {this.needLogin() === true ? <Sign getdata={this.getDatas.bind(this)} /> : <App /> } 
          {/* <Sign  getdata={this.getDatas.bind(this)}/> */}
          {/* <App /> */}
          {console.log('现在的状态是:'+this.state.isSignUp)}
          <div className='hidden sm:flex sm:col-span-3 md:col-span-7 lg:col-span-8 bg-gray-400 p-4 '>
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
