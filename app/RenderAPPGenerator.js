define([
	"dojo/_base/declare"
	, "esri/renderers/UniqueValueRenderer"
	, "esri/symbols/PointSymbol3D"
	, "esri/symbols/IconSymbol3DLayer"
	, "esri/symbols/LabelSymbol3D"
	, "esri/symbols/TextSymbol3DLayer"
	, "esri/symbols/callouts/LineCallout3D"
	, "esri/core/promiseUtils"

], (declare, UniqueValueRenderer, PointSymbol3D, IconSymbol3DLayer, LabelSymbol3D, TextSymbol3DLayer, LineCallout3D, promiseUtils) => {
	var pointsRenderer;

	var verticalOffset = {
		screenLength: 40,
		maxWorldLength: 200,
		minWorldLength: 35
	};

	function getUniqueValueSymbol(name, color) {
		return new PointSymbol3D({
			symbolLayers: [
						new IconSymbol3DLayer({
					resource: {
						href: name
					},
					size: 20,
					outline: {
						color: "white",
						size: 2
					}
				})
					],
			verticalOffset: verticalOffset,
			callout: new LineCallout3D({
				color: "white",
				size: 2,
				border: {
					color: color
				}
			})
		});
	}

	return function (RendererField, FeatureLayerURL, ImagePath, Color) {
		if (RendererField === "") {
			pointsRenderer = new UniqueValueRenderer({
				uniqueValueInfos: [{
					symbol: getUniqueValueSymbol(ImagePath, Color)
				}]
			});
		} else {
			pointsRenderer = new UniqueValueRenderer({
				field: RendererField,
				uniqueValueInfos: [{
						value: "3",
						symbol: getUniqueValueSymbol("../img/icon7.png", "#F97C5A")
					},
					{
						value: "4",
						symbol: getUniqueValueSymbol("../img/images.png", "#884614")
					},
					{
						value: "5",
						symbol: getUniqueValueSymbol("../img/Cars.png", "#56B2D6")
					}]
			});
		}
		return pointsRenderer;
	}
})