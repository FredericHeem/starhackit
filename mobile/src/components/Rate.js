import React from "react";

export default context => {
  const Text = require("components/Text").default(context);

  return ({ job }) => {
    if(!job.rate_min){
      return null
    }
    return (
      <Text>
        {job.rate_min}
        {job.rate_max && ` - ${job.rate_max}`}
        {` ${job.currency} per ${job.rate_period}`}
      </Text>
    );
  };
};
