import React from 'react';

export default function Grocery(props){

  
  
  return ( 
  <div className="row justify-content-center">
   <div className="border border-primary col-4 text-center text-success bg-warning">
      <h2>{props.name}</h2>
      <h3>{props.qty}</h3>
      <h3>{props.city}</h3>
    
      <button onClick={()=>props.handleDelete(props.id)}>Delete</button>
      <button onClick={()=>props.handleIncrement(props.id, props.qty)}>&#43;</button>
      <button onClick={()=>props.handleDecrement(props.id, props.qty)} disabled={props.qty===1}>&#8722;</button>
  </div>
  </div>
  )  
}