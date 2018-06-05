export default {
  namespace:'adminIndex',
  state:{
    age:10,
    login:true,
    user:null,
  },
  reducers:{
     'delete'(state,payload){
       return {...state,age:payload.id};
     },
     "loginToggle"(state,payload){
       return {...state,login:payload.loginTrue,user:payload.user}
     }
  }
}
