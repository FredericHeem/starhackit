import Qs from "qs";
import _ from "lodash";

export default app => {
  const { sequelize } = app.data;
  const { models } = sequelize;

  const api = {
    pathname: "/candidate/job",
    ops: {
      getAll: {
        pathname: "/",
        method: "get",
        handler: async context => {
          const querystring = Qs.parse(context.request.querystring);
          const lat = _.toNumber(querystring.lat);
          const lon = _.toNumber(querystring.lon);
          const {sectors} = querystring;
          //console.log("criteria ", querystring);
          const criteria = {
            limit: 100,
          };
          if (!_.isNaN(lat) && !_.isNaN(lon)) {
            criteria.order = sequelize.literal(
              `geo <-> 'SRID=4326;POINT(${lat} ${lon})'`
            );
          }
          if(_.isArray(sectors)){
            criteria.where = {sector: {$in: sectors}};
          }
          //console.log("criteria ", criteria);
          const jobs = await models.Job.findAll(criteria);
          context.body = jobs.map(job => job.get());
          context.status = 200;
        }
      },
      getOne: {
        pathname: "/:id",
        method: "get",
        handler: async context => {
          const job = await models.Job.findOne({
            where: {
              id: context.params.id
            }
          });

          if (!job) {
            context.status = 404;
            context.body = {
              error: {
                code: 404,
                name: "NotFound"
              }
            };
          } else {
            context.body = job.get();
            context.status = 200;
          }
        }
      }
    }
  };

  app.server.createRouter(api);
};
