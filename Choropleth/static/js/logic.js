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

var geojson;
var url = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson";

var geoData = d3.json("static/js/countries.geojson", function(geoData) {
  // var coordinates = {};
    // coordinates.type = data.type;
    // coordinates.features = [];
console.log(geoData.features);
// var coordinate = geoData.cordinates;
  

L.geoJSON(geoData.features, function(feature) {
  console.log(feature.properties);
  console.log("testing");
}).addTo(myMap);

});



d3.json(url , function(data){
  polygon_data = data;

console.log(data);
var co2_data ;
d3.csv("static/js/co2.csv", function(csv_data){
 co2_data= csv_data.map(function(x){
if ( x["2014"].length > 0){
  return x;
}
});

var geo_row ;
var final_data = [];
for ( x=0 ; x< co2_data.length ; x++ ){
  //polygon_data.filter(  )
// console.log(co2_data[x]["Country Code"]);
geo_row={};
var geo_tab = polygon_data.features.filter(a=>a.properties.ISO_A3 = co2_data[x]["Country Code"] );
if(geo_tab){
geo_row = geo_tab[0];
};
geo_row.properties.co2_value = co2_data[x]["2014"];
final_data.push(geo_row);
}

polygon_data.features = final_data;
console.log(polygon_data);

//L.geoJson(polygon_data).addTo(myMap);

// Our style object
var mapStyle = {
  color: "white",
  fillColor: "pink",
  fillOpacity: 0.5,
  weight: 1.5
};

console.log(myMap);
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(polygon_data, {
    // Passing in our style object
    style: mapStyle
  }).addTo(myMap);

console.log(myMap);           
});


});



/*
geojson = L.choropleth(polygon_data, {

  // Define what  property in the features to use
  valueProperty: "co2_value",

  // Set color scale
  scale: ["#ffffb2", "#b10026"],

  // Number of breaks in step range
  steps: 10,

  // q for quartile, e for equidistant, k for k-means
  mode: "q",
  style: {
    // Border color
    color: "#fff",
    weight: 1,
    fillOpacity: 0.8
  },

  // Binding a pop-up to each layer
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<br>Median Household Income:<br>" +
      "$" + feature.properties.co2_value);
  }
}).addTo(myMap);

// Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var limits = geojson.options.limits;
  var colors = geojson.options.colors;
  var labels = [];

  // Add min & max
  var legendInfo = "<h1>Median Income</h1>" +
    "<div class=\"labels\">" +
      "<div class=\"min\">" + limits[0] + "</div>" +
      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

  div.innerHTML = legendInfo;

  limits.forEach(function(limit, index) {
    labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  });

  div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  return div;
};

// Adding legend to the map
legend.addTo(myMap);






});


});

*/
/*


// Grab data with d3
d3.json(APILink, function(data) {
  // Create a new choropleth layer
  console.log(data)

  geojson = L.choropleth(data, {

    // Define what  property in the features to use
    valueProperty: "MHI",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(feature.properties.LOCALNAME + ", " + feature.properties.State + "<br>Median Household Income:<br>" +
        "$" + feature.properties.MHI);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);

}); */