import React, { Component,useState, useEffect  } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { withRouter } from "react-router";
import { Form, Modal, Card, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Months = ["Jan", "Feb", "March", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ConvertDate=(dateStr)=>{
    if(dateStr==="" || dateStr===null || dateStr===undefined)
        return "";
    else if(dateStr.toString().includes("-")){
        let dateArr=dateStr.split("-");
        return new Date(dateArr[0]+"-"+dateArr[1]+" "+dateArr[2]);
    }
    else{
        return new Date(dateStr);
    }
}

const OrderList=(toDoList,orderType)=>{
    switch(orderType){
        case "DateDESC":
            return toDoList.slice().sort(function(a,b){ return new Date(b.Date)-new Date(a.Date)});
        case "DateASC":
            return toDoList.slice().sort(function(a,b){ return new Date(a.Date)-new Date(b.Date)});
        default:
            return toDoList;
    }
}

export default function ToDo(props) {
    const [searchText, setsearchText] = useState("");
    const [modalShow,setModal]=useState(false);
    const [itemSelected,setitemSelected]=useState(false);
    const [activeToDo,setActiveToDo]=useState({Date:Date.now()});
    const [orderType,setorderType]=useState();
    const app = useSelector(state => state.app);
    const dispatch = useDispatch();

    function DateTimeFormat(dt) {
        let _date = new Date(dt);
        return [_date.getDate(), Months[_date.getMonth()] + " " + _date.getFullYear()]
    }

    function ItemClicked(key,e){
         setitemSelected(true);
         dispatch({ type: "GET_ITEM", id: key });        
    }

    function SaveItem(){
        if(activeToDo.title==="" || activeToDo.title===undefined){}
        else{
            if(isNaN(parseInt(activeToDo.id))){      
                dispatch({ type: "CREATE_ITEM", item: activeToDo });      
            }
            else{
                dispatch({ type: "UPDATE_ITEM", item: activeToDo });     
            }  
            setModal(false);
            setActiveToDo({Date:Date.now()});
        }
    }

    function ShowModal(e){
        //e.preventDefault();
        setModal(true);
    }

    function HideModal(){
        setActiveToDo({});
        setModal(false);
    }

    function DeleteItem(){
        if(!isNaN(parseInt(activeToDo.id))){
            dispatch({ type: "REMOVE_ITEM", item: activeToDo });    
            setModal(false);
            setActiveToDo({Date:Date.now()}); 
        }
    }

    function ToDoChange(key,e){   
        let value="";
        switch (key){
            case "Date": value=e; break;
            case "active": value=e.target.checked; break;
            default: value=e.target.value; break;    
        }
         let updatedToDo=Object.assign({},activeToDo,{[key]:value})
         setActiveToDo(updatedToDo);     
    }

    useEffect(() => {
        if(itemSelected){
            setActiveToDo(app.editingItem[0]);
            setModal(true);
            setitemSelected(false);
        }
    },[app.editingItem]);

    function CreateList() {
        const filteredList=OrderList(app.toDoList.filter((item)=>item.title.toUpperCase().includes(searchText.toUpperCase())),orderType);
        return filteredList.map((item) => (
            <Card key={item.id} bg={item.active !== true ? "secondary" : "primary"} text={item.active !== true ? "" : "white"} style={{ marginTop: "5px" }} onClick={(e)=>(ItemClicked(item.id,e))}>
                <Card.Body>
                    <Row>
                        <Col xs={10}>
                            <Card.Title style={{ textDecoration: item.active !== true ? "line-through" : "" }}>{item.title}</Card.Title>
                            <Card.Text style={{ textDecoration: item.active !== true ? "line-through" : "" }}>{item.description}</Card.Text>
                        </Col>
                        <Col style={{ textAlign: "center" }}>
                            <span style={{ fontSize: "30px" }}>{DateTimeFormat(item.Date)[0]}</span><br />
                            <span style={{ fontSize: "12px" }}>{DateTimeFormat(item.Date)[1]}</span>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        ))
    }

    return (
        <div>
            <div style={{ padding: "10px", cursor: "pointer" }}>
                <Row>
                    <Col xs={6} style={{ paddingRight: 0 }}>
                        <Form.Control type="text" placeholder="Search" onChange={(e)=>(setsearchText(e.target.value))} value={searchText} />
                    </Col>
                    <Col xs={4} style={{ paddingRight: 0 }}>
                    <Form.Control as="select" onChange={(e)=>(setorderType(e.target.value))}>
                        <option>Order...</option>
                        <option value="DateASC" >↑ Date</option>
                        <option value="DateDESC">↓ Date</option>
                    </Form.Control>
                    </Col>
                    <Col style={{ textAlign:"right" }}>
                        <Button style={{width:'100%'}} onClick={(e)=>(ShowModal(e))}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </Button>
                    </Col>
                </Row>
                {CreateList()}
            </div>
            <Modal show={modalShow} onHide={HideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{activeToDo.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Title"  onChange={(e)=>(ToDoChange("title",e))} value={activeToDo.title}/>
                                <Form.Text style={{display: activeToDo.title==="" || activeToDo.title===undefined ?"show":"none"}} className="text-danger">Required</Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="text" placeholder="Description" onChange={(e)=>(ToDoChange("description",e))} value={activeToDo.description} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Row >
                                    <Col>
                                        <DatePicker onChange={(e)=>(ToDoChange("Date",e))} dateFormat="yyyy/MM/dd" selected={ConvertDate(activeToDo.Date)} />        
                                    </Col>
                                </Form.Row>   
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Active</Form.Label>
                                <Form.Check type="checkbox" label="" onChange={(e)=>(ToDoChange("active",e))} checked={activeToDo.active} />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant="danger"  onClick={DeleteItem} style={{marginRight:"5px"}}> <FontAwesomeIcon icon={faTrash}/> Delete</Button>
                        <Button variant="success"  onClick={SaveItem} style={{marginRight:"5px"}}> <FontAwesomeIcon icon={faSave}/> Save</Button>
                        <Button variant="secondary" onClick={HideModal}> <FontAwesomeIcon icon={faTimes}/> Cancel</Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );

}


