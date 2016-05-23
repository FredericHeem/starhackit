import React from 'react';
import {IntlProvider} from 'react-intl';

let Intl = ({language, ...props}) => (
  <IntlProvider locale={language}>
    {props.children}
  </IntlProvider>
)
export default Intl;
