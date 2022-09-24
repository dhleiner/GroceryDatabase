
import {useState, useEffect} from 'react';
import Grocery from './Grocery.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";




import Rebase from "re-base"
import firebase from "firebase"





var app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "agenda-5fb47.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  storageBucket: 'bucket.appspot.com',
  messagingSenderId: "802065132383"
});

var base = Rebase.createClass(app.database());

function App() {
  console.log(process.env.REACT_APP_API_KEY)
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
        data: {id: id, name: userInput, qty: 1, city: city}
      })
      .then(() => {
        console.log("Success")
        onPostSuccess(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function onPostSuccess(id){
    let copyOfCurrentItems=[...items]
    copyOfCurrentItems.push({id: id, name: userInput, qty: 1, city: city})
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

  function handleDelete(id){
    base
    .remove(`groceries/${id}`)
    .then(()=>{
        console.log("Delete")
        onDeleteSuccess(id);
    })
  }

  function onDeleteSuccess(id){
    let copyOfCurrentItems=[...items]
    copyOfCurrentItems=copyOfCurrentItems.filter(item => item.id !== id)
    setItems(copyOfCurrentItems)
  }
  
  function handleIncrement(id, currentQty){
    base
    .update(`groceries/${id}`, {
      data: {qty: currentQty+1}
    })
    .then(() => {
      console.log("Success from increment")
      console.log(id)
      onIncrementSuccess(id);
    })
    .catch((err) => {
      console.log(err);
    });   
  }

  function onIncrementSuccess(id){
    let copyOfArray=[...items]
    copyOfArray=copyOfArray.map(item=> {
      if (item.id===id){
        item.qty=item.qty+1;
      }
      return item
  })
    setItems(copyOfArray)
  }
  function handleDecrement(id, currentQty){
    base
    .update(`groceries/${id}`, {
      data: {qty: currentQty-1}
    })
    .then(() => {
      console.log("Success from decrement")
      console.log(id)
      onDecrementSuccess(id);
    })
    .catch((err) => {
      console.log(err);
    });   
  }
    function onDecrementSuccess(id){
      let copyOfArray=[...items]
      copyOfArray=copyOfArray.map(item=> {
        if (item.id===id){
          item.qty=item.qty-1;
        }
        return item
    })
      setItems(copyOfArray);
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
      {items.map((item)=> <Grocery name={item.name} id={item.id} qty={item.qty} city={item.city} handleDelete={handleDelete} handleDecrement={handleDecrement} handleIncrement={handleIncrement}/>)}
      
    </div>
  );
}

export default App;
