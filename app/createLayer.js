define([
  "esri/layers/FeatureLayer",
  "esri/geometry/Polyline",

],(FeatureLayer,Polyline)=>{

  return function(geoJson, fields , renderer) {

    var graphics = geoJson.features.map((feature, i) => {
      return {
        geometry: new Polyline({hasZ: false,
                    hasM: true, 
                    paths: feature.geometry.coordinates,
                    spatialReference: { 
                                wkid: 102100 }}),
        attributes: {
          ObjectID: i,
          streetName: feature.properties.streetName,
          avgSpeed: feature.properties.avgSpeed
        }
      };
    })
    lyr = new FeatureLayer({
      source: graphics,
      fields: fields,
      objectIdField: "ObjectID",
      renderer: renderer,
      geometryType: "polyline",
      popupTemplate: {
        title: "asdasd",
      },
      disablePopup: false,
    });	
    return lyr;
  }
})