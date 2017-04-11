import React from 'react';
import Paper from 'material-ui/Paper';
import CardMedia from 'material-ui/Card/CardMedia';
import FontIcon from 'material-ui/FontIcon';

export default () => {

  function MediaIcon({icon}){
      return (
        <CardMedia>
          <FontIcon
            className={icon}
            style={{fontSize:64}}
          />
        </CardMedia>
      );
  }

  function MediaImg({img, title, height, width}){
      return (
        <div>
          <img src={img} alt={title} height={height} width={width} />
        </div>
      );
  }

  function Card({title, text, icon, img, height, width}){
    return (
      <Paper className='card grow'>
        <div className='card-container'>
          <div className="card-item">
            <h2>{title}</h2><p>{text}</p>
          </div>
          <div className="card-item">
            {icon && <MediaIcon icon={icon} />}
            {img && <MediaImg title={title} img={img} height={height} width={width} />}
          </div>
        </div>
      </Paper>
    );
  }
  return Card;
}