mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRzZXZkZXYiLCJhIjoiY2t0NGJzYTFvMHdrbzJucjFnN3I3czZpZSJ9.90wyuWzjUJGVVKDdS5FqdQ';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/startsevdev/cktjy3gu04gvl18wb2slmtse1',
center: [30.308653, 59.939737],
zoom: 12
});

// function checkBox () {

//     if (window.innerWidth <= 820) {
//         var mapBox = document.querySelector(".mapboxgl-popup");
//         mapBox.style = "top : calc(100% - (" + ((mapBox.offsetHeight/2) + 8) + "px)) !important;";
//         mapBox = null;
//     }

// }

map.on('click', 'places', (e) => {
    
    const coordinates = e.features[0].geometry.coordinates.slice();
    var moveX = e.features[0].geometry.coordinates[0];
    var moveY = e.features[0].geometry.coordinates[1];
    var shopProp = e.features[0].properties;
    var name = shopProp.name;
    var link = shopProp.link;
    var status = shopProp.status;
    var address = shopProp.address;
    var positions = shopProp.positions;
    var id = shopProp.id;
    
    // console.log("coordinates="+coordinates);
    // console.log("moveX="+moveX);
    // console.log("moveY="+moveY);
    // console.log(shopProp);
    // var windowWidth = (window.innerWidth >= 820) ? (0.015) : 0.001;
// Ensure that if the map is zoomed out such that multiple
// copies of the feature are visible, the popup appears
// over the copy being pointed to.


var markerCheck = document.getElementById("selected-marker");
if (markerCheck) {
    markerCheck.remove();
};

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const markerHeight = 20;
    const markerRadius = 20;
    const linearOffset = 20;
    const popupOffsets = {
        'top': [20, 20],
        'top-left': [20, 20],
        'top-right': [20, 20],
        'bottom': [20, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius*2, (markerHeight - markerRadius) * -1],
        'right': [0, (markerHeight - markerRadius) * -1]
    };

function checkImages (id) {
    var src = "img/"+id+".jpg";
    src.onerror = function() {
        src = "img/"+id+".png";
    };
    return src;
};

function checkStatus (status) {
    console.log(status);
    switch (status) {
        case "100% VEGAN":
            positions = "";
            return "#1B7340"
        case "ТОЛЬКО КУХНЯ":
            positions = "";
            return "#1A8B9D"
        case "БОЛЬШЕ ТРЁХ БЛЮД":
            positions = "";
            return "#2D73DB"
        case "ДО ТРЁХ БЛЮД":
            return "rgba(16, 16, 16, 0.5)"
        default:
            return "rgba(16, 16, 16, 0.5)"
    }
}

    new mapboxgl.Popup({offset: popupOffsets, className: 'info-div'})
    .setLngLat(coordinates)
    .setHTML(

        `<div class="info">

            <div class="img"><img class="background"src=${checkImages(id)}></img></div>

            <div class="card">
            <a class="link" href=${link}><img class ="instagram" src="icon/instagram.png"></img></a>
                <div class="status" style="color:${checkStatus(status)}">${status}</div>
                <div class="name">${name}</div>
                <div class="address">${address}</div>
                <div class="positions">${positions}</div>
            </div>

        </div>`
    
    )
    .addTo(map);


// //Выбранный маркер
    var marker = document.createElement('div');
    marker.id = 'selected-marker';
    new mapboxgl.Marker(marker)
    .setLngLat([moveX, moveY])
    .addTo(map);    
});

// Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', () => {
    map.getCanvas().style.cursor = 'pointer';
    });

// Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', () => {
    map.getCanvas().style.cursor = '';
    });

// Add geolocate control to the map.
    map.addControl(
        new mapboxgl.GeolocateControl({
        positionOptions: {
        enableHighAccuracy: true
        },
// When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
// Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
        })
);

