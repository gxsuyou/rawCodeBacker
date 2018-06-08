

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV=="development"){
  // var url_1="http://192.168.2.117:9800/";
  var url_1="http://127.0.0.1:8878/";
}else{
  var url_1="http://127.0.0.1:8878/";
}


const config={
  url_1:url_1,
  url_adminGame:`${url_1}adminGame`,
  url_login:`${url_1}admin/login`,
  url_getAdminGame:`${url_1}admin/gameAdmin`,
  url_admin:`${url_1}admin`
}

export default config;
