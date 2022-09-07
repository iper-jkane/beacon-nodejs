import OpenAPIRequestValidatorPackage from 'openapi-request-validator'
const OpenAPIRequestValidator = OpenAPIRequestValidatorPackage.default

import fs from 'fs'
import Path from 'path'

import { fileURLToPath } from 'url';
const __dirname = Path.dirname(fileURLToPath(import.meta.url));

// console.log(__dirname)
const beaconModelEndpointsJsonFile =  __dirname + '/../../../../../../schema/openapi/ga4gh-beacon/beacon-v2/models/json/beacon-v2-default-model/endpoints.json'  
// console.log(beaconModelEndpointsJsonFile)
const beaconModelEndpointsJson = JSON.parse( fs.readFileSync( beaconModelEndpointsJsonFile ) ) 


// console.log(beaconModelEndpoints.paths["/info"].get)

export { OpenAPIRequestValidator, beaconModelEndpointsJsonFile, beaconModelEndpointsJson }

// export const requestValidator = new OpenAPIRequestValidator({})

// console.log(requestValidator)
//   parameters: [
//     {
//       in: 'query',
//       type: 'string',
//       name: 'foo',
//       required: true
//     }
//   ],
//   requestBody: { // optional OpenApi v3 requestBodyObject
//     content: {
//       'application/json': {
//         schema: {
//           properties: {
//             name: {
//               type: 'string'
//             }
//           }
//         }
//       }
//     }
//   },
//   schemas: null, // an optional array or object of jsonschemas used to dereference $ref
//   errorTransformer: null, // an optional transformer function to format errors
//   customFormats: {
//     // support `"format": "foo"` for types.
//     foo: function(input) {
//       return input === 'foo';
//     }
//   }
// });

// var request = {
//   headers: {
//     'content-type': 'application/json'
//   },
//   body: {},
//   params: {},
//   query: {foo: 'wow'}
// };
// var errors = requestValidator.validateRequest(request);
// console.log(errors); // => undefined
