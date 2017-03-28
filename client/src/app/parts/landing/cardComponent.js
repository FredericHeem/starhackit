import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import CardMedia from 'material-ui/Card/CardMedia';
import FontIcon from 'material-ui/FontIcon';

export default () => {

  MediaIcon.propTypes = {
    icon: PropTypes.string.isRequired
  };

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

  MediaImg.propTypes = {
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string
  }

  function MediaImg({img, title, height, width}){
      return (
        <div>
          <img src={img} alt={title} height={height} width={width} />
        </div>
      );
  }

  Card.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    img: PropTypes.string,
    icon: PropTypes.string
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