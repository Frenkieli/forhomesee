function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

// 方變自己使用的function

function AEA(elementBox,elementArray){
  elementArray.forEach(v=>{
    elementBox.appendChild(v);
  })
  return elementBox;
}
function AE(elementBox,element){
  elementBox.appendChild(element);
  return elementBox;
}
function CE(elementType,elementClassName,elementId){
  let element = document.createElement(elementType);
  if(elementClassName) element.className = elementClassName;
  if(elementId) element.id = elementId;
  return element;
}

function $id(elementName) {
  return document.getElementById(elementName)
}
function $qs(elementName) {
  return document.querySelector(elementName)
}

// 方變自己使用的function

class SocketItem{
  constructor(url){
    this.url = url;
    this.socket;
  }
  init(){
    this.socket = io.connect('ws://' + this.url, { query: "name=" + loginId });
    this.socket.on('message',this.onMessage);
    this.socket.on('notice',this.onNotice);
    this.socket.on('deleteNotice',this.onDeleteNotice);
    this.socket.on('error',this.onError);
    this.socket.on('medical_update',this.onMedicalUpdate);
  }
  Send(cmd,data){
    this.socket.emit(cmd, data);
  }
  onMessage(data){
    console.log(data,'onMessage');
  }
  onNotice(data){
    popMessage.ok(data.str,3000);
  }
  onError(data){
    popMessage.err(data.str,3000);
  }
  onDeleteNotice(data){
    let select = $id('medical_info_list');
    if(select.value == data){
      select.value = 'false';
      medical.infoListChange('false');
    }
    console.log(select.options);
    for(let i = 0; i < select.options.length ; i++){
      if(select.options[i].value == data){
        select.options[i].remove();
      }
    }
  }
  onMedicalUpdate(data){
    $id('medical_info_list').appendChild(new Option(data.id + ' - ' + data.name , data.id));
  }
}

