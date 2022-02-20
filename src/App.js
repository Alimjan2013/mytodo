import React from 'react';
// import cloudbase from "@cloudbase/js-sdk";
import './index.css';

const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; 
const inspirecloud = new InspireCloud({ serviceId });

//使用七牛云上传和储存
//https://developer.qiniu.com/kodo/sdk/javascript

const qiniu = require('qiniu-js')


  




var localCounter = 3;
class Upload extends React.Component{

  constructor(props){
    super(props);
    this.handleFileChange = this.handleFileChange.bind(this)
    this.state = {
      fileURL:'',
      token:''
    };
  }
  
    

  handleFileChange(e){

    const file = e.target.files[0];
    this.props.uploadFile(file)
    // this.getUploadTokenAndUpload(fileName,file)
    const reader  = new FileReader();
    // const setState = this.setState()
    let imgURLBase64 = reader.readAsDataURL(file)
    // let imageURL = reader.readAsText(file)
    console.log(file)

    reader.onload = (e) => {
      console.log(imgURLBase64)
      console.log(reader.result)
      
      this.setState({
        fileURL:reader.result
      })
    }
    
  }
  render(){
    return(
      <div>
        <input type="file"
            id="avatar" name="avatar"
            accept="image/png, image/jpeg"
            ref={this.fileInput}
            onChange={this.handleFileChange}
            >
          </input>
          <img src={this.state.fileURL} alt=""/>
      </div>
    );
  }

}

class ListItem extends React.Component{
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      isChecked: false,
      isOpen:false,
      fileURL:''
    };
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
  handleOpen(){
    let state = this.state.isOpen
    this.setState({
      isOpen:!state
    })
  }
  uploadFile(file){
    console.log('我在listItem收到了File'+ file)
    var id = this.props.id
    console.log(id)
    this.props.uploadFile(file,id)
  }
  render(){
    return(
      <li className={" p-2 space-y-2  border-b-2 items-center "+(this.state.isChecked === true?"bg-gray-200":"bg-gray-100")}>
        <div
         className='flex space-x-2'
          
         >
          <input 
          onClick={this.handleFinish.bind(this)}  
          className="bg-white w-8 h-8 border-2 border-black appearance-none checked:bg-green-400 sm:w-4 sm:h-4  " 
          type="checkbox" 
          
          />
          <div onClick={this.handleOpen.bind(this)} 
          className="space-y-1 flex-1 sm:flex sm:space-x-1 items-baseline">
            <p className={"text-xs sm:text-sm flex-1 " + (this.state.isChecked === true?"text-gray-400":'') }>{this.props.value}</p>
            <p className="text-xs text-gray-400">{this.props.date}</p>
          </div>
          <button 
            onClick={this.handleDelete.bind(this)}
            className="bg-white w-8 h-8 sm:w-4 sm:h-4 sm:text-sm">
            X
          </button>     
        </div>
        <div className={'space-y-2  flex-col  ' + (this.state.isOpen === true?"flex":"hidden") } >
          <button 
            // onClick={this.handleDelete.bind(this)}
            className="bg-white  sm:text-sm">
            添加步骤
          </button>
          {/* <button 
            // onClick={this.handleDelete.bind(this)}
            className="bg-white sm:text-sm">
            添加图片
          </button> */}
          <Upload
            uploadFile ={this.uploadFile.bind(this)}
          />
          {/* {this.fileInput.current.files[0].name} */}
          <textarea> 详细内容</textarea>

        </div>
        
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
  uploadFile(file,id){
    // console.log('完成的列表序号为：'+ index)
    console.log('我在list收到了File'+ file)

    this.props.uploadFile(file,id)
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
                 uploadFile ={this.uploadFile.bind(this)}
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
    this.upload = this.upload.bind(this)
    this.state = {
      list:[{value:'hello',id:'1',date:'2022-1-22',fileURL:''},
            {value:'hii??',id:'2',date:'2022-1-22',fileURL:''}],
      isSignUp:false,
      token:"",
      tokenTime:''
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
    // todo
    //      4.确定是哪一个item的文件

  uploadFile(file,id){
    console.log('file 上传函数被运行')
    console.log(file)
    this.getUploadTokenAndUpload(file.name,file,id)
  }
  updateFile(fileName,id){
    console.log('我进来了')
    const list = [...this.state.list];
    console.log(list)
    
    let index = list.findIndex(item => item.id === id)
    console.log(index)
    list[index].fileURL = 'http://io.subat.cn/'+ fileName
    this.setState({
      list:list
    });

  }
  upload(fileName,fileObj,gettoken,id){
    const config = {
      useCdnDomain: true,
      region: qiniu.region.z2
    };
    var key = Date.now() + fileName
    // key 是 需要保存的名称
    const putExtra = {
      
    };
    
    var token = gettoken
    //需要使用云函数获取

    var file = fileObj
    // 通过表单获取地址

    const options = {
      quality: 0.92,
      noCompressIfLarger: true,
      maxWidth: 1000,
      // maxHeight: 618
    }
    
    
    qiniu.compressImage(file, options).then(data => {
      let outsidethis = this
      const observable = qiniu.upload(data.dist, key, token, putExtra, config)
      const observer = {
        next(res){
          console.log(res)
        },
        error(err){
          console.log(err)
          
        },
        complete(res){
          console.log(res)
          outsidethis.updateFile(key,id)
          
        }
      }
      // eslint-disable-next-line no-unused-vars
      const subscription = observable.subscribe(observer) // 上传开始
      
    })
    
    
  }
  isTokenTimeOut(){
    let now = Date.now()
    let deltaT = ((now - this.state.tokenTime)/1000)/60
    if(this.state.tokenTime === 0){
      return true
    }else if(deltaT >=  59){
      return true
    }else{
      return false
    }
  }
  getUploadTokenAndUpload(fileName,fileObj,id){
    var token = this.state.token
    if(token === '' && this.isTokenTimeOut()){
    // if(token === '' ){
      const fnName = 'qiniuUpload';
      inspirecloud.run(fnName, {  })
        .then(data => {
        // console.log(data.token)
        this.setState({
          token:data.token,
          tokenTime:Date.now()
        })
        this.upload(fileName,fileObj,data.token,id)
        })
        .catch(error => {
          console.log(error)
        // 处理异常结果
        });
      }else{
        this.upload(fileName,fileObj,token)
      }
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
        uploadFile = {this.uploadFile.bind(this)}
        finishItem = {this.finishItem.bind(this)}
        file = {this.state.file}
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
