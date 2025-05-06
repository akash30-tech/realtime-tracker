const socket = io();
socket.emit("join-admin");

const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const markers = {};

socket.on("user-location", data => {
  const { id, latitude, longitude, name } = data;
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(name)
      .openPopup();
  }
});

socket.on("user-disconnected", id => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