class Medical{
  constructor(){
    this.medicalId; //目前是哪一位病患
    this.data; //儲存目前的檔案清單
    this.timePicker; //這是套件
    // 時間等計算用
    this.fileList;
    this.playList;
    this.musicplaylist;
    this.musicplayTimeout = [];  //清空timeout
    this.playListTime;
    this.total;
    this.nowTime;
    this.axiosItem;
    // 儲存和清空計時器用的
    this.playStatus;
    this.progress_bar_button_even = false; //這個是判斷是否是按鈕事件用的
    // 計算目前的畫面
    this.viewNow = -1;
    this.musicNow = -1;
  }
  init(){
    this.timePicker = new Lightpick({
      field: document.getElementById('medical_info_start_time'),
      // secondField: document.getElementById('medical_info_end_time'),
      // repick: true,
      singleDate: false,
      format: 'YYYY年MM月DD日',
      startDate: moment().startOf('month').add(7, 'day'),
      endDate: moment().add(1, 'month').endOf('month').subtract(7, 'day'),
      onSelect: function(start, end){
          // var str = '';
          // str += start ? start.format('Do MMMM YYYY') + ' to ' : '';
          // str += end ? end.format('Do MMMM YYYY') : '...';
          // console.log(str,'light',start.valueOf(),end.valueOf(),moment())
          // 這不用
      }
    });
  }
  // 上傳事件===============================================
  medicalPatientPhotoUpdate(e){
    updataImgAndPrint(e,$id('medical_patient_photo'));
  }
  // 上傳事件===============================================
  //按鈕事件================================================
  getMedicalData(){
    let _id     = $id('medical_info_id').value;
    let name    = $id('medical_info_name').value;
    let cardId  = $id('medical_info_location_card_id').value;
    let sex     = $id('medical_info_sex').checked ? 1 : 0;
    let data = {
      _id         : _id,
      name        : name,
      sex         : sex,
      cardId      : cardId,
      startTime   : this.timePicker.getStartDate().valueOf(),
      endTime     : this.timePicker.getEndDate().valueOf()
    }
    return data;
  }
  async medicalInfoCreate(e){
    // formData.append('_id'       ,$id('medical_info_id').value);
    // formData.append('name'      ,$id('medical_info_name').value);
    // formData.append('startTime' ,this.timePicker._opts.startDate.valueOf());
    // formData.append('endTime'   ,this.timePicker._opts.endDate.valueOf());
    let _id     = $id('medical_info_id').value;
    let name    = $id('medical_info_name').value;
    if(_id.length!=0 && name.length!=0){
      let data = this.getMedicalData();
      let result = await axiosItem.put('/medicalrecords',data);
      let file     = $id('medical_patient_photo_update').files;
      if(file.length !=0 ){
        let formData = new FormData();
        formData.append('personalPic',file[0]);
        let result = await axiosItem.putForm('/medicalrecords/personalPicture/' + _id , formData);
        $id('medical_patient_photo_update').value = '';
        console.log(result.data);
      }
    }else{
      popMessage.err('病歷號或名稱未輸入',2000);
    }
  }
  async medicalInfoEdit (e){
    let _id     = $id('medical_info_id').value;
    let name    = $id('medical_info_name').value;
    if(_id.length!=0 && name.length!=0){
      let data = this.getMedicalData();
      let result = await axiosItem.post('/medicalrecords/' + _id,data);
      let file     = $id('medical_patient_photo_update').files;
      if(file.length !=0 ){
        let formData = new FormData();
        formData.append('personalPic',file[0]);
        let result = await axiosItem.putForm('/medicalrecords/personalPicture/' + _id , formData);
        $id('medical_patient_photo_update').value = '';
        console.log(result.data);
      }
    }else{
      popMessage.err('病歷號或名稱未輸入',2000);
    }
  }
  async medicalInfoDelete (e){
    let _id     = $id('medical_info_list').value;
    let result = await axiosItem.delete('/medicalrecords/' + _id);
  }
  // 刪除檔案
  async fileDelete(e){
    // console.log('這是什麼')
    let parentElement = e.target.parentNode.parentNode.parentNode;
    let listEditList = parentElement.querySelector('.list_edit_list');
    // console.log(parentElement.querySelector('.list_edit_list').value);
    let data = {
      id:$id('medical_info_list').value,
      deleteName:parentElement.querySelector('.list_edit_list').value
    }
    let result = await axiosItem.deleteFile('/updata',data);
    if(result){
      listEditList.remove(listEditList.selectedIndex);
      if(listEditList.querySelector('option').length == 0){
        listEditList.appendChild(new Option('沒有項目',none));
      }
    }
  }
  // 上傳檔案按鈕
  async editUpdateAreaSubmit(e){
    function progressEvent(e){
      var complete = (e.loaded / e.total * 100 | 0) + '%';
      $id('progressUpdateColor').style.width = complete;
      if(e.loaded == e.total){
        setTimeout(() => {
          $id('progressUpdate').style.opacity = 0;
          setTimeout(() => {
            $id('progressUpdate').remove();
          }, 200);
        }, 200);

      }
    }
    let data = new FormData();
    let updataFile = $id("edit_update_area_file").files;
    for (let i = 0; i < updataFile.length; i++) {
      console.log(updataFile[i],'檔案')
      if(updataFile[i].name.match(/\.(jpg|jpeg|png|mp4|ogg|mp3)$/)){
        data.append("file", updataFile[i]);
      }
    }
    let progressUpdate = CE('div','progressUpdate','progressUpdate');
    let progressUpdateColor = CE('div','progressUpdateColor','progressUpdateColor');
    AE(progressUpdate,progressUpdateColor);
    AE(document.getElementsByTagName('body')[0],progressUpdate);
    let result = await axiosItem.postForm('/updata/' + $id('medical_info_list').value,data ,progressEvent);
    let okDataName = result.data.okDataName;
    // this.appendRecord(result, url + $id('medical_info_list').value + '/')
    console.log(result);
    document.getElementsByClassName('edit_update_area_file')[0].innerText = '未選擇任何檔案';
    // let errorData = result.data.errorDataName;
    // if(errorData.length != 0){
    //   let err ='';
    //   for(let i = 0 ; i <(errorData.length > 4 ? 4 : errorData.length) ; i++){
    //     err += errorData[i] + '、';
    //   }
    //   err += '共'+ result.data.errorDataName.length + '個檔案格式錯誤';
    //   popMessage.err(err,3000)
    // }
    this.fileList.img = arrayUnique(this.fileList.img.concat(okDataName.img));
    this.fileList.music = arrayUnique(this.fileList.music.concat(okDataName.music));
    this.fileList.video = arrayUnique(this.fileList.video.concat(okDataName.video));
    this.appendRecord();
  }
  // 插入右邊章節
  imgListEditInsertImg(e){
    let obj = $qs('.view_obj.pick').id;
    this.playList[this.getPlaylistInfoIndex()][obj] = $id('img_list_img_now').src.split('userData/')[1];
    let element = $qs('.view_obj.pick');
    element.innerHTML = '';
    element.appendChild($id('img_list_img_now').cloneNode(true));
  }
  videoListEditInsertVideo(e){
    let obj = $qs('.view_obj.pick').id;
    this.playList[this.getPlaylistInfoIndex()][obj] = $id('video_list_video_now').querySelector('source').src.split('userData/')[1];
    let element = $qs('.view_obj.pick');
    element.innerHTML = '';
    element.appendChild($id('video_list_video_now').cloneNode(true));
  }
  musicListAudioInsertAudio(e){
    let music = $id('music_list_edit_list').value;
    let playTime = $id('music_list_edit_time').value;
    let insertTime = $id('music_list_edit_intime').value;
    if(music.length == 0 || playTime.length ==0){
      popMessage.err('請輸入時間' , '2000')
    }else if((Number(playTime) + Number(insertTime)) > this.total){
      popMessage.err('超出總播放時間' , '2000')
    }else{
      let musicData = {
        music :       music ,
        insertTime:   insertTime ,
        playTime :    playTime
      }
      this.musicplaylist.push(musicData);
      this.musicProgress();
      console.log(this.musicplaylist,'音樂項目');
    }
  }
  musicProgressDelete(e){
    let parent = e.target.parentNode.parentNode.parentNode;
    let indexElement = e.target.parentNode.parentNode;
    let node = Array.prototype.slice.call(parent.children);
    console.log(node.indexOf(indexElement));
    let index = node.indexOf(indexElement);
    this.musicplaylist.splice(index , 1);
    this.musicProgress();
  }
  musicProgress(){
    let progressBox = document.getElementsByClassName('playlist_progress_bar')[0];
    let proMainBar = document.getElementsByClassName('progress_bar_main')[0];
    progressBox.innerHTML = '';
    this.musicplaylist.forEach((value,index)=>{
      let progressBarBox      = CE('div','progress_bar_style');
      let progressBar         = CE('div','progress_bar');
      let progressControls    = CE('div','progress_controls');
      let progressTime        = CE('div','progress_time');
      let progressButton      = CE('div','progress_button');
      let progressBarColor    = CE('div','progress_bar_color');
      progressButton.innerText = 'X';
      progressButton.addEventListener('click',function(e){
        medical.musicProgressDelete(e);
      })
      progressBarBox.title = value.music;
      progressTime.innerText = Math.floor(value.insertTime / 60) + ':' + Math.floor(value.insertTime % 60)  + ' - ' + Math.floor((Number(value.playTime) + Number(value.insertTime)) / 60) + ':' + Math.floor(((Number(value.playTime) +Number(value.insertTime)) % 60));
      progressBarColor.style.width = (value.playTime / this.total) * 100 + '%';
      progressBarColor.style.marginLeft = (value.insertTime / this.total) * 100 + '%';
      progressBarColor.style.backgroundColor = 'rgb(' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ',' + Math.floor(Math.random()*256) + ')';
      AEA(progressControls,[progressTime,progressButton]);
      AE(progressBar,progressBarColor);
      AEA(progressBarBox,[progressBar,progressControls]);
      AE(progressBox,progressBarBox);
    })
    sectionView.musicplaylist = this.musicplaylist;
    sectionView.musicBuild(this.medicalId);
    AE(progressBox,proMainBar);
    $id('progress_bar_line').style.height = document.getElementsByClassName('playlist_progress_bar')[0].offsetHeight + 'px';
  }
  // 獲取播放媒體檔案index
  getPlaylistInfoIndex(e){
    let node = Array.prototype.slice.call($id('playlist_list').children);
    return node.indexOf($qs('.play_list_item.pick'));
  }
  // 更新編碼事件
  async playlistInfoUpdate(e){
    let id = $id('medical_info_list').value;
    let data = {
      cardId          : $id('medical_info_location_card_id').value,
      playlist        : this.playList,
      musicplaylist   : this.musicplaylist,
    }
    let result = await axiosItem.post('/medicalrecords/' + id , data);
  }
  async playlistInfoEdit(e){
    let name = $id('playlist_info_name').value;
    let time = $id('playlist_info_time').value;
    let type = $id('playlist_info_type').value;
    let index = this.getPlaylistInfoIndex();
    if(name.length != 0 && time != 0){
      let data = {
        name : name,
        type : type,
        time : time
      }
      document.getElementsByClassName('play_list_item')[index].innerText = name;
      this.playList[index].name = data.name;
      this.playList[index].type = data.type;
      this.playList[index].time = data.time;
      this.reCountAllTime(this.playList[index]);
    }
  }

