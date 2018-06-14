if(process.env.NODE_ENV==="development"){
  var login=false;
}else{
   login=false;
}
const c= {
  namespace:'adminIndex',
  state:{
    age:10,
    login:false,
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
