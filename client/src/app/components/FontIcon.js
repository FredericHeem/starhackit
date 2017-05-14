import React from 'react';
import glamorous from 'glamorous';

const IconView = glamorous('i')({
}, (props, theme) => ({
  color: theme.palette.textColor
}))

export default function FontIcon({className, color}){
    return <IconView color={color} className={className} />
  }