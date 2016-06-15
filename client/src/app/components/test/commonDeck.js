//import React from 'react';
import Alert from '../alert'
import AlertProps from './alertProps'


export default function(){

  return [
    {
      name:'alert',
      component: Alert,
      fixtures:AlertProps()
    }
  ]
}
