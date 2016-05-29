import React from 'react';
import {IntlProvider} from 'react-intl';

let Intl = ({language, ...props}) => (
  <IntlProvider locale={language}>
    {props.children}
  </IntlProvider>
)

Intl.propTypes = {
  children: React.PropTypes.node,
  language: React.PropTypes.string.isRequired
};

Intl.displayName = 'Intl';
export default Intl;
