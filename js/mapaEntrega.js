window.mostrarRutaEntrega = (latTienda, lngTienda, latCliente, lngCliente) => {
    const mapaDiv = document.getElementById("mapa-entrega");
    
    try {
        // Limpiar mapa existente
        if (window.entregaMap) {
            window.entregaMap.remove();
        }
        mapaDiv.innerHTML = "";

        // Crear mapa centrado en el punto medio
        const centerLat = (latTienda + latCliente) / 2;
        const centerLng = (lngTienda + lngCliente) / 2;
        
        window.entregaMap = L.map(mapaDiv).setView([centerLat, centerLng], 13);

        // Capa base (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
        }).addTo(window.entregaMap);

        // Iconos personalizados
        const tiendaIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776000.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        const clienteIcon = L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
        });

        // Marcadores
        L.marker([latTienda, lngTienda], { icon: tiendaIcon })
            .addTo(window.entregaMap)
            .bindPopup("<b>Tienda</b><br>Punto de partida")
            .openPopup();

        L.marker([latCliente, lngCliente], { icon: clienteIcon })
            .addTo(window.entregaMap)
            .bindPopup("<b>Cliente</b><br>Punto de entrega");

        // Línea de ruta con estilo mejorado
        L.polyline(
            [
                [latTienda, lngTienda],
                [latCliente, lngCliente]
            ],
            {
                color: '#3498db',
                weight: 5,
                opacity: 0.7,
                dashArray: '10, 10',
                lineJoin: 'round'
            }
        ).addTo(window.entregaMap);

        // Ajustar el zoom para mostrar ambos puntos
        window.entregaMap.fitBounds([
            [latTienda, lngTienda],
            [latCliente, lngCliente]
        ], { padding: [50, 50] });

        // Añadir control de escala
        L.control.scale().addTo(window.entregaMap);

    } catch (error) {
        console.error("Error al mostrar el mapa:", error);
        mapaDiv.innerHTML = `<div class="alert alert-danger">Error al cargar el mapa: ${error.message}</div>`;
    }
};

window.mostrarMapaEntregaRuta = function (mapId, latDelivery, lngDelivery, latCliente, lngCliente) {
    const mapDiv = document.getElementById(mapId);
    mapDiv.innerHTML = ""; // Limpia cualquier contenido previo

    const map = L.map(mapId).setView([latCliente, lngCliente], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Leaflet"
    }).addTo(map);

    const markerDelivery = L.marker([latDelivery, lngDelivery]).addTo(map).bindPopup("Delivery").openPopup();
    const markerCliente = L.marker([latCliente, lngCliente]).addTo(map).bindPopup("Cliente");

    const ruta = L.polyline([
        [latDelivery, lngDelivery],
        [latCliente, lngCliente]
    ], { color: "blue", weight: 4, opacity: 0.7 }).addTo(map);

    map.fitBounds(ruta.getBounds(), { padding: [30, 30] });
};

