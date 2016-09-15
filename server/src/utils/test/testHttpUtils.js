import assert from 'assert';

import {convertAndRespond} from '../HttpUtils';

describe('HttpUtils', function(){

  it('convertAndRespond error without name ', function() {
    let error = {};

    convertAndRespond(context, error);
    assert.equal(context.status, 500);

  });
});
