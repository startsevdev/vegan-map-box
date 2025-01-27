mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRzZXZkZXYiLCJhIjoiY2t0NGJzYTFvMHdrbzJucjFnN3I3czZpZSJ9.90wyuWzjUJGVVKDdS5FqdQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/startsevdev/ckyndktz8000u15rosp2lim9u',
    center: [30.308653, 59.939737],
    zoom: 12
});


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
    var markerCheck = document.getElementById("selected-marker");
        if (markerCheck) {
            markerCheck.remove();
    };

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    const popupOffsets = {
        'top': [20, 20],
        'bottom': [20, -20],
    };

    //фунция расположения popup
    function anchorCheck () {
        var clientClick = e.originalEvent.clientY;
        var clientWin = ((document.documentElement.clientHeight-72)/2);

        if (clientClick > (clientWin)) {
            return "bottom";
        } else {
            return "top";
        }
    }

    function checkStatus (status) {
        switch (status) {
            case "100% VEGAN":
                positions = "";
                return `<div class="status" style="color:#1B7340">${status}</div>`
                
            case "ТОЛЬКО КУХНЯ":
                positions = "";
                return `<div class="status" style="color:#1A8B9D">${status}</div>`
            case "БОЛЬШЕ 3 БЛЮД":
                positions = "";
                return `<div class="status" style="color:#2D73DB">${status}</div>`
            case "ДО 3 БЛЮД":
                return `<div class="status" style="color:rgba(16, 16, 16, 0.5)">${status}</div>`
            case "UTROO":
                return `<a class="utroo" title="Веган-завтраки в рамках фестиваля UTROO" href="https://www.instagram.com/p/CTjbJV3MiDR/">
                            <div class="status" style="color:rgba(16, 16, 16, 0.7)">ЗАВТРАКИ</div>
                        </a>`
            case "UTROO BAKERY":
                return `<a class="utroo" title="Веган-завтраки в рамках фестиваля UTROO (только десерты)" href="https://www.instagram.com/p/CTjbJV3MiDR/">
                            <div class="status" style="color:rgba(16, 16, 16, 0.7)">ЗАВТРАКИ</div>
                        </a>`
            default:
                return `<div class="status" style="color:rgba(16, 16, 16, 0.5)">${status}</div>`
        }
    }

    var popup = new mapboxgl.Popup({anchor: anchorCheck(), offset: popupOffsets, className: 'info-div'})
    .setLngLat(coordinates)
    .setHTML(

        `<div class="info">

            <div class="img">
                <img class="background"src=${'img/'+id+'.jpg'}></img>
            </div>
  
            <div class="card">
                <a class="geo" href=${linkMaps (moveX,moveY)} title="Маршрут до заведения"><img id="directions" class ="instagram" src="icon/directions.png"></img></a>
                <a class="link" href=${link} title="Instagram"><img id="instagram" class ="instagram" src="icon/instagram.png"></img></a>
         
                ${checkStatus(status)}
                <div class="name">${name}</div>

                <div class="address">${address}</div>
                <div class="positions">${positions}</div>
            </div>

        </div>`
    
    )
    .addTo(map);
                // <div class="name"><a href=${link}>${name}</a></div>
    var marker = document.createElement('div');
    marker.id = 'selected-marker';
    new mapboxgl.Marker(marker)
        .setLngLat([moveX, moveY])
        .addTo(map); 
        var currentZoom = map.getZoom();


        



    $(function(){
        if ((window.innerWidth <= 820)) {
            updateContainer();
        };  
    });

    

    $(function(){
        if ((window.innerWidth > 820)) {

            var geo = document.getElementById("directions");
            geo.addEventListener("mouseover", function() { 
                geo.src="icon/directions-hover.png";
            });
            geo.addEventListener("mouseout", function() { 
                geo.src="icon/directions.png";
            });
            var inst = document.getElementById("instagram");
            inst.addEventListener("mouseover", function() { 
                inst.src="icon/instagram-hover.png";
            });
            inst.addEventListener("mouseout", function() { 
                inst.src="icon/instagram.png";
            });
            
            map.on('zoom', () => {
                if (map.getZoom() > currentZoom + 0.2 || map.getZoom() < currentZoom - 0.2)
                popup.remove();
            })
    
        }
    });

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

//функция listener size window
$(document).ready(function () {
    updateContainer();

    $(window).resize(function() {
        updateContainer();
    });
});

//функция позиционирования мобильного popup
function updateContainer(){  
    var mobilePopUp = $(".mapboxgl-popup");
    if (window.innerWidth <= 820) {
        mobilePopUp.attr('style', 'top: '+($(window).height() - ((mobilePopUp.height())) + ((mobilePopUp.height()/2)-56))+'px !important');
    } else if (window.innerWidth >= 820) {
        mobilePopUp.attr('style', 'top: 0 !important');
    }
};

//адаптивная ссылка
function linkMaps (moveX,moveY) {
    var userDeviceArray = [
        {device: 'Android', platform: /Android/, link: "geo:0,0?q="},
        {device: 'iPhone', platform: /iPhone/, link: "maps:?q="},
        {device: 'iPad', platform: /iPad/, link: "maps:?q="}
    ];
    
    var platform = navigator.userAgent;

    for (var i in userDeviceArray) {
        if (userDeviceArray[i].platform.test(platform)) {
            return userDeviceArray[i].link + moveY + "," + moveX;
        } 
    }
    return "https://yandex.ru/maps/?whatshere[point]=" + moveX  + "," + moveY + "&whatshere[zoom]=13";
}



