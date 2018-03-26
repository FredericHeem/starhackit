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
          const { sectors, max = "50" } = querystring;
          //console.log("querystring ", querystring);
          const criteria = {
            limit: 100,
            where: {},
            order: [["created_at", "DESC"]],
          };
          if (!_.isNaN(lat) && !_.isNaN(lon)) {
            const point = sequelize.fn(
              "ST_GeomFromText",
              `POINT(${lat} ${lon})`,
              4326
            );
            const within = sequelize.fn(
              "ST_DWithin",
              sequelize.col("geo"),
              point,
              `${max}000`
            );
            criteria.where.$and = within;
          }
          if (_.isArray(sectors)) {
            criteria.where.sector = { $in: sectors };
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
            include: [
              {
                model: models.User,
                as: "recruiter"
              }
            ],
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
            const jobData = job.get();
            await models.Job.update(
              { views: jobData.views + 1 },
              { where: { id: jobData.id } }
            );
            context.body = jobData;
            context.status = 200;
          }
        }
      }
    }
  };

  app.server.createRouter(api);
};
