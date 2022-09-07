import $RefParser from "@apidevtools/json-schema-ref-parser";

// console.log("FOO")

// should run at server startup?
let jsonParser = new $RefParser();
try {

    let endpointEntity = "analyses"
    let api = await jsonParser.dereference('../../../../../../schema/openapi/ga4gh-beacon/beacon-v2/models/json/beacon-v2-default-model/' + endpointEntity + '/defaultSchema.json');
    console.log(Object.keys( api.properties ).map( (x) => { let prop = endpointEntity + "." + x; return { [prop]: { type: api.properties[x].type } } } ) )
    // console.log(api.properties)
    // let api = await jsonParser.dereference('../../../../../../schema/openapi/ga4gh-beacon/beacon-v2/models/json/beacon-v2-default-model/genomicVariations/defaultSchema.json');
    //
    // console.log( JSON.stringify( api, null, 2 ))   
    // console.log(api)
    // console.log(jsonParser)
}

catch (err) {
  console.log("ERR: ", err )
}




