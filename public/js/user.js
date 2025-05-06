const socket = io();

const name = prompt("Enter your name or device name:");
socket.emit("register-user", { name });

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(position => {
    const { latitude, longitude } = position.coords;
    socket.emit("send-location", { latitude, longitude });
  }, error => {
    console.error("Geolocation error:", error);
  }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
} else {
  alert("Geolocation is not supported by your browser");
}
