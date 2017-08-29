 require([
  "app/application",
  "app/settings",
  "dojo/domReady!"
], function (Application, settings) {
    require(["esri/config"], function(esriConfig) {
        esriConfig.request.corsEnabledServers.push("localhost:3000");
    });
    // initialize application
    var app = new Application(settings);
    app.init({ view: "viewDiv" });
});