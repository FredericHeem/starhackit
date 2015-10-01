import assert from 'assert';

export default class UserApi {
  constructor(app){
    this.app = app;
    this.models = app.data.sequelize.models;
    assert(this.models);
  }

  list(qs) {
    var filter = this.app.data.queryStringToFilter(qs, "id");
    return this.models.User.findAll(filter);
  }

  get(userId) {
    assert(this.models);
    return this.models.User.findByUserId(userId);
  }
}
