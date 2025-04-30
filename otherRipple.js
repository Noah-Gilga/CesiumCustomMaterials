var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;

var matGLSL =
     'vec3 drawCircle(vec2 pos, float radius, float width, float power, vec4 color) \n' +
    '{ \n' +
    'float dist1 = length(pos); \n' +
    'dist1 = fract((dist1 * 5.0) - fract(czm_frameNumber/60.0));\n' +
    'float dist2 = dist1 - radius; \n' +
    'float intensity = pow(radius / abs(dist2), width);  \n' +
    'vec3 col = color.rgb * intensity * power * max((0.8- abs(dist2)), 0.0);  \n' +
     'return col;  \n' +
    '} \n' +
     'vec3 hsv2rgb(float h, float s, float v) \n' +
    '{ \n' +
    'vec4 t = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0); \n' +
    'vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w)); \n' +
    'return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s); \n' +
    '} \n' +
    'czm_material czm_getMaterial(czm_materialInput materialInput) \n' +
    '{ \n' +
    'czm_material m = czm_getDefaultMaterial(materialInput);\n' +
    'vec2 uv = materialInput.st; \n' +
    'uv = uv.xy*2.0 ; \n' +
    'uv += vec2(-1.0, -1.0); \n' +
    'float h = mix(0.5, 0.65, length(uv)); \n' +
    'vec4 color = vec4(hsv2rgb(h, 1.0, 1.0), 1.0); \n' +
    'float radius = 1.0;\n' +
    'float width = 1.0; \n' +
    'float power = 0.3;\n' +
    'vec3 finalColor = drawCircle(uv, radius, width, power, color); \n' +
     'uv = abs(uv); \n' +
    'm.diffuse = vec3(finalColor); \n' +
    'm.alpha = finalColor.z/2.0; \n' +
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
