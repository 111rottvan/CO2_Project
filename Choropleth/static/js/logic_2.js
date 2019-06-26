// Creating map object
var polygon_data ;
var myMap = L.map("map", {
 center: [0, 0],
 zoom: 3
});

// Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
 attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
 maxZoom: 18,
 id: "mapbox.streets",
 accessToken: API_KEY
}).addTo(myMap);

// Link to GeoJSON
var APILink = "http://data.beta.nyc//dataset/d6ffa9a4-c598-4b18-8caf-14abde6a5755/resource/74cdcc33-512f-439c-" +
"a43e-c09588c4b391/download/60dbe69bcd3640d5bedde86d69ba7666geojsonmedianhouseholdincomecensustract.geojson";

var geojson;
var url = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";


d3.json(url , function(data){
 polygon_data = data;

var co2_data ;
d3.csv("static/js/co2.csv", function(csv_data){
 console.log(csv_data);
co2_data= csv_data.map(function(x){
if ( x["2014"].length > 0){
 return x;
}
});

var geo_row ;
var final_data = [];
for ( x=0 ; x< co2_data.length ; x++ ){
 //polygon_data.filter(  )
console.log(co2_data[x]["Country Code"]);
geo_row={};
var geo_tab = polygon_data.features.filter(a=>a.properties.ISO_A3 == co2_data[x]["Country Code"] );  //Naga : Problem in the condition. it should be "==" instead "="
if(geo_tab){
geo_row = geo_tab[0];
};
geo_row.properties.co2_value = co2_data[x]["2014"];
final_data.push(geo_row);
}
console.log(final_data);
polygon_data.features = final_data;
// console.log(final_data.properties);
// console.log(final_data.properties);

d3.json(final_data,function(feature){
console.log(feature);

    geojson = L.choropleth(final_data, {
        valueProperty: "co2_value",
        scale:["#ffffb2", "#b10026"],
        steps: 4,
        mode: "q",
        style: {
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.ADMIN + "," + feature.properties.ISO_A3 
            + "<br>Co2 Levels Per Capita:<br> (metric tons) <br>" 
            + feature.properties.co2_value);
        }
    }).addTo(myMap)




// Set up the legend
    var legend = L.control({ position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson.options.limits;
        var colors = geojson.options.colors;
        var labels = [];

        var legendinfo = "<h1>CO2 Emission</h1>" +
            "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length -1] + "</div>" +
            "</div>";
        div.innerHTML = LegendInfo;
        limits.forEach(function(limits, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);
});