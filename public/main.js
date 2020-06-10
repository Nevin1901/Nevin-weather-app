$(function () {
  var socket = io();

  var $temp = document.getElementById("temperature");
  var $humidity = document.getElementById("humidity");
  var $description = document.getElementById("description");
  var $openWeatherIframe = document.getElementById("openWeatherIframe");
  var $backgroundImage = document.getElementById("backgroundImage");

  var $name = document.getElementById("name");
  // TODO : Implement unsplash api random background image which gets its description from openweather

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setMapPos(position);
        sendPos(position);
      });
    } else {
      console.log("Error: Unable to get position");
    }
  };

  const sendPos = (position) => {
    console.log(position);
    socket.emit(
      "client send location",
      position.coords.latitude,
      position.coords.longitude
      //parseFloat(position.coords.latitude).toFixed(3),
      //parseFloat(position.coords.longitude).toFixed(3)
    );
  };

  const setMapPos = (position) => {
    $openWeatherIframe.src =
      "https://openweathermap.org/weathermap?basemap=map&cities=true&layer=temperature&lat=" +
      position.coords.latitude +
      "&lon=" +
      position.coords.longitude +
      "&zoom=8";
  };

  socket.on("server send weather data", (weatherData) => {
    $temp.innerHTML = "🌡️ Temperature: " + weatherData.temperature + "°C";
    $humidity.innerHTML = "💨 % Humidity: " + weatherData.humidity;
    $description.innerHTML = "📜 Description: " + weatherData.description;
  });

  socket.on("server send background image", (authorData) => {
    setBackgroundImage(authorData.image);
    $name.innerHTML = authorData.name;
    $name.href = authorData.profile;
  });
  const setBackgroundImage = (image) => {
    $backgroundImage.style.backgroundImage = "url(" + image + ")";
    $backgroundImage.style.backgroundSize = "center";
    //document.body.style.backgroundImage = "url(" + image + ")";
  };

  const requestImage = () => {
    socket.emit("client request unsplash image");
  };

  requestImage();
  getLocation();
});
