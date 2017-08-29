define(()=> {return {
  // sceneLayerUrl:"http://tiles.arcgis.com/tiles/GivVPBTZqiQP20fU/arcgis/rest/services/MuscatBuilding/SceneServer",
  sceneLayerUrl:"https://tiles.arcgis.com/tiles/n8DZcMxnIWosk4zB/arcgis/rest/services/Oman_Muscot_Buildings/SceneServer",
  collisionsLayerUrl:"https://services8.arcgis.com/Woy8vqQzyeNPUshP/arcgis/rest/services/collisions/FeatureServer/0",
  trafficLayerUrl:"https://services6.arcgis.com/MpMgnqDDock1cXyj/arcgis/rest/services/roadlayer/FeatureServer/0",
  cameraLayerUrl:"https://services6.arcgis.com/MpMgnqDDock1cXyj/ArcGIS/rest/services/omancameraslayer/FeatureServer/0",
  
  // sceneLayerUrl:"https://tiles.arcgis.com/tiles/n8DZcMxnIWosk4zB/arcgis/rest/services/Oman_Muscot_Buildings/SceneServer",
  // initial breaks used in visualization
  classBreaks: [
    { minValue: 2, maxValue: 6, color: [153, 167, 204] },
    { minValue: 7, maxValue: 10, color: [149, 184, 214] },
    { minValue: 11, maxValue: 13, color: [153, 204, 203] },
    { minValue: 13, maxValue: 20, color: [153, 204, 179] },
  ],
  // mapOptions:{
  //   // basemap: "dark-gray",
  //   // ground: "world-elevation"
  // },
  // camera:{"position":{"x":6504089.067435301,"y":2702713.993236477,"z":570.6694733127952,"spatialReference":{"wkid":102100}},"heading":338.5549815836854,"tilt":50.80958553013859},
  camera:{"position":{"x":6516938.561784094,"y":2703874.466550498,"z":411.80719499103725,"spatialReference":{"latestWkid":3857,"wkid":102100}},"heading":37.0050251462459,"tilt":65.6607866189004},
 
  }
})