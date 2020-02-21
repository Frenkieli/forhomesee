// axios統一包成一個物件
class AxiosItem{
  get(url){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'get',
        url: url,
        headers:{
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  post(url,data){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'post',
        url: url,
        data:data,
        headers:{
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  postForm(url,data,progressFunction){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'post',
        url: url,
        data:data,
        headers:{
          "Content-Type": "multipart/form-data",
          'authorization': 'Bearer ' + token_key
        },
        onUploadProgress:progressFunction
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  put(url,data){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'put',
        url: url,
        data:data,
        headers:{
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  putForm(url,data){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'put',
        url: url,
        data:data,
        headers:{
          "Content-Type": "multipart/form-data",
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  delete(url){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'delete',
        url: url,
        headers:{
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
  deleteFile(url,data){
    return new Promise(async function(resolve,reject){
      let result = await axios({
        method: 'delete',
        url: url,
        data:data,
        headers:{
          'authorization': 'Bearer ' + token_key,
        }
      })
      if(result.data == '時效到期請重新登入'){
        window.alert('本次的登入時效已過，正在自動登出');
        window.location.replace('/');
      }
      resolve(result);
    })
  }
}