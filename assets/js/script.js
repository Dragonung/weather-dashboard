var APIkey = 'cfb525ff3512b1476203cdd6586b9e8b';
var cityname = "San Jose";

var date = moment().format('M/D/YYYY');

var cityHistory = [];
//will keep text value of search and save it to an array, then local storage
$('.search').on("click", function (event) {
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.searchkeyword').val().trim();
    if (city === "") {
        return;
    };
    cityHistory.push(city);

    localStorage.setItem('city', JSON.stringify(cityHistory));
    weekForecastEl.empty();
    getHistory();
    getWeatherToday();
});

//able to press buttons for previously searched cities
var contHistEl = $('.cityHistory');
function getHistory(){
    contHistEl.empty();

    for (let i=0; i < cityHistory.length; i++){

        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityHistory[i]}`)

        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-ouline-secondary histBtn');
        btnEl.attr('type', 'button');

        contHistEl.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city){
        return;
    }
    //allows buttons to search
    $('.histBtn').on("click", function(event){
        event.preventDefault();
        city = $(this).text();
        fiveForecastEl.empty();
        getWeatherToday();
    })
}
//Grabbing the 'Today' card body
var cardToday = $('.Todaycard')
//applying today's data weather data
function getWeatherToday() {
    var getCurrentURL = `api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

    $(cardToday).empty();

    fetch(getCurrentURL, {
        method: 'GET',
    }).then(function (response) {
        //City name
        $('.cardTodayCityName').text(response.name);
        //Today date
        $('.cardTodayDate').text(date);
        //Icon 
        $('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        //Temperature
        var Temp = $('<p>').text(`Temp: ${response.main.temp} °F`);
        cardToday.append(Temp);
        //Wind Speed
        var Wind = $('<p>').text(`Wind: ${response.wind.speed} MPH`);
        cardToday.append(Wind);
        //Humidity
        var Humidity = $('<p>').text(`Humidity: ${reponse.main.humidity} %`);
        cardToday.append(Humidity);
    });

    FiveDayForecast();
};

var fiveForecastEl = $('.weekForcast');

//applying the 5-day forecast below today's date data
function FiveDayForecast() {
    var getFiveDayURL = `api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${APIkey}`;

    fetch(getFiveDayURL, {
        method: 'GET',
    }).then(function (response) {
        var weekArray = response.list;
        var weekWeather = [];
        //object to streamline data
        $.each(weekArray, function (index, value) {
            testObj = {
                date: value.dt_txt.split(' ')[0],
                icon: value.weather[0].icon,
                temp: value.main.temp,
                wind: value.wind.speed,
                humidity: value.main.humidity
            }

            weekWeather.push(testObj);
        })

        localStorage.setItem('forecast', JSON.stringify(testObj));
        
        //Add cards to the screen
        for (let i = 0; i < weekWeather.length; i++) {

            var divElCard = $('<div>');
            divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
            divElCard.attr('style', 'max-width: 200px;');
            fiveForecastEl.append(divElCard);

            vardivElHeader = $('<div>');
            divElHeader.attr('class', 'card-header')
            var date = moment(`{weekWeather[i].date}`).format('M/D/YYYY');

            var divElBody = $('<div>');
            divElBody.attr('class', 'card-body');
            divElCard.append(divElBody);

            var divElIcon = $('<img>')
            divElIcon.attr('class', 'icons');
            divElIcon.attr('src', 'https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png');
            divElBody.append(divElIcon);

            var Temp = $('<p>').text(`Temp: ${weekWeather[i].temp} °F`);
            divElBody.append(Temp);

            var Wind = $('<p>').text(`Wind: ${weekWeather[i].wind.speed} MPH`);
            divElBody.append(Wind);

            var Humidity = $('<p>').text(`Humidity ${weekWeather[i].humidity} %`);
            divElBody.append(pElHumid);
        }
    });
};
