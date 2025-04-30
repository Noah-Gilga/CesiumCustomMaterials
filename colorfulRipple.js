var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var matGLSL =
    'czm_material czm_getMaterial(czm_materialInput materialInput) \n' +
    '{ \n' +
    'czm_material m = czm_getDefaultMaterial(materialInput);\n' +
    'vec2 uv = materialInput.st; \n' +
    'uv = uv.xy ; \n' +
    'vec3 col = vec4(uv,0.5+0.5*sin(czm_frameNumber*10.0),1.0).xyz; \n' +
    'vec3 texcol; \n' +
    'vec2 center = vec2(0.5,0.5); \n' +
    'float x = (center.x-uv.x); \n' +
    'float y = (center.y-uv.y);\n' +
    'float r = -(x*x + y*y); \n' +
     'float z = 1.0 + 0.5*sin((r+czm_frameNumber* 0.0015)/0.013); \n' +
    'texcol.x = z; \n' +
    'texcol.y = z; \n' +
    'texcol.z = z; \n' +
    'm.diffuse = vec3(col*texcol); \n' +
    'm.alpha = 1.0; \n' +
    //如果这里需要透明度根据变化可以使用 'm.alpha = abs(sin((r+czm_frameNumber* 0.0015)/0.013)-1.0); \n' +
    'return m; \n' +
    '} \n'

var myMat = new Cesium.Material({
    fabric: {
        type: 'RippleMaterial',
        uniforms: {
            color: new Cesium.Color(0.0, 1.0, 0.0) // light color
        },
        source: matGLSL
    }
});

var primitive = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(100.0, 31.0, 110.0, 39.0),
            vertexFormat: Cesium.VertexFormat.ALL
        })
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: myMat
    })
});

// Add instances to primitives
scene.primitives.add(primitive);

viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(105.0, 35.0, 4500000.0)
});
