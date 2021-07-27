map.on("click", function (e) {
        const geojson = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                geometry: { type: "Point", coordinates: [e.lngLat.lng, e.lngLat.lat] }
            }]
        };
    
        // add coordinates to form
        form.coordinates.value = `${e.lngLat.lat},${e.lngLat.lng}`;
    
        // display marker on map
        spotPin.setLngLat(geojson.features[0].geometry.coordinates)
            .addTo(map)
});