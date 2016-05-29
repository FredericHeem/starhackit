import React from 'react';
import Helmet from 'react-helmet';
import config from 'config';

function getDocumentTitle(title = '') {
    return title + " - " + config.title;
}

export default function DocTitle({title}){
  return (
    <Helmet
    title = {title}
    titleTemplate = {getDocumentTitle(title)}
    / >
  )
}

DocTitle.propTypes = {
  title: React.PropTypes.string
};
