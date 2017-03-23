import React from 'react';
import "./panel.css"

export default function(){
  return function Panel({
    title,
    children
  }){
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{title}</div>
        <div className="panel-body">
          {children}
        </div>
      </div>
    );
  }
}
