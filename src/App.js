import React,{useState} from 'react';
import { atom, useAtom } from 'jotai'
// import cloudbase from "@cloudbase/js-sdk";
import './index.css';
import Toast from './toast';

const InspireCloud = require ('@byteinspire/js-sdk');
const serviceId = 'qc8uqz'; 
const inspirecloud = new InspireCloud({ serviceId });
const TokenAtom = atom('') 
const TokenTimeAtom = atom() 


//使用七牛云上传和储存
//https://developer.qiniu.com/kodo/sdk/javascript

const qiniu = require('qiniu-js')


const UploadFile = (props)=>{
  const [token,setToken] = useAtom(TokenAtom)
  const [tokenTime,setTokenTime] = useAtom(TokenTimeAtom)
  const [fileURL,setFileURL] = useState(props.fileURL.url)
  const handleFileChange = (event) =>{
    if(event.target.files[0]){
      const file = event.target.files[0];
      // props.uploadFile(file)
      getUploadTokenAndUpload(file.name,file,props.id)
      const reader  = new FileReader();
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        console.log(reader.result)
        setFileURL(reader.result)
      }
    }
    
  }
  const upload = (fileName,fileObj,gettoken,id) =>{
    const config = {
      useCdnDomain: true,
      region: qiniu.region.z2
    };

    var key = 'todo/'+ props.userID+'/' + Date.now() + fileName
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
          updatefile(props.id,res.key)
        }
        
      }
      // eslint-disable-next-line no-unused-vars
      const subscription = observable.subscribe(observer) // 上传开始
      
    })
  }
  const isTokenTimeOut = (time) =>{
    let now = Date.now()
    let deltaT = ((now - time)/1000)/60
    if(time === 0){
      return true
    }else if(deltaT >=  59){
      return true
    }else{
      return false
    }
  }
  const getUploadTokenAndUpload = (fileName,fileObj,id) =>{
    if(token === '' || isTokenTimeOut(tokenTime)){
    // if(token === '' ){
      console.log('我在这里')
      const fnName = 'qiniuUpload';
      inspirecloud.run(fnName, {  })
        .then(data => {
        // console.log(data.token)
        setToken(data.token) 
        setTokenTime(Date.now())
        upload(fileName,fileObj,data.token,id)
        })
        .catch(error => {
          console.log(error)
        // 处理异常结果
        });
      }else{
        console.log('我直接上传去了')
        upload(fileName,fileObj,token)
      }
  }
  const updatefile = (id,filename)=>{
    console.log('我开始工作了')
    const file ={
      "type":"img",
      "url":"http://io.iooslo.tech/"+filename
    }
    const update = [{"file" :file}]
    console.log(update)
    const fnName = 'update_item';
      inspirecloud.run(fnName, { id:id , update:update})
          .then(data => {
          console.log(data)
          Toast.success('更新图片成功')
          props.uploadFile(file)
          })
          .catch(error => {
            console.log(error)
          });
  }
  



  const inputClassName = 'w-full text-sm  text-text-3 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fill-4 file:text-text-3 hover:file:bg-fill-2'
  return(
    <div className='space-y-2'>
      <input 
          className={inputClassName}
          type="file"
          id="avatar" name="avatar"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
      >
      </input>
      <img src={fileURL} alt=""/>
    </div>
  )
}