  async playlistInfoDelete(e){
    let index = this.getPlaylistInfoIndex();
    this.playList.splice(index , 1);
    document.getElementsByClassName('play_list_item')[index].remove();
    this.reCountAllTime();
    this.viewNow = -1;
  }

  reCountAllTime(data){
    let total = 0;
    this.playListTime = [];
    this.playList.forEach(value=>{
      total += Number(value.time);
      this.playListTime.push(value.time)
    })
    let countMusic = 0;
    this.musicplaylist.forEach((v,i)=>{
      if( (Number(v.insertTime) + Number(v.playTime)) > total){
        this.musicplaylist.splice(i,1);
        countMusic += 1;
      }
    })
    this.total = total;
    sectionView.sectionChange(data);
    if(countMusic!=0)popMessage.err('由於時間變動'+countMusic+'個插入音源被取消',2000);
    $id('progress_time').innerText = Math.floor(this.nowTime / 60) + ':' + Math.floor(this.nowTime % 60) + ' - ' + Math.floor(this.total / 60) + ':' + this.total % 60;
    this.musicProgress();
  }
  async playlistInfoCreate(e){
    let name = $id('playlist_info_name').value;
    let time = $id('playlist_info_time').value;
    let type = $id('playlist_info_type').value;
    if(name.length != 0 && time != 0){
      let data = {
        name : name,
        type : type,
        time : time
      }
      this.playList.push(data);
      this.playListTime.push(time);
      this.total += Number(time);
      $qs('#build_section.pick').classList.remove('pick');
      $id('playlist_info_create').style.display = 'none';
      $id('playlist_info_edit').style.display = 'block';
      $id('playlist_info_delete').style.display = 'block';
      this.playListAdd(data);
    }else{
      popMessage.err('至少輸入一個字',2000)
    }
  }

