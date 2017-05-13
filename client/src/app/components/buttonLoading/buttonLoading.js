import React from 'react';
import glamorous from 'glamorous';
import LaddaButton, { L, SLIDE_UP } from 'react-ladda';
import 'ladda/dist/ladda.min.css';

export default function() /*context*/ {
  const ButtomView = glamorous.div({
    width: 256,
    margin: '20px auto 20px auto',
  });

  return function({ loading, onClick, children }) {
    return (
      <ButtomView>
        <LaddaButton
          style={{width:'100%'}}
          data-size={L}
          data-style={SLIDE_UP}
          data-spinner-size={30}
          loading={loading}
          onClick={() => onClick()}
        >
          {children}
        </LaddaButton>
      </ButtomView>
    );
  };
}
