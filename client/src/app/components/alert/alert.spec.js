import React from 'react';
import alert from '../alert'
import {mount} from 'enzyme';
import {expect} from 'chai';

describe('Alert', () => {
  const Alert = alert({
    tr: {
      t: (text) => text
    }
  })
  it('alert ok', () => {
    const component = mount(<Alert.Warning
      title='Title'
      name="NoSuchCode"
      message="message"
    />);
      //console.log(component.props())

    expect(component.props().title).to.equal("Title")
  });
});
