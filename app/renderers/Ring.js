define(["dojo/_base/lang", "esri/core/declare", "esri/views/3d/externalRenderers"], function (g, h, f) {
  var c = window.THREE,
    d = {
      width: 50,
      height: 500,
      color: "#ffffff",
      loop: !1
    };
  return h([], {
    constructor: function (a, b, e) {
      this.view = a;
      g.mixin(d, e);
      this.origin = [0, 0, 0];
      b = [b.x, b.y, b.z || 0];
      f.toRenderCoordinates(a, b, 0, a.spatialReference, this.origin, 0, 1);
      e = new c.Matrix4;
      e.fromArray(f.renderCoordinateTransformAt(this.view, b, a.spatialReference, Array(16)));
      this.rotation = new c.Matrix4;
      this.rotation.extractRotation(e);
      this.counter =
        0
    },
    setup: function (a) {
      this.renderer = new c.WebGLRenderer({
        context: a.gl,
        premultipliedAlpha: !1
      });
      this.renderer.autoClear = !1;
      this.renderer.autoClearDepth = !1;
      this.renderer.autoClearColor = !1;
      this.renderer.autoClearStencil = !1;
      this.scene = new c.Scene;
      this.camera = new c.PerspectiveCamera;
      this._createLights();
      this._createObjects();
      a.resetWebGLState()
    },
    render: function (a) {
      this.renderer.resetGLState();
      this._animate();
      this._updateCamera(a);
      this._updateLights(a);
      this.renderer.render(this.scene, this.camera);
      (d.loop ||
        1 > this.counter) && f.requestRender(this.view);
      this.renderer.resetGLState()
    },
    dispose: function () {
      this.object && this.scene.remove(this.object)
    },
    _clearScene: function () {
      this.circle && (this.scene.remove(this.circle), this.circle = null);
      this.ring && (this.scene.remove(this.ring), this.ring = null)
    },
    _createObjects: function () {
      this._clearScene();
      var a = new c.TorusGeometry(d.width, 4, 16, 80),
        b = new c.MeshPhongMaterial({
          color: d.color,
          transparent: !0,
          opacity: .75
        });
      this.ring = new c.Mesh(a, b);
      this.ring.applyMatrix(this.rotation);
      this.scene.add(this.ring)
    },
    _createLights: function () {
      this.directionalLight = new c.DirectionalLight;
      this.scene.add(this.directionalLight);
      this.ambientLight = new c.AmbientLight;
      this.scene.add(this.ambientLight)
    },
    _animate: function () {
      var a = d.height / 100;
      this.counter = 2 > this.counter ? this.counter + .01 : 0;
      var b = a;
      1 < this.counter && (b = 0 - a);
      this.ring.translateZ(b)
    },
    _updateCamera: function (a) {
      a = a.camera;
      this.camera.projectionMatrix.fromArray(a.projectionMatrix);
      var b = this.origin;
      this.camera.position.set(a.eye[0] - b[0],
        a.eye[1] - b[1], a.eye[2] - b[2]);
      this.camera.up.set(a.up[0], a.up[1], a.up[2]);
      this.camera.lookAt(new c.Vector3(a.center[0] - b[0], a.center[1] - b[1], a.center[2] - b[2]))
    },
    _updateLights: function (a) {
      var b = a.sunLight.direction,
        c = a.sunLight.diffuse;
      this.directionalLight.color.setRGB(c.color[0], c.color[1], c.color[2]);
      this.directionalLight.intensity = c.intensity;
      this.directionalLight.position.set(b[0], b[1], b[2]);
      a = a.sunLight.ambient;
      this.ambientLight.color.setRGB(a.color[0], a.color[1], a.color[2]);
      this.ambientLight.intensity =
        a.intensity
    }
  })
});