import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import CardMedia from 'material-ui/Card/CardMedia';
import FontIcon from 'material-ui/FontIcon';

export default () => {

  MediaIcon.propTypes = {
    icon: PropTypes.string.isRequired
  };

  function MediaIcon(props){
      return (
        <CardMedia>
          <FontIcon
            className={props.icon}
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

  function MediaImg(props){
      return (
        <div>
          <img src={props.img} alt={props.title} height={props.height} width={props.width} />
        </div>
      );
  }

  Card.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    img: PropTypes.string,
    icon: PropTypes.string
  }

  function Card(props){
    return (
      <Paper className='card'>
        <div className='card-container'>
          <div className="card-item">
            <h2>{props.title}</h2><p>{props.text}</p>
          </div>
          <div className="card-item">
            {props.icon && <MediaIcon {...props} />}
            {props.img && <MediaImg {...props} />}
          </div>
        </div>
      </Paper>
    );
  }
  return Card;
}