
import JsonSchema from 'jsonschema';
let validator = new JsonSchema.Validator();
let validate = validator.validate.bind(validator);

export function validateJson(json, schema) {
    let result = validate(json, schema);
    if (!result.errors.length) return true;

    throw {
        name: 'BadRequest',
        message: 'Request is invalid',
        validation: result.errors
    };
}
