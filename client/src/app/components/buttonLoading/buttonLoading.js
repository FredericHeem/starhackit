import React from 'react';
import LaddaButton, { L, SLIDE_UP } from 'react-ladda';

export default function(/*context*/) {
  return function({ loading, onClick, children }) {
    return (
      <LaddaButton
        className="btn btn-lg btn-primary"
        data-size={L}
        data-style={SLIDE_UP}
        data-spinner-size={30}
        loading={loading}
        onClick={() => onClick()}
      >
        {children}
      </LaddaButton>
    );
  };
}
