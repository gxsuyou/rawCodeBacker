

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV=="development"){
  var url_1="http://localhost:8080/";
}else{
  var url_1="/";
}


const config={
  url_1:url_1,
  url_adminGame:`${url_1}adminGame`,
  url_login:`${url_1}admin/login`,
  url_getAdminGame:`${url_1}admin/gameAdmin`
}

export default config;
