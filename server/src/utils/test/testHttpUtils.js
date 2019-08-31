import * as assert from 'assert';

const convertAndRespond = require('../HttpUtils').convertAndRespond;

describe('HttpUtils', function(){

  it('convertAndRespond error without name ', function() {
    let error = {};

    convertAndRespond(context, error);
    assert.equal(context.status, 500);

  });
});
