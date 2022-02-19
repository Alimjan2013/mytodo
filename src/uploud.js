//使用七牛云上传和储存
//https://developer.qiniu.com/kodo/sdk/javascript

const qiniu = require('qiniu-js')

const config = {
    useCdnDomain: true,
    region: qiniu.region.z2
  };
  var key = 'nioce'
  const putExtra = {
    
  };
  
  var token = 'fENkK7ws3hLgIx7lu87zXyEVdLX48bYSfwBh7bD3:oZ5V47VqhZoOcZq-gacrRLs2BPs=:eyJzY29wZSI6InRlbXBvcmFyeS1hbGltIiwiZGVhZGxpbmUiOjE2NDQzNzM0MzF9'
//   需要使用云函数获取
//   https://developer.qiniu.com/kodo/1289/nodejs#simple-uptoken
// module.exports = async function(params, context) {
//     console.log(params);
//     var qiniu = require("qiniu");
//     var accessKey = 'fENkK7ws3hLgIx7lu87zXyEVdLX48bYSfwBh7bD3';
//     var secretKey = '3aJN4_ybobqbdxC1Hw7MEOPt12LDTJcx9ndAc2nj';
//     var bucket = 'temporary-alim'
//     //构建bucketmanager对象
//     var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
//     var options = {
//       scope: bucket,
//     };
//     var putPolicy = new qiniu.rs.PutPolicy(options);
//     var uploadToken=putPolicy.uploadToken(mac);
//     console.log(uploadToken)
  
//     // uploadFile(token, key, filePath);
//     return {
//       test: err,
//     };
//   }

  var file = './build.zip'
  const observable = qiniu.upload(file, key, token, putExtra, config)
  const observer = {
    next(res){
      console.log(res)
    },
    error(err){
      console.log(err)
      
    },
    complete(res){
      console.log(res)
    
    }
  }
  const subscription = observable.subscribe(observer)
  