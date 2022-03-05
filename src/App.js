import React from 'react';
// import cloudbase from "@cloudbase/js-sdk";
import './index.css';
import Toast from './toast';

const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; 
const inspirecloud = new InspireCloud({ serviceId });

//使用七牛云上传和储存
//https://developer.qiniu.com/kodo/sdk/javascript

const qiniu = require('qiniu-js')


  





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
      isChecked: this.props.isChecked,
      isOpen:false,
      fileURL:''
    };
  }

  handleDelete(){
    this.props.deleteItem(this.props.id)
  }
  
  handleFinish(){
    var id = this.props.id
    var done = this.state.isChecked
    var msg = [id,done]
    console.log(msg)
    // console.log(msg)
    if (this.state.isChecked === false){
      this.setState({
        isChecked:true
      })
      msg[1] = true
      this.props.finishItem(msg)
    }else{
      this.setState({
        isChecked:false
      })
      msg[1] = false
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
          checked = {this.state.isChecked}
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
                 value = {item.context}
                 date = {item.createdAt}
                 finishItem = {this.finishItem.bind(this)}
                 key = {item._id}
                 id = {item._id}
                 isChecked = {item.done}
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
      list:[],
      todo_item:[],
      isSignUp:false,
      token:"",
      tokenTime:'',
      // user_id:'62020c725fc68c020d7fad03'
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
    //从本地删除
    const list = [...this.state.list];
    list.splice(list.findIndex(item => item._id === id),1,);
    // console.log(list)
    this.setState({
      todo_item:list,
      list:list,
    })  
    const user_id = this.state.user_id
    const fnName = 'delete_item';
      inspirecloud.run(fnName, { user_id: user_id,id:id })
          .then(data => {
          console.log(data)
          Toast.success('删除成功')
          })
          .catch(error => {
            console.log(error)
          });
  }
  finishItem(id){
    const list = [...this.state.list];
    let index = list.findIndex(item => item._id === id[0])
    console.log(id[1])
    list[index].done = !id[1]
    
    console.log(list[index].done)
    
    this.setState({
          list:list
    });
    const fnName = 'update_item';
      inspirecloud.run(fnName, { id:id[0] , update:[{done:id[1]}] })
          .then(data => {
          console.log(data)
          Toast.success('删除成功')
          })
          .catch(error => {
            console.log(error)
          });

  }
  addItem(msg){
    //把子组件传递过来的值赋给this.state中的属性
    const context = msg
    const user_id = this.state.user_id
    const done = false
    const fnName = 'creat_item';
      inspirecloud.run(fnName, { user_id: user_id,done:done,context:context ,file:'' })
          .then(data => {
          console.log(data)
          this.setState({
            todo_item:data.list,
            list:data.list,
          })          
          })
          .catch(error => {
            console.log(error)
          // 处理异常结果
          });


    // const list = this.state.list
    // const date = this.getdate()
    // let id = localCounter++
    // list.unshift(
    //   {
    //     value:msg,
    //     id: id.toString(),
    //     date: date
    //   }
      
    //   )
    // this.setState({
    //     list:list
    // });
  }
  findtodoitem(user_id){
    const fnName = 'find_item';
      inspirecloud.run(fnName, { user_id: user_id })
          .then(data => {
          console.log(data)
          this.setState({
            todo_item:data.result,
            list:data.result,
          })          
          })
          .catch(error => {
            console.log(error)
          // 处理异常结果
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
  componentDidMount() {
    if(this.state.todo_item.length === 0){
      this.findtodoitem(this.props.userId)
    }
    console.log('我在运行')
    this.setState({
      user_id : this.props.userId
    })
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
