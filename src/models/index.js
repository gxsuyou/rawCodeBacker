export default {
  namespace:'adminIndex',
  state:{
    age:10,
    login:true,
    user:null,
  },
  reducers:{
     'delete'(state,payload){
       //console.log(payload.id);
       // return state.filter(item=>item.id !==id);
       console.log(state);
       return {...state,age:payload.id};
     },
     "loginTrue"(state,payload){
      console.log(payload);
     }
  }
}
