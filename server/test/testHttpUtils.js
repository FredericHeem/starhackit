import assert from 'assert';
import sinon from 'sinon';

import {convertAndRespond} from '../src/utils/HttpUtils';

describe('HttpUtils', function(){

  it('convertAndRespond error without name ', function() {
    let error = {};
    let res = {
      status:sinon.stub(),
      send:sinon.stub()
    };
    res.status.returns(res);
    convertAndRespond(error, res);

    assert(res.status.called);
    assert(res.status.calledWith(500));

    assert(res.send.called);
    assert(res.send.calledWith({
        name: 'UnknownError'
    }));

  });
});
