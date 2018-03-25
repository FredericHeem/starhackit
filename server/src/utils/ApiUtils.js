import JsonSchema from "jsonschema";
let validator = new JsonSchema.Validator();
let validate = validator.validate.bind(validator);

//Deprecated
export function validateJson(json, schema) {
  let result = validate(json, schema);
  if (!result.errors.length) return true;

  throw {
    name: "BadRequest",
    message: "Request is invalid",
    validation: result.errors
  };
}

export function validateSchema(json, schema, context) {
  const result = validate(json, schema);
  if (!result.errors.length) return true;
  context.status = 400;
  context.body = {
    error: {
      name: "BadRequest",
      message: "Request is invalid",
      validation: result.errors
    }
  };
}
