define([
  "dojo/_base/declare",

  "esri/renderers/ClassBreaksRenderer",

  "esri/symbols/MeshSymbol3D",
  "esri/symbols/FillSymbol3DLayer"

],(declare,ClassBreaksRenderer,MeshSymbol3D,FillSymbol3DLayer)=>{

  function generateClassBreakInfos(classBreaks){
    return classBreaks.map((e)=>{
      return {
        minValue: e.minValue,
        maxValue: e.maxValue,
        symbol: new MeshSymbol3D({
          symbolLayers: [new FillSymbol3DLayer({
            material: { color: e.color }
          })]
        }),
      }
    })
  }

  return declare(null,{
    constructor: function(classBreaks, field , symbol) {
      this.classBreaks = classBreaks;
      this.field = field;
    },
    // functions to generate a renderer (multible types)
    
    generateCategoryRenderer:function(){
      return new ClassBreaksRenderer({
        field: this.field,
        classBreakInfos : generateClassBreakInfos(this.classBreaks)
      });
    }
  })
})