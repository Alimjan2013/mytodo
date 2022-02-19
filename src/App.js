import React from 'react';
// import cloudbase from "@cloudbase/js-sdk";
import './index.css';

const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; // 替换成你的 serviceId，可在后台「设置」页面获取
const inspirecloud = new InspireCloud({ serviceId });






var localCounter = 3;

class ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.state = {isChecked: false};
  }

  handleDelete(){
    this.props.deleteItem(this.props.id)
  }
  handleFinish(){
    var id = this.props.id
    var isChecked = this.state.isChecked
    var msg = [id,isChecked]
    // console.log(msg)
    if (this.state.isChecked === false){
      this.setState({
        isChecked:true
      })
      this.props.finishItem(msg)
    }else{
      this.setState({
        isChecked:false
      })
      this.props.finishItem(msg)
    }
  }
  render(){
    return(
      <li className={"flex p-2 space-x-2 border-b-2 items-center "+(this.state.isChecked === true?"bg-gray-200":"bg-gray-100")}>
        <input 
        onClick={this.handleFinish.bind(this)}  
        className="bg-white w-8 h-8 border-2 border-black appearance-none checked:bg-green-400 sm:w-4 sm:h-4  " 
        type="checkbox" 
        
        />
        <div className="space-y-1 flex-1 sm:flex sm:space-x-1 items-baseline">
          <p className={"text-xs sm:text-sm flex-1 " + (this.state.isChecked === true?"text-gray-400":'') }>{this.props.value}</p>
          <p className="text-xs text-gray-400">{this.props.date}</p>
        </div>
        <button 
          onClick={this.handleDelete.bind(this)}
          className="bg-white w-8 h-8 sm:w-4 sm:h-4 sm:text-sm">
          X
        </button>     
      </li>
      
    );
  }
}
class List extends React.Component{
  handleClick(){
    console.log('这里是handleClick')
  }
  deleteItem(index){
    // console.log('删除的列表序号为：'+ index)
    this.props.deleteItem(index)
  }
  finishItem(index){
      // console.log('完成的列表序号为：'+ index)
      this.props.finishItem(index)
  }
  getList(){
    const list = this.props.list
    return(list);
  }
  render(){
      const list = this.getList();
      // console.log(list)
      const listItems = list.map((item) => 
      
        <ListItem 
                 value = {item.value}
                 date = {item.date}
                 finishItem = {this.finishItem.bind(this)}
                 key = {item.id}
                 id = {item.id}
                 deleteItem ={this.deleteItem.bind(this)}
        />
      );
      return(
          <div className='bg-gray-300 p-2 space-y-2'> 
              <ul className=''>
                  {listItems}
              </ul>
          </div>
          
      );
      
  }
}
class Inputer extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    if (this.state.value === ''){
      event.preventDefault();
      return
    }else{
      this.props.addItem(this.state.value);
      event.preventDefault();
      this.setState((state) => {
      // 重要：在更新的时候读取 `state`，而不是 `this.state`。
        return {value: ''}
      });
    }
    
  }
  

  render(){
      return(
        <form 
        className="bg-gray-300 rounded-sm h-11 flex items-center p-2 space-x-2" 
        // onSubmit={() => this.props.onSubmit(this.event)}
        onSubmit={this.handleSubmit}
        >
       
        <label className="flex-1 flex" >
          <input 
          type="text" 
          className="h-7 rounded-sm flex-1 p-2 " 
          placeholder="请输入接下来的事儿" 
          value={this.state.value} 
          // onChange={() => this.props.onChange()}  
          onChange={this.handleChange}  
          />
        </label>
        <input className="w-7 h-7 bg-white" type="submit" value="+" />
      </form>
        
      )
  }
}


class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      list:[{value:'hello',id:'1',date:'2022-1-22'},
            {value:'hii??',id:'2',date:'2022-1-22'}],
      isSignUp:false
    };
  }
  getdate(){
    var nowdate = new Date();
    var year = nowdate.getFullYear();
    var month = nowdate.getMonth() + 1;
    var date = nowdate.getDate();
    var now = year+'-'+ month + '-'+date ;
    return(
      now
    )
  }
  deleteItem(id){
    const list = [...this.state.list];
    list.splice(list.findIndex(item => item.id === id),1,);
    // console.log(list)
    this.setState({
      list:list
    });
  }
  finishItem(id){
    // console.log('收到了来自 List的完成index：'+id[0])
    if(id[1] === false){
      const list = [...this.state.list];
      let index = list.findIndex(item => item.id[0] === id[0])
      list.splice(list.length-1,0,list.splice(index,1)[0])  
      // console.log(list)
      this.setState({
        list:list
      });
    }else{
      const list = [...this.state.list];
      let index = list.findIndex(item => item.id[0] === id[0])
      list.splice(0,0,list.splice(index,1)[0])  
      // console.log(list)
      this.setState({
        list:list
      });
      // console.log('换成打开的状态了')
    }
    

  }
  addItem(msg){
    //把子组件传递过来的值赋给this.state中的属性
    const list = this.state.list
    const date = this.getdate()
    let id = localCounter++
    list.unshift(
      {
        value:msg,
        id: id.toString(),
        date: date
      }
      
      )
    this.setState({
        list:list
    });
  }
 


isLogin(){
  inspirecloud.user.isLogin().then(isLogin => {
    if (!isLogin) {
      // 未登录，执行登录操作
      console.log('您还没有登录，请登录')
      // inspirecloud.user.loginByOAuth({
      //   platform: 'github', // OAuth 认证的平台
      //   mode: 'redirect', // 选择重定向模式，默认为 redirect
      //   redirectURL: 'https://my.domain/someRedirectPage' // 这里是授权之后重定向的页面地址
      // });
    } else {
      console.log('您已登录，可以正常使用');
      this.setState({
        isSignUp:true
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

  renderInputer() {
    return (
    <Inputer
      addItem={this.addItem.bind(this)}
     />
     );
  }

  renderList(){
    return(
      <List
        list = {this.state.list}
        deleteItem = {this.deleteItem.bind(this)}
        finishItem = {this.finishItem.bind(this)}
      />
    );
  }
  render(){
      return(
          <div className='  space-y-3 col-span-12 sm:col-span-3 md:col-span-5 lg:md:col-span-4' >
          
          {this.renderInputer()}
          {this.renderList()}
          </div>  
      );
      
  }
}
export default App;
