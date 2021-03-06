var m = L.map('map').setView([42.35904337942925, -71.06178045272827], 15);
var baseMaps = [
    "MapQuestOpen.OSM",
    "OpenStreetMap.Mapnik",
    "OpenStreetMap.DE",
    "Esri.WorldImagery",
   
    "Stamen.Watercolor",
];
var fills =["rgb(197,27,125)",
"rgb(222,119,174)",
"rgb(213, 62, 79)",
"rgb(84, 39, 136)",
"rgb(247,64,247)",
"rgb(244, 109, 67)",
"rgb(184,225,134)",
"rgb(127,188,65)",
"rgb(69, 117, 180)"]
var lc = L.control.layers.provided(baseMaps).addTo(m);
m.addHash({lc:lc});
var data={},layers={};
d3.json("oa.json", dealwithData)
function dealwithData(oa){
    data.json= oa.features.map(function(v){
        return [v.geometry.coordinates[1],v.geometry.coordinates[0]];
    });
    data.veronoi = d3.geom.voronoi(data.json);
    data.delaunay = d3.geom.delaunay(data.json);
    layers.points = L.layerGroup(data.json.map(function(v){
        return L.circleMarker(L.latLng(v),{radius:5,stroke:false,fillOpacity:1,clickable:false,color:fills[Math.floor((Math.random()*9))]})
    }));
    lc.addOverlay(layers.points,"points");
    layers.veronoi = L.layerGroup(data.veronoi.map(function(v){
        return L.polygon(v,{stroke:false,fillOpacity:0.7,color:fills[Math.floor((Math.random()*9))]})
    }));
    lc.addOverlay(layers.veronoi,"veronoi");
    layers.delaunay = L.layerGroup(data.delaunay.map(function(v){
        return L.polygon(v,{stroke:false,fillOpacity:0.7,color:fills[Math.floor((Math.random()*9))]})
    }));
    lc.addOverlay(layers.delaunay,"delaunay");
    layers.clusters= new L.MarkerClusterGroup();
    layers.clusters.addLayers(data.json.map(function(v){
        return L.marker(L.latLng(v));
    }));
    lc.addOverlay(layers.clusters,"clusters");
    data.quadtree = d3.geom.quadtree(data.json.map(function(v){return {x:v[0],y:v[1]};}));
    layers.quadtree = L.layerGroup();
    data.quadtree.visit(function(quad, lat1, lng1, lat2, lng2){

        layers.quadtree.addLayer(L.rectangle([[lat1,lng1],[lat2,lng2]],{fillOpacity:0,weight:1,color:"#000",clickable:false}));
        
    });
    lc.addOverlay(layers.quadtree,"quadtree");
}