import React from 'react';
import {assert} from 'chai';
import spinner from './spinner';
import { render } from 'enzyme';
import Context from './context'

describe('Spinner', function() {
  const context = Context();
  it('default', async () => {
    const Spinner = spinner(context);
    const wrapper = render(<Spinner />);
    assert(wrapper)
  });
});
