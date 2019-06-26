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
console.log(final_data.properties);
// console.log(final_data.properties);



L.geoJSON(final_data,

 { onEachFeature: function(feature, layer) {
    console.log(feature.properties);
   layer.bindPopup(feature.properties.ADMIN + ", " + feature.properties.ISO_A3 + "<br>Co2 Levels Per Capita:<br> (metric tons) <br>" + feature.properties.co2_value);



 },

   style: function(feature) {
       if(feature.properties.co2_value >1) {
           return {color: "#ff0000"};
       }
       else
       {
           return {color: "#000000"};
       }
   }

 }
 ).addTo(myMap);
return;


 // Creating a geoJSON layer with the retrieved data
//   L.geoJson(final_data

//     , {
//     // Passing in our style object
//     pointToLayer: function (feature, latlng) {
//  return  L.polygon(latlng, {color: 'red'})
//     // style: mapStyle
//     }
//   // addTo(myMap);

//   // myMap.fitBounds(poly.getBounds());



// }).addTo(myMap);;
});

});