mapboxgl.accessToken = mbx;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: spot.geometry.coordinates, // starting position [lng, lat]
    zoom: 12 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl(), 'top-right');


new mapboxgl.Marker()
    .setLngLat(spot.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
            .setHTML(
                `<h3>${spot.name}</h3><p>${spot.location}</p>`
            )
    )
    .addTo(map)