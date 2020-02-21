class SectionView{
  constructor(isDashboard = false){
    this.nowPrintData;
    this.videoPlayStatus = isDashboard;
    this.musicplaylist = [];
  }
  sectionChange(data, dashboard){
    if(this.nowPrintData != data){
      this.nowPrintData = data;
      this.sectionBuild(data ? data.type : '', dashboard);
      setTimeout(() => {
        switch (data ? data.type : 0) {
          case '0':
            for(let i = 1 ; i <= 3 ; i++){
              if(data['obj' + i]){
                $id('obj'+ i ).innerHTML = '';
                let element = this.itemBuild(data['obj' + i]);
                $id('obj'+ i ).appendChild(element);
              }
            }
            break;
          case '1':
            if(data['obj1']){
              $id('obj1').innerHTML = '';
              let element = this.itemBuild(data['obj1']);
              $id('obj1').appendChild(element);
            }
            break;
          case '2':
            for(let i = 1 ; i <= 2 ; i++){
              if(data['obj' + i]){
                $id('obj'+ i ).innerHTML = '';
                let element = this.itemBuild(data['obj' + i]);
                $id('obj'+ i ).appendChild(element);
              }
            }
            break;
          default:
            break;
        }
      }, 0);
    }
  }
  // 創建 section 樣式
  sectionBuild(type = '0', dashboard = false){
    let view = $id('view');
    view.innerHTML = '<img id="viewlogo" src="images/logo.png">';
    let array=[];
    function objBuild(i){
      let element = CE('div','view_obj');
      if(i==1 && !dashboard){
        element.classList.add('pick');
      }
      element.id = 'obj' + i ;
      let img = CE('img');
      img.src = './images/imgobj.svg';
      AE(element,img);
      return element;
    }
    // switch (type ? type : $id('view_section_type').value) {
    switch (type) {
      case '0':
        view.className = 'section section_view';
        view.classList.add('type1');
        for(let i=1 ; i <= 3 ; i++){
          array.push(objBuild(i));
        }
        break;
      case '1':
        view.className = 'section section_view';
        view.classList.add('type2');
        array.push(objBuild(1));
        break;
      case '2':
        view.className = 'section section_view';
        view.classList.add('type3');
        for(let i=1 ; i <= 2 ; i++){
          array.push(objBuild(i));
        }
        break;
      default:
        console.log('失敗',$id('playlist_info_type').value)
        break;
    }
    if(!dashboard){
      array.forEach(element => {
        element.addEventListener('click',function(e){
          for(let i = 0 ; i < array.length;i++){
            array[i].classList.remove('pick');
          }
          element.classList.add('pick');
        })
      });
    }
    AEA(view,array)
  }
  // 建立內部物件樣式
  itemBuild(data){
    let type = data.split('.')[data.split('.').length - 1];
    let element;
    switch (type) {
      case ('jpg'||'jpeg'||'png'):
          element = document.createElement('img');
          element.src = url + data;
          element.onerror = function(e){
            element.src = './images/imgerror.svg';
          }
        break;

      case ('mp4'||'ogg'):
          element = document.createElement('video');
          let source = document.createElement('source');
          source.src = url + data;
          element.loop = true;
          element.preload = 'auto';
          element.autoplay = this.videoPlayStatus ? 'autoplay' : false;
          source.type = "video/" + type;
          element.appendChild(source);
          source.onerror = function(e){
            element.poster="./images/imgerror.svg";
          }
        break;
      default:
        break;
    }
    return element;
  }
  // 建立音樂播放系統
  musicBuild(id){
    let musicBox = $id('backgroundMusic') ? $id('backgroundMusic') : CE('div','backgroundMusic','backgroundMusic');
    musicBox.innerHTML = '';
    musicBox.style.display = 'none';
    this.musicplaylist.forEach((vaule,index)=>{
      let audio = CE('audio' , (index == 0) ? 'play' : '');
      audio.controlsList = "nodownload";
      audio.preload = true;
      let source = document.createElement('source');
      source.src = url + id + '/' + vaule.music;
      source.type = "audio/" + vaule.music.split('.')[vaule.music.split('.').length - 1];
      AE(musicBox,AE(audio,source));
      document.getElementsByTagName('body')[0].appendChild(musicBox);
    })
  }
}