  //按鈕事件================================================
  // reset
  reset(){
    this.viewNow = -1;
    this.musicNow = -1;
    this.playList = [];
    this.playListTime = [];
    this.musicplaylist = [];
    this.total = 0;
    this.changeNowTime(0);
    this.filmPlayStop();
    this.progressCalc();
    this.musicProgressCale(false);
    document.getElementsByClassName('playlist_list')[0].innerHTML = '';
  }
  // 搜尋病歷資料
  async medicalInfoSearchButton(e){
    let value = $id('medical_info_search').value;
    if(value.length !=0){
      let result = await axiosItem.get('medicalrecords/' + value);
      if(result.data){
        let buildSection = document.getElementsByClassName('build_section')[0];
        this.reset();
        $id('edit_zone').style.transform = 'translateX(0%)';
        this.buildMedicalView(value,buildSection);
      }else{
        popMessage.err('這個病歷並不存在', 2000);
      }
    }else{
      popMessage.err('至少要輸入一個字', 2000)
    }
  }
  // 病歷號更改事件
  async infoListChange(medicalNumber){
    let buildSection = document.getElementsByClassName('build_section')[0];
    $id('list_zone').style.transform = 'translateX(-110%)';
    this.reset();
    let data = {
      img:[],
      video:[],
      music:[]
    };
    if(medicalNumber == 'false' || medicalNumber == 'newMedical'){
      $id('medical_patient_photo').src = './images/imgobj.svg';
      $id('medical_info_create').style.display = 'block';
      $id('medical_info_edit').style.display = 'none';
      $id('medical_info_delete').style.display = 'none';
      $id('medical_info_id').value = '';
      $id('medical_info_name').value = '';
      $id('medical_info_location_card_id').value = 'none';
      this.fileList = data;
      this.appendRecord();
      this.musicProgress();
      sectionView.sectionBuild();
      document.getElementsByClassName('playlist_list')[0].appendChild(buildSection); // 把東西放回去
      $id('edit_zone').style.transform = 'translateX(-110%)';
    }else{
      this.buildMedicalView(medicalNumber, buildSection);
      $id('edit_zone').style.transform = 'translateX(0%)';
    }
  }
  // 建立病歷資料
  async buildMedicalView(medicalNumber, buildSection){
    let data = {
      img:[],
      video:[],
      music:[]
    };
    $id('medical_info_create').style.display = 'none';
    $id('medical_info_edit').style.display = 'block';
    $id('medical_info_delete').style.display = 'block';
    $id('medical_patient_photo').src = url + medicalNumber + '/personalPic.jpg';
    this.medicalId = medicalNumber;
    let fileResult = await axiosItem.get('/updata/' + medicalNumber);
    let medicalrecordsResule = await axiosItem.get('/medicalrecords/' + medicalNumber);
    console.log({fileResult,medicalrecordsResule})
    $id('medical_info_id').value = medicalrecordsResule.data._id;
    $id('medical_info_name').value = medicalrecordsResule.data.name;
    if(medicalrecordsResule.data.sex == '0') $id('medical_info_sex').checked = false;
    else $id('medical_info_sex').checked = true;
    $id('medical_info_location_card_id').value = medicalrecordsResule.data.cardId;
    let start = Number(medicalrecordsResule.data.startTime);
    let end   = Number(medicalrecordsResule.data.endTime);
    // console.log({start,end})
    this.timePicker.setDateRange(moment(start),moment(end));
    this.fileList = fileResult;
    this.playList = medicalrecordsResule.data.playlist;
    this.musicplaylist = medicalrecordsResule.data.musicplaylist;
    // 清除項目
    this.playList.forEach((v,i) => {
      this.playListTime.push(v.time);
      this.total += Number(v.time);
      // $id('view_section_pick').add(new Option('No.' + (i + 1) + '-' + v.time, i))
      this.playListAdd(v,i,buildSection);
    });
    this.changeNowTime(0);
    this.musicProgress();
    document.getElementsByClassName('playlist_list')[0].appendChild(buildSection); // 把東西放回去
    sectionView.sectionChange(this.playList[0]);
    $id('playlist_info_type').value = this.playList[0] ? this.playList[0].type : 0;
    if(fileResult.data){
      fileResult.data.forEach(v=>{
        let inData = v.split('.');
        switch (inData[inData.length - 1]) {
          case ('jpg'||'jpeg'||'png'):
              data.img.push(v);
            break;
            case ('mp4'||'ogg'):
              data.video.push(v);
            break;
          case ('mp3'):
              data.music.push(v);
            break;
          default:
            break;
        }
      })
    }
    this.fileList = data;
    this.appendRecord();
  }
  // 播放清單冒泡事件
  playlistListBubble(e){
    if(e.target.id != 'playlist_list'){
      let node = Array.prototype.slice.call($id('playlist_list').children);
      let total = 0;
      console.log(node.indexOf(e.target));
      for(let i = 0;i < node.indexOf(e.target) ; i++){
        total +=Number(this.playListTime[i]);
        console.log(total)
      }
      $id('playlist_info_create').style.display = 'none';
      $id('playlist_info_edit').style.display = 'block';
      $id('playlist_info_delete').style.display = 'block';
      this.changeNowTime(total);
      this.progressCalc();
    }
  }
  // 清單上的章節建立功能
  playlistListBuildSection(e){
    this.viewNow = -1;
    $id('list_zone').style.transform = 'translateX(-110%)';
    e.stopPropagation();
    if($qs('.play_list_item.pick'))$qs('.play_list_item.pick').classList.remove('pick');
    e.target.classList.add('pick');
    $id('playlist_info_create').style.display = 'block';
    $id('playlist_info_edit').style.display = 'none';
    $id('playlist_info_delete').style.display = 'none';
    this.filmPlayStop();
    $id('playlist_info_name').value = '';
    $id('playlist_info_time').value = '';
    sectionView.sectionBuild($id('playlist_info_type').value);
  }
  // 新增章節項目欄
  playListAdd(data , i = false, buildSection){
    console.log(data);
    let div =  CE('div', 'play_list_item');
    if(i === 0){
      $id('list_zone').style.transform = 'translateX(0%)';
      buildSection.classList.remove('pick');
      $id('playlist_info_create').style.display = 'none';
      $id('playlist_info_edit').style.display = 'block';
      $id('playlist_info_delete').style.display = 'block';
      div.classList.add('pick');
      $id('playlist_info_name').value = data.name;
      $id('playlist_info_time').value = data.time;
    }
    div.innerHTML = data.name;
    let element = document.getElementsByClassName('playlist_list')[0];
    let build_section = document.getElementsByClassName('build_section')[0];
    element.insertBefore(div,build_section);
  }
  // 選擇樣式類型選單
  playlistInfoTypeChange(e){
    sectionView.sectionBuild(e.target.value);
  }


