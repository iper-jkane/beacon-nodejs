## A Node.js Beacon-v2 Implementation. 

  == Warning: Proof of Concept / Work In Progress :D ==
  
  This Beacon is Lit!⁽™⁾ 

  Written mostly in javascript, for Node.js.  
  Using: Hapi, Mongoose, and Vue.

 - [INSTALL.md](INSTALL.md)
 - [USAGE.md](USAGE.md)
 - [HACKING.md](HACKING.md)

 ---
### Overview 

What is a Beacon in principle?

The [official documentation](https://docs.genomebeacons.org/what-is-beacon-v2/) states: 

  > Beacon v2 is a protocol/specification established by the Global Alliance for Genomics and Health initiative (GA4GH) that defines an open standard for federated discovery of genomic (and phenoclinic) data in biomedical research and clinical applications. 

These specifications:

  - define a standardised format with which to structure genomics data
  - define a structured way to reference the data using a REST-API 
    - define an implicit client-server architecture
  - are a set of human & machine-readable documents 
  - do /not/ specify any strict implementation details

---

What is a Beacon in implementation?

  Expected (minimally) to be a server + database: 

  - the server is an application which SHOULD respond to requests made of the the API (application programming interface) by possible clients
  - a database in which to store genomic and phenoclinic data 
  

## Architecture

```
                 Beacon:
                +-----------------------------------------+
                |    API/WebServer         DB/Data        |
 Client(s):     |   +-------------+       +-----------+   |
 +------+       |   |---+         |       |           |   |
 | vue  +<------=-->+ C |         |       |           |   |
 +------+       |   |---+         |       |           |   |
                |   |    Hapi     +<----->+  MongoDB  |   |
 +------+       |   |             |       |           |   |
 | curl +<------=-->+             |       |           |   |
 +------+       |   |             |       |           |   |
                |   +-------------+       +-----------+   |
                +-----------------------------------------+
```

## Code Structure (overview):

```
node_beacon
├── schema/
│   ├── openapi/      
│   └── mongoose/    
├── srvr/
│   └── hapi/
└── uix/
    └── vue/
```

---

### Schemas: 

Notice the mongoose schemas currently follow the ga4gh openapi schema structure.
Also note that this draft of the implementation only provides the '/info' endpoint.

```
node_beacon/
└── schema/
    ├── mongoose/
    │   ├── beacon/
    │   │   ├── framework/
    │   │   │   └── responses/
    │   │   │       ├── beaconInfoResponse.js
    │   │   │       └── sections/
    │   │   │           ├── beaconInfoResults.js
    │   │   │           └── beaconInformationalResponseMeta.js
    │   ├── presentation/
    │   │   └── example.js
    └── openapi/
        └── ga4gh-beacon/
            └── beacon-v2/
                    └── json/
                        └── responses/
                            ├── beaconInfoResponse.json
                            └── sections/
                                ├── beaconInfoResults.json
                                └── beaconInformationalResponseMeta.json

```

It does however pass verification using the official client:

  - [beacon-verifier](https://github.com/ga4gh-beacon/beacon-verifier): official beacon endpoint tester :D

Run: `beacon-verifier --ssl-no-verify https://10.128.0.3:9001 2>/dev/null | jq '.entities[][] | select( .valid == true )'`

```json
{
  "name": "Inst-Dept Beacon",
  "url": "https://10.128.0.3:9001/configuration",
  "valid": true,
  "error": null
}
{
  "name": "Inst-Dept Beacon",
  "url": "https://10.128.0.3:9001/info",
  "valid": true,
  "error": null
}
```

---

### WebServer/API:

The aim is to follow the endpoint structure, and automagically generate endpoints from the original openapi spec.
(Think: Swagger Code Generator for hapi).


```
node_beacon/
└── srvr/
    ├── express/
    └── hapi/
        ├── index.js
        ├── README.md
        └── router/
            └── beacon/
                ├── endpoints/
                │   ├── info/
                │   │   └── index.js
                │   ├── root.js
                └── plugin/
                    └── BeaconRouter.js
```

---

### Glossary:

What's a JSON schema?  
  - It's a way of defining the structure and field types of a JSON object

Our object: 

```json
 { foo: "bar" }
```
Could have the following json-schema definition:

```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "description": "This is a presentation json-schema!",
    "type": "object",
    "properties": {
        "foo": {
            "description": "Ubiquitous placeholder variable",
            "example": "bar",
            "type": "string"
        },
    },
}
```
 
---

Beacon reference schemas are a bit more complicated, and can include references, and embedded fields

```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": true,
    "description": "Information about the Beacon. Aimed at Beacon clients like web pages or Beacon networks.",
    "properties": {
        "meta": {
            "$ref": "./sections/beaconInformationalResponseMeta.json",
            "description": "Information about the response that could be relevant for the Beacon client in order to interpret the results."
        },
        "response": {
            "$ref": "./sections/beaconInfoResults.json",
            "description": "Metadata describing a Beacon instance."
        }
    },
    "required": [
        "meta",
        "response"
    ],
    "type": "object"
}
```

---

What's a hapi route?
  - It's a way of telling the hapi-server how to handle requests made to a specified URI, e.g.,

```javascript
server.route({
    method: 'GET',
    path: '/presentation',
    handler: function (req, res) {
      return { foo: "bar" }
    }

})
```

Assuming hapi is running on port 9001
This allows:

```httpie
http GET http://localhost:9001/presentation
```

---

  What's a vue route?

  - It's a way of telling the vue-client / web-browser how to handle requests made to a specified URI, e.g., 

```javascript
const InfoRoute =  {
    path: '/info',
    name: 'getBeaconInfoRoot',
    component: InfoView // a kind of handler in vue
}
```


---

What's a mongoose schema?

  > - It's a way of defining a mongodb model / document which allows us to store/retrieve and verify the documents conform to the schema

```javascript
import mongoose from 'mongoose'

const returnedSchemas = mongoose.Schema({
    foo: {
      type: String,
      default: "bar"
    },
})

```

---

If we compare openapi/json-schema with mongoose schemas we can it's not too difficult (in principle) to convert / create the latter from the former...

```json
{
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "additionalProperties": false,
    "description": "This is a presentation json-schema!",
    "type": "object",
    "properties": {
        "foo": {
            "description": "Ubiquitous placeholder variable",
            "example": "bar",
            "type": "string"
        },
    },
}
```

```javascript
const returnedSchemas = mongoose.Schema({
    foo: {
      type: String,
      default: "bar"
    },
})

```

We can see that there is almost an isomorphism between json-schema.properties and mongoose.Schema

In psudo-code:
 > - json-schema.properties.key(foo) == mongoose.Schema.key(foo)
 > - json-schema.properties.example == mongoose.Schema.default 
 > - json-schema.properties.type =~ mongoose.Schema.type
---


## Tech

Software: 

- > Client(s):
    - [vue](https://localhost:8080): web client / dyanamic frontend / unfinished ;)
    - [beacon-verifier](https://github.com/ga4gh-beacon/beacon-verifier): official beacon endpoint tester

- > Testing:
    - [curl](https://curl.se/docs/faq.html): manual requests (mostly testing)
    - [http](https://httpie.io/docs): manual requests (mostly testing)

- > API / Server 
    - [hapi](https://hapi.dev/tutorials/?lang=en_US): a modular web server / framework.
        - provides: api endpoints
        - is: modular
        - is: plugins based

- > Specifications
    - [OpenAPI/Swagger](https://swagger.io/specification/): used to define the structure of the framework/models within the beacon-v2 spec
    - [json-schema](https://json-schema.org/): ditto
    - [beacon-spec](https://github.com/ga4gh-beacon/beacon-v2/): the most recent beacon specs

- > DB 
    - [mongoose](https://mongoosejs.com/docs/guide.html): MongoDB object modeling for NodeJS
        - provides: CRUD methods to modify schemas, models and documents 
        - talks to the database via the native mongodb nodejs driver

    - [percona-mongodb](https://www.percona.com/software/mongodb/percona-server-for-mongodb): 
        - > (Language): c++
        - is an: open-source enterprise version of the mongodb community database server
        - is a: JSON/BSON document store
        - can: authenticate with LDAP 
        - can: encrypt data at-rest
        - is: highly-available
        - is: resilient / data-redundant 

---

## Ideas / Justifications:

  Cool and/or crazy ideas include:

  - reasons we chose javascript: 

      - mongodb basically operates on JSON Objects; or rather their binary equivalent: BSON.
      - a native javascript mongodb driver exists
      - the beacon spec is esentially openapi + json-schema defined.
  
  - try to convert openapi schemas to mongoose schemas:

      - use those as middleware to:

          - create db models/documents:
              - forces db to apriori conform to the beacon specification 
              - if the spec changes we automagically⁽™⁾ track those changes
              - allows us to bi-directionally validate documents 

          - create routes in vue / the UI.
          - perhaps also can be used to create hapi route handlers:

  Further to that:
  - try to generate hapi routes from openapi spec and/or mongoose schemas:

      - [hapi-auto-route](https://github.com/siratsimba/hapi-auto-route): reads hapi routes from files 
      - [OpenAPIRequestValidator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-validator): automagically validates requests/responses
      - [mongoose-to-swagger](https://www.npmjs.com/package/mongoose-to-swagger): converts mongoose to openapi(swagger) schemas

---

