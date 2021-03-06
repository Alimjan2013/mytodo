// import cloudbase from "@cloudbase/js-sdk";
import React from 'react';
import './index.css';
const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; // 替换成你的 serviceId，可在后台「设置」页面获取
const inspirecloud = new InspireCloud({ serviceId });








//获取手机号
  class SignUp extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        value:'',
        phoneNumber:''
      };
      this.handleGetPhoneNumber = this.handleGetPhoneNumber.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      // this.getMsgForLogin = this.getMsgForLogin.bind(this);
      // this.signUp = this.signUp.bind(this);
    }
    
    pushPhoneNumber(){
      console.log('push Number')
      let data = {
        phoneNumber:this.state.phoneNumber,
        isgetPhoneNumber:true
      }
      this.props.getdata(data);
    }
    
    handleGetPhoneNumber(event) {
      this.setState(
        {
         phoneNumber:event.target.value}
        );

    }
    
    handleSubmit(event) {
      if ( this.state.phoneNumber === ''){
        event.preventDefault();
        return
      }else{
        event.preventDefault();
        this.pushPhoneNumber();
      }
      
    }
    
    
  
    render(){
        return(
          
          <form 
          className=" rounded-sm  flex  flex-col items-center  space-y-2" 
          onSubmit={this.handleSubmit}
          >
         
         
            
            <input 
            type="text" 
            className="input w-full" 
            placeholder="请输入手机号" 
            value={this.state.phoneNumber} 
            // onChange={() => this.props.onChange()}  
            onChange={this.handleGetPhoneNumber}  
            />
          
          <button disabled={this.state.phoneNumber ===""?true:false } className="btn w-full" type="submit" value="继续" > 
          继续
          </button>
        </form>
          
        )
    }
  }

// 登录
  class SignIn extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        value:'',
        phoneNumber:this.props.phoneNumber,
        code:'',
        isgetCode:false,
        count:0,

      };
      this.handleGetPhoneNumber = this.handleGetPhoneNumber.bind(this);
      this.handleGetCode = this.handleGetCode.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      // this.getMsgForLogin = this.getMsgForLogin.bind(this);
    }
    
    
   

    
    signUp(){
      var phoneNumber = this.state.phoneNumber
      const fnName = 'login';
      inspirecloud.run(fnName, { phoneNumber: phoneNumber })
          .then(data => {
          console.log(data)
          this.setState({
            isgetCode:true,
            count:60
          })
          this.tick()
          
          })
          .catch(error => {
            console.log(error)
          // 处理异常结果
          });
      
    }

    getPhoneNumber(){
      this.setState({
        phoneNumber:this.props.phoneNumber
      });
    }
    handleGetPhoneNumber() {
      this.setState(
        {
          phoneNumber:this.props.phoneNumber}
        );
    }
    handleGetCode(event) {
      this.setState(
        {
         code:event.target.value}
        );

      this.props.getcode(event.target.value);

    }
    handleSubmit(event) {
      if ( this.state.phoneNumber === ''){
        event.preventDefault();
        return
      }else{
        event.preventDefault();
        this.signUp();
      }
      
    }
    
    tick() {
      this.setState(state => ({
        count: state.count - 1
      }));
      if(this.state.count === 0){
        this.setState({
          isgetCode:false
        })
      }
    }
  
    componentDidMount() {
      if(this.state.count >= 0){
        this.interval = setInterval(() => this.tick(), 1000);
      } 
      
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    
  
    render(){
        return(
          
          <form 
          className=" rounded-sm  flex flex-col items-center space-y-2" 
          onSubmit={this.handleSubmit}
          >
          {/* {this.getPhoneNumber()} */}
          
            <input 
            type="text" 
            className="input w-full " 
            placeholder="请输入手机号" 
            value={this.state.phoneNumber} 
            // onChange={() => this.props.onChange()}  
            onChange={()=>this.getPhoneNumber()}  
            />
            <div className='flex  w-full space-x-2'>
              <input 
              type="text" 
              className="input w-full" 
              placeholder="请输入验证码" 
              value={this.state.Code} 
              // onChange={() => this.props.onChange()}  
              onChange={this.handleGetCode}  
              
              />
              <button disabled={this.state.isgetCode ? true:false }  className="btn w-full  " type="submit" value="获取验证码" >
              {this.state.isgetCode ? (this.state.count+'s'):'获取验证码' }
              </button>
            </div>
            
        </form>
          
        )
    }
  }
//登录页面
  class Sign extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
       phoneNumber:'',
       code:'',
       isgetPhoneNumber:false
      };
    }
    getDatas(msg){
      //把子组件传递过来的值赋给this.state中的属性
      this.setState({
          phoneNumber: msg.phoneNumber,
          isgetPhoneNumber:msg.isgetPhoneNumber
      });
    }
    getCode(code){
      this.setState({
        code:code
      });
    }
    onClick(){
      this.signIn()
    }
    signIn(){
        
      var phoneNumber = this.state.phoneNumber
      var code = this.state.code
      const fnName = 'denglu';
      inspirecloud.run(fnName, { phoneNumber: phoneNumber ,code:code})
        .then(data => {
        console.log(data)
        this.props.getdata(true)
        })
        .catch(error => {
          console.log(error)

        // 处理异常结果
        });
        
    }
   
    render(){
        return(
            <div className=' p-4 space-y-4 sm:col-span-3 md:col-span-5 lg:col-span-4 bg-fill-2 h-full ' >
            <p className='text-2xl text-center  '>
              欢迎回来
            </p>
            {this.state.isgetPhoneNumber === true ? <SignIn getcode={this.getCode.bind(this)}  phoneNumber= {this.state.phoneNumber}/> : <SignUp getdata={this.getDatas.bind(this)} /> } 
            {this.state.isgetPhoneNumber === true ?
              <div className='space-y-2'>
                <button disabled={this.state.code ===""?true:false } onClick={()=>this.onClick()} className='btn w-full'>
                  登录
                </button>
                <p className='text-sm text-text-3  '>
                *未注册的手机号验证通过后将自动注册
                </p>
              </div>
              
              


              : ' ' } 

            
            </div>
            
        );
        
    }
  }


export default Sign;