  // 刷新下方的選單項目
  appendRecord(){
    let dataUrl = url + $id('medical_info_list').value; 
    this.appendImg(this.fileList.img, dataUrl);
    this.appendMusic(this.fileList.music, dataUrl);
    this.appendVideo(this.fileList.video, dataUrl);
  }
  // 加入目前資料
  appendImg(data, url){
    let list = $id('img_list_edit_list');
    list.innerHTML = '';
    let img = $id('img_list_img_now');
    if(data.length == 0){
      AE(list,new Option('沒有項目','none' , true));
      // img.style.display='none';
    }
    data.forEach((v, i) => {
      if (i == 0 ) {
        // img.style.display='block';
        this.imgListChange(v);
      }
      let option = new Option(v, v)
      AE(list,option);
    })
  }
  appendMusic(data, url){
    let list = $id('music_list_edit_list');
    list.innerHTML = '';
    let music = $id('music_list_audio_now');
    music.pause();
    if(data.length == 0){
      AE(list,new Option('沒有項目','none' , true));
      // music.style.display='none';
    }
    data.forEach((v, i) => {
      if (i == 0) {
        // music.style.display = 'block';
        this.musicListChange(v);
      }
      let option = new Option(v, v)
      AE(list,option);
    })
  }
  appendVideo(data, url){
    let list = $id('video_list_edit_list');
    list.innerHTML = '';
    let video = $id('video_list_video_now');
    video.pause();
    if(data.length == 0){
      AE(list,new Option('沒有項目','none' , true));
      // video.style.display='none';
    }
    data.forEach((v, i) => {
      if (i == 0) {
        // video.style.display = 'block';
        this.videoListChange(v);
      }
      let option = new Option(v, v)
      list.appendChild(option);
    })
  }
  // 加入資料結束
  imgListChange(data){
    let img = $id('img_list_img_now');
    img.src = url + this.medicalId + '/' + data;
  }
  musicListChange(data){
    let music = $id('music_list_audio_now');
    music.innerHTML = '';
    music.controls = true;
    music.controlsList = "nodownload"
    let source = document.createElement('source');
    source.src = url + this.medicalId + '/' + data;
    source.type = "audio/" + data.split('.')[data.split('.').length - 1];
    AE(music,source);
    music.load();
  }
  videoListChange(data){
    let video = $id('video_list_video_now');
    let source = document.createElement('source');
    video.innerHTML = '';
    video.controls = true;
    source.src = url + this.medicalId + '/' + data;
    source.type = "video/" + data.split('.')[data.split('.').length - 1];
    AE(video,source);
    video.load();
  }
  //滑鼠進度條滑桿事件
  mouseProgressmove(e){
    e.preventDefault();
    // $id('progress_bar_color').style.width = $id('progress_bar_color').offsetWidth + e.movementX +'px';
    let addTime = (medical.total) * (e.movementX * (1000 - $id('progress_bar').offsetWidth) / 150000) ;    //修改進度
    medical.changeNowTime(medical.nowTime + addTime);
    medical.progressCalc(true);
  }
  changeNowTime(time){
    this.nowTime = time;
    this.nowTime = (this.nowTime) < 0 ? 0 : (this.nowTime >= this.total) ? this.total : this.nowTime;

    $id('progress_time').innerText = Math.floor(this.nowTime / 60) + ':' + Math.floor(this.nowTime % 60) + ' - ' + Math.floor(this.total / 60) + ':' + this.total % 60;
    this.progressPrint();
  }
  // 進度條渲染事件
  progressPrint(e){
    let result = (this.nowTime / this.total);
    $id('progress_bar_color').style.width = (result ? result * 100 : 0)  + '%';
  }
  // 計時器跑動事件
  progressPlayTimeRun(){
    this.changeNowTime(this.nowTime + 0.1);
    // if(result >= 1){                 //不斷循環播放所有不用暫停了
    //   clearInterval(this.playStatus);
    //   this.playStatus = false;
    //   return;
    // }
    this.progressCalc();
  }
  //播放按鈕事件
  filmPlayStop(element = $id('view').querySelectorAll('video')){
    
    sectionView.videoPlayStatus = false;
    $id('progress_button').className = '';
    for(let i = 0;i<element.length;i++){
      element[i].pause();
    }
    clearInterval(this.playStatus);
    this.playStatus = false;
  }
  filmPlayStart(element = $id('progress_button')){
    sectionView.videoPlayStatus = true;
    $id('progress_button').className = 'progress_button_play';
    for(let i = 0;i<element.length;i++){
      element[i].play();
    }
    this.playStatus = setInterval(() => {
      this.progressPlayTimeRun();
    }, 100);
  }
  progressPlayButton(e){
    let video = $id('view').getElementsByTagName('video');
    if(sectionView.videoPlayStatus){
      this.filmPlayStop(video);
      this.musicProgressCale(false);
    }else{
      this.filmPlayStart(video);
      this.musicProgressCale(true);
    }
  }
  //判斷哪個畫面正在播放
  playListPick(index){
    if(this.viewNow != index){
      this.viewNow = index;
      let play_list_item = document.getElementsByClassName('play_list_item');
      let remove_list = $id('playlist_list').querySelectorAll('.pick');
      for(let i = 0 ;i<remove_list.length;i++){
        remove_list[i].classList.remove('pick');
      }
      play_list_item[index].classList.add('pick');
      console.log(this.playList);
      $id('playlist_info_name').value = this.playList[index].name;
      $id('playlist_info_time').value = this.playList[index].time;
      $id('playlist_info_type').value = this.playList[index].type;
      $id('playlist_info_create').style.display = 'none';
    }
  }

