
var initialState = {
  toDoList:[
    {id:1,title:"ToDo-1",description:"Desp-1",Date:"2020-02-12",active:true,},
    {id:2,title:"ToDo-2",description:"Desp-2",Date:"2020-02-13",active:false,}
  ],
  editingItem:{},
}

export function app(state = initialState, action) {
  switch (action.type) { 
    case "CREATE_ITEM":     
      return Object.assign({},state,{toDoList:state.toDoList.concat(CreateNewItem(state.toDoList,action.item))});
    case "UPDATE_ITEM":
      return Object.assign({},state,{toDoList:UpdateItem(state.toDoList,action.item)});
    case "GET_ITEM":  
      const filteredData=state.toDoList.filter((item)=>item.id===action.id);
      return Object.assign({},state,{editingItem:filteredData});   
    case "REMOVE_ITEM":
      return Object.assign({},state,{toDoList:RemoveItem(state.toDoList,action.item)});
    default:
      return state;
  }
}

const CreateNewItem=(toDoList,properties)=>{
  let last_id=0;
  toDoList.map((item)=>{
    if(item.id>last_id)
      last_id=item.id;
  })
  let new_item={
    id:last_id+1,
    ...properties
  }
  new_item.Date=ConvertDate2String(new_item.Date);
  return new_item;
}

const UpdateItem=(toDoList,properties)=>{
  for(var i=0;i<toDoList.length;i++){
    if(toDoList[i].id===properties.id){     
      toDoList[i]={
        ...properties
      }
      toDoList[i].Date=ConvertDate2String(toDoList[i].Date);
      break;
    }
  }
  return toDoList;
}

const RemoveItem=(toDoList,properties)=>{
  for(var i=0;i<toDoList.length;i++){
    if(toDoList[i].id===properties.id){     
      toDoList.splice(i,1);
      break;
    }
  }
  return toDoList;
}

const ConvertDate2String=(date)=>{
   let _date= new Date(date);
   let _dateStr = _date.getFullYear() +"-"+ (_date.getMonth()+1)+"-"+_date.getDate();
   return _dateStr;
}