if(process.env.NODE_ENV==="development"){
 var url_1="http://192.168.0.104:8878/";
    // var url_1="http://192.168.2.117:8878/";
      // var url_1="http://127.0.0.1:8878/";
}else{
  url_1="http://182.61.26.179:8878/";
}


const config={
  url_1:url_1,
  url_adminGame:`${url_1}adminGame`,
  url_login:`${url_1}admin/login`,
  url_getAdminGame:`${url_1}admin/gameAdmin`,
  url_admin:`${url_1}admin`,
  url_adminStrategy:`${url_1}adminStrategy`,
  url_adminNews:`${url_1}adminNews`,
  url_adminH5:`${url_1}adminH5`,
  getCookie(name){
    var arr;
    var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
     if(arr = document.cookie.match(reg)){
        return unescape(arr[2]);
     }else{
        return null;
     }
  },
  setCookie(name, value, day) {
        if(day !== 0){
          //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
          var expires = day * 24 * 60 * 60 * 1000;
          var date = new Date(+new Date()+expires);
          document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
         }else{
           document.cookie = name + "=" + escape(value);
         }
  },
  delCookie(name){
     config.setCookie(name, ' ', -1);
  }
}

export default config;