  // 計算音樂在什麼時候要開始播放
  musicProgressCale(isplay){
    let allAudio = document.querySelectorAll('#backgroundMusic audio');
    this.musicplayTimeout.forEach(v=>{
      clearTimeout(v);
    })
    this.musicplayTimeout = [];
    for(let i = 0; i < this.musicplaylist.length; i++){
      let audioElement = allAudio[i]
      audioElement.currentTime = 0;
      audioElement.pause();
      if(isplay && sectionView.videoPlayStatus){
        let insertTime    = this.musicplaylist[i].insertTime;
        let playTime      = this.musicplaylist[i].playTime;
        let totalTime     = Number(insertTime) + Number(playTime);
        let nowTime       = this.nowTime;
        if(nowTime>totalTime){
        }else if(nowTime >= insertTime){
          let currentTime = nowTime - insertTime
          console.log('有進來嗎',currentTime);
          audioElement.currentTime = currentTime;
          audioElement.play();
          this.musicplayTimeout.push(setTimeout(() => {
            console.log('是結束嗎?',currentTime)
            audioElement.pause();
          },(playTime - currentTime) * 1000));
        }else if(nowTime < insertTime){
          let afterTime = insertTime - nowTime;
          this.musicplayTimeout.push(setTimeout(() => {
            audioElement.play();
            this.musicplayTimeout.push(setTimeout(() => {
              audioElement.pause();
            }, (playTime) * 1000));
          }, (afterTime) * 1000));
        }
      }
    }
  }
  // 進度條計算目前到哪個章節的事件
  progressCalc(isMouse){
    // let box = document.getElementsByClassName('progress_bar')[0].offsetWidth;
    // let progress = $id('progress_bar_color').offsetWidth;
    // let result = progress / box;
    let time = 0;
    for(let i =0 ;i < this.playListTime.length;i++){
      time += this.playListTime[i] * 1 ;
      // console.log(this.nowTime,'現在時間', this.total , time);
      if(time > (this.nowTime) && (SectionView.nowPrintData != this.playList[i])){
        $id('list_zone').style.transform = 'translateX(0%)';
        this.playListPick(i);
        sectionView.sectionChange(this.playList[i]);
        break;
      }else if(this.nowTime >= this.total){
        if(!isMouse){
          this.changeNowTime(0);
          medical.musicProgressCale(true);
        } 
      }
    }
    if(isMouse){
      let video = $id('view').getElementsByTagName('video');
      let currentPlayListTime=0;
      for(let i = 0 ; i < this.viewNow ; i++){
        currentPlayListTime += this.playListTime[i] * 1;
      }
      for(let i =0 ; i <video.length;i++){
        video[i].currentTime = Number(this.nowTime) - Number(currentPlayListTime);
      }
    };
    // console.log(this.nowTime)
  }
}

