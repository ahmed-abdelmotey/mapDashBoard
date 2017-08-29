"use strict"
define([
  "dojo/_base/declare",

  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/SceneLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/OpenStreetMapLayer",

  "esri/views/ui/UI",

  "app/rendererGenerator",
  "app/queryLayer",

  "esri/widgets/Search",
  "esri/widgets/Home",

  "app/RenderAPPGenerator",

  "dojo/domReady!"
], (declare, Map,SceneView,SceneLayer,FeatureLayer,OpenStreetMapLayer, UI, RendererGenerator,queryLayer, Search,Home, RenderAPPGenerator) => {

  function generateDefinitionExpression(filter) {
    return `Height > ${filter[0]} AND Height < ${filter[1]}`
    //  + " AND CNSTRCT_YR >= 1900 AND CNSTRCT_YR <= 2024";
  }
  
  return declare(null,{
    constructor: function(settings) {
      this.settings = settings; // read all settings
    },
    init: function(containers){
      var settings = this.settings;
      window.appSettings = settings;
      
      // initial filter
      var map = new Map(settings.mapOptions)

      // create layers
      var osmLayer = new OpenStreetMapLayer();
      var sceneLayer = new SceneLayer({ 
        url: settings.sceneLayerUrl,
        popupTemplate: {
          title: "building",
          content:"no attributes to display"
        } 
        // could be implemented after updating data
        // definitionExpression: "Height > 0 AND Height < 20" // Config
      })

      var collisionsLayer = new FeatureLayer({
        url: settings.collisionsLayerUrl,
        outFields:["*"],
        popupTemplate: {
          title: "{CreationDate}",
          content: [{
            type: "fields",
            fieldInfos: [
            {
              fieldName: "Category",
              label: "الفئة",
            },
            {
              fieldName: "death",
              label: "عدد الوفيات",
            },
            {
              fieldName: "injuries",
              label: "عدد الاصابات",
            },
            ]
          }]
        }
      })

      var trafficLayer = new FeatureLayer({
        url: settings.trafficLayerUrl,
        outFields:["*"],
        popupTemplate: {
          title: "{name}",
          content:"متوسط السرعه : {avgspeed} كم/س"
        }
      })

      var cameraLayer = new FeatureLayer({
        url: settings.cameraLayerUrl,
        // popupTemplate: {
        //   title: "this is not yet",
        //   content:"asdasdasd"
        // }
      })
      map.addMany([osmLayer,sceneLayer,collisionsLayer,trafficLayer,cameraLayer]);

      queryLayer(collisionsLayer,trafficLayer,cameraLayer).then(res => {
        // console.log(res)
        // expose data to dashboard
        window.appSettings.collisions = {
          layer : collisionsLayer,
          features: res.collisions.value
        }
				collisionsLayer.renderer = RenderAPPGenerator("Category",settings.collisionsLayerUrl, "", "");

        window.appSettings.cameras = {
          layer : cameraLayer,
          features: res.cameras.value
        }
				cameraLayer.renderer = RenderAPPGenerator("",settings.cameraLayerUrl, "content/image/Camera.png", "#D13470");

        window.appSettings.traffic = {
          layer : trafficLayer,
          features: res.traffic.value
        }
        // initialize dashboard
        var app = new Vue({
          el: '#card-wrapper',
          data: {
            currentList:"cards",
            filterCrashesList: ""
          },
          methods:{
            navigateLists: function(newComponent){
              switch (newComponent){
                case "pedestrian":
                  this.filterCrashesList = "pedestrian";
                  this.currentList = "crash"; 
                  break; 
                case "cyclist":
                  this.filterCrashesList = "cyclist";
                  this.currentList = "crash";  
                  break;
                case "motorist":
                  this.filterCrashesList = "motorist";
                  this.currentList = "crash"; 
                  break; 
                case 'up':
                  this.filterCrashesList = "";
                  this.currentList = "cards";
                  break;  
                default:
                  this.filterCrashesList = "";
                  this.currentList = newComponent; 
                  break;
              }
            },
          }
        })
      });

      // initialize view

      var view = new SceneView({
        map : map,
        // Config
        container: containers.view, 
        camera: settings.camera,
				popup: {
          dockEnabled: true,
          dockOptions: {
            // Disables the dock button from the popup
            buttonEnabled: false,
            // Ignore the default sizes that trigger responsive docking
            breakpoint: false,
          }
        },
      });

      var searchWidget = new Search({
        view: view
      });
      var homeWidget = new Home({
        view: view
      });

      // view.then(function() {
      //   return collisionsLayer.then(function() {
      //     var query = collisionsLayer.createQuery();
      //     console.log(query)
      //     query.outFields=["*"]
      //     return collisionsLayer.queryFeatures(query);
      //   });
      // }).then(res => console.log(res.features))
      


      view.then(()=>{
        window.view = view;
        window.popup = view.popup;
        
        // add widgets
        view.ui.add(searchWidget, {
          position: "top-right",
          index: 2
        });
        view.ui.add(homeWidget, "top-left");
        
        // expose functions to vue dashboard
        window.cameraControl = {
          homeCamera:settings.camera,
          goToPoint:(long,lat) => {
            let point= [long,lat]
            view.goTo({
              target: point,
              zoom: 18,
              heading: 360 * Math.random(),
              tilt: 30
            })
          },
          goToCamera:(camera)=>{
            view.goTo(camera);
          },
        };

        window.mapControl = {
          sceneLayer: sceneLayer,
          setRenderer: function(classBreaks){
            let rendererGen = new RendererGenerator(classBreaks, "Height");
            let renderer = rendererGen.generateCategoryRenderer();
            sceneLayer.renderer = renderer;
          }
        }
      })
      var highlight;
      window.highlight = function highlightSelected(layerName, objectId){
        var objectId = objectId || -1;
        
        var lyr = layerName === "camera" ? cameraLayer : layerName === "traffic" ? trafficLayer : collisionsLayer;
        // filter in collision layer
        if(lyr == collisionsLayer) console.log(objectId);
        view.whenLayerView(lyr).then((lyrView)=>{
        window.lyrView = lyrView
        var query = lyr.createQuery();
        query.where = "OBJECTID = " + objectId;
        lyr.queryFeatures(query).then(function(result){
            if (highlight) {
              highlight.remove();
            }
            highlight = lyrView.highlight(result.features);
          })
        }) 
      }
      // highlightSelected("aSDasd",2)
    }
  })
})