class TodoItem extends React.Component{
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.state = {
      isChecked: this.props.isChecked,
      isOpen:false,
      fileURL:'',
      textAreaValue:''
    };
    this.handleChangeTextarea = this.handleChangeTextarea.bind(this);
  }
  handleDelete(){
    this.props.deleteItem(this.props.id)
  }
  handleChangeTextarea(event){
    this.setState({
      textAreaValue:event.target.value
    })
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
  componentDidMount(){
    let file = this.props.fileURL
    this.setState({
      fileURL:file
    })
  }
  handleOpen(){
    let state = this.state.isOpen
    this.setState({
      isOpen:!state
    })
  }
  uploadFile(file){
    this.setState({
      fileURL:file
    })
    console.log('我在listItem收到了File'+ file)
  }
  dateProcess(date){
  
   const NewDate = new Date(date.toString())
   const time = NewDate.getFullYear()+'-'+(NewDate.getMonth()+1)+'-'+NewDate.getDate()

   return time

  }
  render(){
    let item;
    if(this.state.isOpen){
      item =
       <li className={" p-2 space-y-2 rounded-md items-center "+(this.state.isChecked === true?"bg-fill-3":"bg-fill-4")}>
        <div className='flex space-x-2  items-center '>
        <input 
        onClick={this.handleFinish.bind(this)}  
        className="bg-fill-1 rounded-md  w-8 h-8 border-2 border-black appearance-none checked:bg-green-1 sm:w-4 sm:h-4  " 
        type="checkbox" 
        defaultChecked = {this.state.isChecked}
        />
        <div onClick={this.handleOpen.bind(this)} className="space-y-1 flex-1 sm:flex sm:space-x-1 items-baseline border-b-2 border-line-3 ">
          <p className={"text-sm sm:text-sm flex-1 " + (this.state.isChecked === true?"text-text-3  line-through":'text-text-5') }>{this.props.value}</p>
        </div>
        </div>    
    
        <div className={'space-y-2   flex-1' } >
          {/* <button 
            // onClick={this.handleDelete.bind(this)}
            className="btn  sm:text-sm">
            添加步骤
          </button> */}
          {/* <button 
            // onClick={this.handleDelete.bind(this)}
            className="bg-white sm:text-sm">
            添加图片
          </button>

          
          {this.fileInput.current.files[0].name} */}
          <UploadFile userID={this.props.userID} uploadFile={this.uploadFile.bind(this) } fileURL={this.state.fileURL} id = {this.props.id}/>
          <textarea  className=' w-full ' value={this.state.textAreaValue} onChange={this.handleChangeTextarea}> </textarea>
        </div>
      
      
       </li> 
    }else{
      item =
      <li className={" p-2 space-y-2 rounded-md items-center  "+(this.state.isChecked === true?"bg-fill-3":"bg-fill-4")}>
        <div className='flex space-x-2  items-center '>
          <input 
          onClick={this.handleFinish.bind(this)}  
          className="bg-fill-1 rounded-md  w-8 h-8 border-2 border-black appearance-none checked:bg-green-1 sm:w-4 sm:h-4  " 
          type="checkbox" 
          defaultChecked = {this.state.isChecked}
          />
          <div onClick={this.handleOpen.bind(this)} 
          className="space-y-1 flex-1 sm:flex sm:space-x-1 items-baseline ">
            <p className={"text-sm sm:text-sm flex-1 " + (this.state.isChecked === true?"text-text-3  line-through":'text-text-5') }>{this.props.value}</p>
            <p className="text-xs text-text-3 ">{this.dateProcess(this.props.date)}</p>
          </div>
          <button 
            onClick={this.handleDelete.bind(this)}
            className="bg-white w-8 h-8 sm:w-4 sm:h-4 sm:text-sm">
            X
          </button>     
        </div>
        
        
      </li> 
    }
    return(
      <div>
        {item}
      </div>
      
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
        <TodoItem 
          value = {item.context}
          date = {item.createdAt}
          fileURL = {item.file}
          finishItem = {this.finishItem.bind(this)}
          key = {item._id}
          id = {item._id}
          userID={this.props.userID}
          isChecked = {item.done}
          deleteItem ={this.deleteItem.bind(this)}
        />
      );
      return(
          <div className=''> 
              <ul className='bg-fill-2 p-2 space-y-4 rounded-md'>
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
          className="input flex-1  " 
          placeholder="请输入接下来的事儿" 
          value={this.state.value} 
          // onChange={() => this.props.onChange()}  
          onChange={this.handleChange}  
          />
        </label>
        <input className="btn w-10 h-10" type="submit" value="+" />
      </form>
        
      )
  }
}

class App extends React.Component{

  constructor(props) {
    super(props);
    // this.upload = this.upload.bind(this)
    this.state = {
      list:[],
      todo_item:[],
      isSignUp:false,
      token:"",
      tokenTime:'',
      user_id:''
    };
  }
  componentDidMount() {
    // const a = (this.state.todo_item.length === 0)
    // console.log(a)
    // const b = this.props.userID
    // console.log(b)
    // const c = a && b
    // console.log(c)
    // if(this.state.todo_item.length === 0 && this.props.userID ){
      
    // }

    this.setState({
      user_id : this.props.userID
    })

    this.findtodoitem(this.props.userID)
    
    console.log('我在运行')
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
    const itemIndex = list.findIndex(item => item._id === id)
    const fileURL = (list[itemIndex].file.url?list[itemIndex].file.url:'nofile')
   
    list.splice(itemIndex,1,);
    // console.log(list)
    this.setState({
      todo_item:list,
      list:list,
    })  
    
    const fnName = 'delete_item';
      inspirecloud.run(fnName, { id:id ,fileURL:fileURL})
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
    const setdata = (result)=>{
      this.setState({
        todo_item:result,
        list:result,
      })
    }
    fetch('https://qc8uqz.api.cloudendpoint.cn/find_item',{
      method:"POST",
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify({user_id: user_id,})
    })
      .then(res=>res.json())
      .then(
        json=>{
          setdata(json.result)
        })
  }
  
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
        userID={this.props.userID}
      />
    );
  }
  render(){
    
      return(
          <div className='  space-y-3 col-span-12  sm:col-span-3 md:col-span-7 lg:col-span-8' >
          {this.renderInputer()}
          {this.renderList()}
          </div>  
      );
      
  }
}

export default App;