// 統一宣告區=========================


window.addEventListener('load',init);
var medical = new Medical();
var sectionView = new SectionView();
var socketItem = new SocketItem(ipAddress);
var axiosItem = new AxiosItem();

// 統一宣告區=========================

function init (){
  medical.init();
  socketItem.init();
  // 上傳檔案的檢查
  $id('edit_update_area_file').addEventListener('change', function(e){
    function getFileInfo(fileStr) {
      //回傳一個陣列，索引0放的是主檔名, 索引1放的是副檔名
      console.log(fileStr);
      let dotPos = fileStr.name.lastIndexOf(".");
      let fileName = fileStr.name.substring(0, dotPos);
      let fileExt = fileStr.name.substr(dotPos + 1);
      let file = {
          name: fileName,
          ext: fileExt
      };
      return file;
    }
    let fileAccepts = ["png", "jpg", "jpeg", "mp4", "ogg", "mp3"];
    let errdata = '';
    let errNum =0;
    let okdata = '';
    let okNum =0;

    for(let i =0 ; i<e.target.files.length;i++){
      let fileInfo = getFileInfo(e.target.files[i]);
      console.log(fileInfo);
      if (fileAccepts.indexOf(fileInfo.ext.toLowerCase()) == -1) {
        errNum +=1 ;
        if(errNum < 4) errdata += fileInfo.name + '.' + fileInfo.ext + '、';
      }else{
        okNum +=1 ;
        if(okNum < 4) okdata += fileInfo.name + '.' + fileInfo.ext + '、';
      }
    }
    errdata += '共'+ errNum + '個檔案格式錯誤';
    okdata += '共'+ okNum + '個檔案準備上傳';
    document.getElementsByClassName('edit_update_area_file')[0].innerText = okdata;
    if(errNum !=0 ) popMessage.err(errdata, 2000);
  })
  //　用來調整右邊顯示比例
  $id('view').style.width = $id('view').offsetHeight * 0.5625 + 'px';
  document.getElementsByClassName('section_edit')[0].style.width = document.body.offsetWidth - $id('view').offsetHeight * 0.5625 + 'px';
  window.addEventListener('resize',function(e){
    $id('view').style.width = $id('view').offsetHeight * 0.5625 + 'px';
    document.getElementsByClassName('section_edit')[0].style.width = document.body.offsetWidth - $id('view').offsetHeight * 0.5625 + 'px';
  })
  // 個人圖片錯誤事件
  $id('medical_patient_photo').onerror = function(e){
    e.target.src = './images/imgobj.svg';
  }
  $id('medical_info_list').addEventListener('change' , function(e){
    medical.infoListChange(e.target.value);
  });
  // 拖動進度條滑桿事件
  $id('progress_bar_button').addEventListener('mousedown',function(e){
    if(medical.playList.length!=0){
      medical.progress_bar_button_even = true;
      clearInterval(medical.playStatus);
      medical.playStatus = false;
      document.addEventListener('mousemove',medical.mouseProgressmove);
    }
  })
  document.addEventListener('mouseup',function(e){
    if(medical.progress_bar_button_even){
      medical.progress_bar_button_even = false;
      if(medical.nowTime >= medical.total){
        medical.changeNowTime(0);
        medical.playListPick(0);
      }
      if(sectionView.videoPlayStatus) medical.playStatus = setInterval(() => {
        medical.progressPlayTimeRun();
      }, 100);
      medical.musicProgressCale(true);
      document.removeEventListener('mousemove',medical.mouseProgressmove);
    }
  })
  // 播放清單冒泡事件
  $id('playlist_list').addEventListener('click',function(e){
    medical.playlistListBubble(e);
  })
  // 播放清單建立章節事件
  $id('build_section').addEventListener('click',function(e){
    medical.playlistListBuildSection(e);
  })
  //播放按鈕事件
  $id('progress_button').addEventListener('click',function(e){
    medical.progressPlayButton(e);
  })
  // 播放清單樣式選單事件
  $id('playlist_info_type').addEventListener('change', function(e){
    medical.playlistInfoTypeChange(e);
  })
  // 項目選單事件
  $id('img_list_edit_list').addEventListener('change',function(e){
    medical.imgListChange(e.target.value);
  })
  $id('video_list_edit_list').addEventListener('change',function(e){
    
    medical.videoListChange(e.target.value);
  })
  $id('music_list_edit_list').addEventListener('change',function(e){
    medical.musicListChange(e.target.value);
  })
  // 按鈕事件====================================
  // 病歷欄未上的按鈕
  $id('medical_info_create').addEventListener('click',function(e){
    medical.medicalInfoCreate(e);
  })
  $id('medical_info_edit').addEventListener('click',function(e){
    medical.medicalInfoEdit(e);
  })
  $id('medical_info_delete').addEventListener('click',function(e){
    medical.medicalInfoDelete(e);
  })
  // 病歷欄未上的按鈕
  $id('img_list_edit_insert_img').addEventListener('click',function(e){
    medical.imgListEditInsertImg(e);
  })
  $id('video_list_edit_insert_video').addEventListener('click',function(e){
    medical.videoListEditInsertVideo(e);
  })
  $id('music_list_audio_insert_audio').addEventListener('click',function(e){
    medical.musicListAudioInsertAudio(e);
  })

  // 章節下的兩個按鈕
  $id('playlist_info_update').addEventListener('click',function(e){
    medical.playlistInfoUpdate(e);
  })
  $id('playlist_info_edit').addEventListener('click',function(e){
    medical.playlistInfoEdit(e);
  })
  $id('playlist_info_create').addEventListener('click',function(e){
    medical.playlistInfoCreate(e);
  })
  $id('playlist_info_delete').addEventListener('click', function(e){
    medical.playlistInfoDelete(e);
  })
  $id('medical_info_search_button').addEventListener('click', function(e){
    medical.medicalInfoSearchButton(e);
  })

  let fileDelete = document.getElementsByClassName('file_delete');
  for(let i = 0;i <fileDelete.length;i++){
    fileDelete[i].addEventListener('click',function(e){
      medical.fileDelete(e);
    })
  }
  // 按鈕事件====================================
  // 上傳事件====================================
  $id('medical_patient_photo_update').addEventListener('change',function(e){
    medical.medicalPatientPhotoUpdate(e);
  })
  $id('edit_update_area_submit').addEventListener('click',function(e){
    e.preventDefault();
    medical.editUpdateAreaSubmit(e);
  })
  // 上傳事件====================================
}