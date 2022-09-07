/* convert mongoose schemas into Vue Component Props */

// I think an upgrade changed the internal mongoose object
const schemaToProps = function(s){
  const spath = s.paths 
  console.log("spath:", spath)
  var retProps = {}
  
  Object.entries(spath).forEach( (p) => {
    if ( p[0] != "_id" ){
      const prop = { 
        [p[0]]: { 
             type: p[1].options.type, 
          default: p[1].options.default 
        } 
      }
      // console.log("schemaToProps: " + JSON.stringify(prop))
      retProps = { ...retProps, ...prop }
    }
  })

  console.log("schemaToProps: ", retProps)
  return retProps
}

export { schemaToProps }

