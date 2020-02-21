function updataImgAndPrint(e, ImgElement) {
  function getFileInfo(fileStr) {
    let dotPos = fileStr.lastIndexOf(".");
    let fileName = fileStr.substring(0, dotPos);
    let fileExt = fileStr.substr(dotPos + 1);
    let file = {
      name: fileName,
      ext: fileExt
    };
    return file;
  }
  let fileAccepts = ["jpg"];
  let fileInfo = getFileInfo(e.target.value);
  if (!e.target.value) {
  } else if (fileAccepts.indexOf(fileInfo.ext.toLowerCase()) == -1) {
    alert("僅接受jpg格式");
    e.target.value = "";
  } else {
    let pic = e.target.files[0];
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d")
    let readpic = new FileReader();
    readpic.readAsDataURL(pic);
    readpic.addEventListener("load", function (e) {
      // console.log(readpic,確認這是什麼);
      let img = new Image();
      img.src = e.target.result
      img.onload = function (e) {
        // 破壞圖片比例後重畫到畫面上
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        // // 下方是壓縮後輸出
        let pre;
        // 確認要壓縮多少
        if (canvas.toDataURL('image/jpeg', 0.8.length) < (131072 - 1024)) {
          pre = 0.8;
        } else if (canvas.toDataURL('image/jpeg', 0.6).length < (131072 - 1024)) {
          pre = 0.6;
        } else if (canvas.toDataURL('image/jpeg', 0.5).length < (131072 - 1024)) {
          pre = 0.5;
        } else if (canvas.toDataURL('image/jpeg', 0.3).length < (131072 - 1024)) {
          pre = 0.3;
        } else {
          pre = 0.1;
        }
        ImgElement.src = canvas.toDataURL('image/jpeg', pre);
        // 壓縮完成後輸出
        // console.log(canvas.toDataURL('image/jpeg', 0.5));
        // console.log(pre,'image/jpeg');
      }
    })
  }
}