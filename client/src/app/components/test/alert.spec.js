import React from 'react';
import Alert from '../alert'
import {mount} from 'enzyme';
import {expect} from 'chai';

describe('Alert', () => {
  it('alert ok', () => {
    const component = mount(<Alert
      title='Title'
      name="NoSuchCode"
      message="message"/>);
      //console.log(component.props())

    expect(component.props().title).to.equal("Title")
  });
});
