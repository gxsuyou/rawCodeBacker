if(process.env.NODE_ENV=="development"){
  var login=true;
}else{
  var login=false;
}
const c= {
  namespace:'adminIndex',
  state:{
    age:10,
    login:login,
    user:null,
  },
  reducers:{
     'delete'(state,payload){
       return {...state,age:payload.imd};
     },
     "loginToggle"(state,payload){
       return {...state,login:payload.loginTrue,user:payload.user}
     }
  }
}

export default c;
