define([
  "esri/tasks/support/Query",
  "esri/tasks/QueryTask",
  "esri/core/promiseUtils",
  "esri/geometry/support/webMercatorUtils",

],(Query,QueryTask,promiseUtils,webMercatorUtils)=>{

  function queryCollisions(collisions){

    var collisionsQuery = collisions.createQuery();
    collisionsQuery.outFields = ["*"];
    return collisions.queryFeatures(collisionsQuery).then((res)=> res.features.map(c=> {
      var cat = c.attributes.Category;
      cat = cat == 3 ? "pedestrian" : cat == 4 ? "cyclist" : "motorist"; 
      return {
        location:[
          c.geometry.longitude,
          c.geometry.latitude
        ],
        attributes:{
          creationDate: c.attributes.CreationDate,
          death: c.attributes.death,
          injuries: c.attributes.injuries,
          type: c.attributes.Category,
          category: cat
        },
        OBJECTID : c.attributes.OBJECTID
      }
    }))
  }

  function queryTraffic(traffic){
    var trafficQuery = traffic.createQuery();
    trafficQuery.outFields = ["name","avgspeed", "OBJECTID"];
    return traffic.queryFeatures(trafficQuery).then((res)=> res.features.map(c=> {
      var pnts = c.geometry.paths[0];
      var pnt = pnts[Math.round(pnts.length / 2)];
      return {
        location:webMercatorUtils.xyToLngLat(pnt[0], pnt[1]),
        attributes:{
          name: c.attributes.name,
          avgSpeed: c.attributes.avgspeed,
        },
        OBJECTID : c.attributes.OBJECTID
      }
    }))
  }

  function queryCameras(cameras){
    var camerasQuery = cameras.createQuery();
    camerasQuery.outFields = ["*"];
    return cameras.queryFeatures(camerasQuery).then((res)=> res.features.map(c=> {
      // var pnts = c.geometry.paths[0];
      return {
        location:[
          c.geometry.longitude,
          c.geometry.latitude
        ],
        attributes:{
          cameraUrl: c.attributes.cameraurl,
          streetName: c.attributes.streetname,
        },
        OBJECTID : c.attributes.OBJECTID
      }
    }))
  }
  
  return function(collisions,traffic,cameras){

    // console.log(collisions)
    var collisionsQuery = collisions.createQuery();

    return promiseUtils.eachAlways({
      collisions: queryCollisions(collisions),
      traffic: queryTraffic(traffic),
      cameras: queryCameras(cameras)
    })



    // var queryTask = new QueryTask({
    //   url: "https://services8.arcgis.com/Woy8vqQzyeNPUshP/arcgis/rest/services/collisions/FeatureServer/0"
    // });

    // var query = new Query();
    // query.returnGeometry = true;
    // query.outFields = ["*"];
    // query.where = "1 = 1";  // Return all cities with a population greater than 1 million

    // // When resolved, returns features and graphics that satisfy the query.
    // queryTask.execute(query).then(function(results){
    //   // collisions
    //   console.log(results.features.map(c=> {
    //     var cat = c.attributes.Category;
    //     cat = cat == 3 ? "pedestrian" : cat == 4 ? "cyclist" : "motorist"; 

    //     return {
    //     location:[
    //       c.geometry.longitude,
    //       c.geometry.latitude
    //     ],
    //     attributes:{
    //       creationDate: c.attributes.CreationDate,
    //       death: c.attributes.death,
    //       injuries: c.attributes.injuries,
    //       type: cat,
    //       category: c.attributes.Category
    //     }
    //   }}));
      
    // });
  }
})