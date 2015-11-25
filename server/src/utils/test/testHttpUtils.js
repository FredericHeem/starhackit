import assert from 'assert';
import sinon from 'sinon';

import {convertAndRespond} from '../HttpUtils';

describe('HttpUtils', function(){

  it('convertAndRespond error without name ', function() {
    let error = {};

    convertAndRespond(context, error);
    assert.equal(context.code, 500);

  });
});
