
import {useState, useEffect} from 'react';
import Grocery from './Grocery.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";



import Rebase from "re-base"
import firebase from "firebase"





var app = firebase.initializeApp({
  apiKey: 'AIzaSyAU0lwm_VZySgOpp2zIZER442Ia7BVrq3M',
  authDomain: "agenda-5fb47.firebaseapp.com",
  databaseURL: 'https://agenda-5fb47-default-rtdb.firebaseio.com/',
  storageBucket: 'bucket.appspot.com',
  messagingSenderId: "802065132383"
});

var base = Rebase.createClass(app.database());

function App() {
  const [items, setItems] = useState([]);
  const [userInput, setUserInput]=useState("")
  const [errorMessage, setErrorMessage]=useState("")
  const [city, setCity]=useState("Chicago")
  useEffect(async () => {
    console.log("In useEffect")
    base
      .fetch(`groceries`, {
       asArray:true
      })
      .then((data) => {
        setItems(data)
      })
      .catch((err) => {
        console.log(err);
      }); 

  }, []);
  
  function handleClick(){
    const date=new Date();
    const id=date.getTime();
    base
      .post(`groceries/${id}`, {
        data: {id: id, name: userInput, qty:1, city: city},
      })
      .then(() => {
        onPostSuccess(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onPostSuccess(id){
    let copyOfCurrentItems=[...items]
    copyOfCurrentItems.push({id: id, name: userInput, qty:1, city: city})
    setItems(copyOfCurrentItems)
  }
  
 
  
  function handleChange(e){
      if (e.target.value.length<20 && e.target.value.length>=0){
      
      setUserInput(e.target.value)
      setErrorMessage("")}
      else if (e.target.value.length===20){
        setErrorMessage("Error: 20 Character Max")
      }
      else if (e.target.value.length===0){
        setErrorMessage("Must contain at least one character")
      }
  
  }

  function handleDelete(name){
    let copyOfCurrentItems=[...items]
    copyOfCurrentItems=copyOfCurrentItems.filter(item => item.name !== name)
    setItems(copyOfCurrentItems)
  }

  function handleIncrement(name){
    let copyOfArray=[...items]
    copyOfArray=copyOfArray.map(item=> {
      if (item.name===name){
        item.qty=item.qty+1
      }
      return item
  })
    setItems(copyOfArray)
  }

    function handleDecrement(name){
      let copyOfArray=[...items]
      copyOfArray=copyOfArray.map(item=> {
        if (item.name===name){
          item.qty=item.qty-1
        }
        return item
    })
      setItems(copyOfArray)
  }

  return (
    <div className="App bg-danger min-vh-100">
      <button onClick={handleClick} disabled={userInput===""}>Add Item</button>
      <input type="text" value={userInput} onChange={handleChange}></input>
      <select id="cities" value={city} 
              onChange={(e) => setCity(e.target.value)}>
          <option value="Chicago">Chicago</option>
          <option value="New York">New York</option>
          <option value="Boston">Boston</option>
      </select>
      <p>{errorMessage}</p>
      {items.map((item)=> <Grocery name={item.name} qty={item.qty} city={item.city} handleDelete={handleDelete} handleDecrement={handleDecrement} handleIncrement={handleIncrement}/>)}
      
    </div>
  );
}

export default App;
