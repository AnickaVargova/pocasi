'use strict';

const API_KEY = '2852c49275ebaa0774d08a69edc93e0e';

const aktualni = document.querySelector('#aktualni');
const mesto1 = document.querySelector('#mesto1');
const mesto2 = document.querySelector('#mesto2');
const mesto3 = document.querySelector('#mesto3');
const body = document.querySelector('body');
const barevny = document.querySelector('#barevny');
const tlacitko = document.querySelectorAll('.tlacitko');
const malaIkona = document.querySelectorAll('.ikona');
const jmeno = document.querySelector('#mesto');
const teplota = document.querySelector('#stupne')
const popis = document.querySelector('#popis');
const ikona = document.querySelector('#ikona');
const vlhkost = document.querySelector('#vlhkost .hodnota');
const vitr = document.querySelector('#vitr .hodnota');
const vychod = document.querySelector('#vychod .hodnota');
const zapad = document.querySelector('#zapad .hodnota');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const thunder = document.querySelector('#thunder');
const drizzle = document.querySelector('#drizzle');
const rain = document.querySelector('#rain');
const snowing = document.querySelector('#snowing');
const atmosphere = document.querySelector('#atmosphere');
const sunny = document.querySelector('#sunny');
const cloudy = document.querySelector('#cloudy');


aktualni.addEventListener('click', pouzijPolohu);
mesto1.addEventListener('click', function() { nactiMesto("Praha,cz") });
mesto2.addEventListener('click', function() { nactiMesto("Paris,fr") });
mesto3.addEventListener('click', function() { nactiMesto("Český Krumlov,cz") });

nactiMesto("Brno,cz");

function nactiMesto(mesto) {

    const API_BASE = `https://api.openweathermap.org/data/2.5/weather?q=${mesto}&appid=${API_KEY}&units=metric&lang=cz`;
    const API_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?q=${mesto}&appid=${API_KEY}&units=metric&lang=cz`;

    pouzijData(API_BASE, API_FORECAST);

    if (mesto === 'Brno,cz') {
        body.style.backgroundImage = "url('images/brno.jpg')";
    } else if (mesto === 'Praha,cz') {
        body.style.backgroundImage = "url('images/praha.jpg')";
    } else if (mesto === 'Paris,fr') {
        body.style.backgroundImage = "url('images/paris.jpg')";
    } else if (mesto === 'Český Krumlov,cz') {
        body.style.backgroundImage = "url('images/krumlov.jpg')";
    } else {
        body.style.backgroundImage = "url('images/background.jpg')";
    }
}

function pouzijPolohu() {
    navigator.geolocation.getCurrentPosition((position) => {

        const API_BASE = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric&lang=cz`;

        const API_FORECAST = `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}&units=metric&lang=cz`;


        pouzijData(API_BASE, API_FORECAST);

        body.style.backgroundImage = "url('images/background.jpg')";
    });
}

function pouzijData(dnesni, predpoved) {

    fetch(dnesni).then(response => response.json())
        .then(data => {

            //tady se vypisují data do hlavní sekce

            jmeno.textContent = data.name;

            let temp = Math.round(data.main.temp);
            teplota.textContent = temp;

            popis.textContent = data.weather[0].description;

            let novaIkona = getWeatherIcon(data.weather[0].id, data.weather[0].icon);

            ikona.innerHTML = novaIkona;

            vlhkost.textContent = data.main.humidity;

            vitr.textContent = data.wind.speed.toFixed(1);

            let hodinyVychod = `${(new Date(data.sys.sunrise * 1000)).getHours()}`;
            let minutyVychod = formatMinuty(`${(new Date(data.sys.sunrise * 1000)).getMinutes()}`);
            vychod.textContent = `${hodinyVychod}:${minutyVychod}`;

            let hodinyZapad = `${(new Date(data.sys.sunset * 1000)).getHours()}`;
            let minutyZapad = formatMinuty(`${(new Date(data.sys.sunset * 1000)).getMinutes()}`);
            zapad.textContent = `${hodinyZapad}:${minutyZapad}`;

            //barvy podle teploty

            if (temp <= 15 && temp >= 5) {
                obarviPozadi('linear-gradient(to bottom, blue, mediumseagreen)');
                obarviTlacitka('linear-gradient(to top, blue, mediumseagreen)');
                obarviIkony('mediumseagreen');
            }

            if (temp < 5) {
                obarviPozadi('linear-gradient(to bottom, blue, grey)');
                obarviTlacitka('linear-gradient(to top, blue, grey)');
                obarviIkony('blue');
            }

            if (temp > 15) {
                obarviPozadi('linear-gradient(to bottom, #ff3e78, #ffbd2e)');
                obarviTlacitka('linear-gradient(to top, #ff3e78, #777bf0)');
                obarviIkony('#ff3e78');

            }

            //zvuky podle počasí


            if (data.weather[0].id >= 200 && data.weather[0].id <= 232) {
                zahrejZvuk(pocasi[0]);
            }
            if (data.weather[0].id >= 300 && data.weather[0].id <= 321) {
                zahrejZvuk(pocasi[1]);
            }
            if (data.weather[0].id >= 500 && data.weather[0].id <= 531) {
                zahrejZvuk(pocasi[2]);
            }
            if (data.weather[0].id >= 600 && data.weather[0].id <= 622) {
                zahrejZvuk(pocasi[3]);
            }
            if (data.weather[0].id >= 701 && data.weather[0].id <= 781) {
                zahrejZvuk(pocasi[4]);
            }
            if (data.weather[0].id === 800) {
                zahrejZvuk(pocasi[5]);
            }
            if (data.weather[0].id >= 801 && data.weather[0].id <= 804) {
                zahrejZvuk(pocasi[6]);
            }
        })


    fetch(predpoved).then(response => response.json())
        .then(data => {

            let zacatky = data.list.filter(radek => (new Date(radek.dt * 1000)).getHours() === 2);

            predpovedDen(1, data, zacatky);
            predpovedDen(2, data, zacatky);
            predpovedDen(3, data, zacatky);
            predpovedDen(4, data, zacatky);
        });
}

function formatMinuty(minuty) {
    if (minuty < 10) {
        return '0' + minuty;
    } else {
        return minuty;
    }
}

function denVTydnu(den) {
    if (den === 1) {
        return 'Pondělí';
    } else if (den === 2) {
        return 'Úterý';
    } else if (den === 3) {
        return 'Středa';
    } else if (den === 4) {
        return 'Čtvrtek';
    } else if (den === 5) {
        return 'Pátek';
    } else if (den === 6) {
        return 'Sobota';
    } else if (den === 0) {
        return 'Neděle';
    }
}

function obarviTlacitka(barva) {
    for (let prvek of tlacitko) {
        prvek.style.backgroundImage = barva;
    }
}

function obarviIkony(barva) {
    for (let prvek of malaIkona) {
        prvek.style.color = barva;
    }
}

function obarviPozadi(barva) {
    barevny.style.backgroundImage = barva;
}

const pocasi = [{
        el: thunder,
        aktivni: false
    },
    {
        el: drizzle,
        aktivni: false
    },
    {
        el: rain,
        aktivni: false
    },
    {
        el: snowing,
        aktivni: false
    },
    {
        el: atmosphere,
        aktivni: false
    },
    {
        el: sunny,
        aktivni: false
    },
    {
        el: cloudy,
        aktivni: false
    },
]

function zahrejZvuk(zvuk) {

    pause.addEventListener('click', function() { zvuk.el.pause() });

    play.addEventListener('click', function() {
        zvuk.aktivni = true;

        zvuk.el.play();

        for (let prvek of pocasi) {
            if (prvek.aktivni !== true) {
                prvek.el.pause();
            }
        }
        zvuk.aktivni = false;
    })
}


function nejvyssiTeplota(i, data, zacatky) {

    //vrací nejvyšší teplotu v konkrétním dni, jako první parametr dostane index dne v poli zacatky, např. dne 22.5. to budou dny 23.,24.,25.,26.,27.

    let dataZacatku = zacatky.map(radek => (new Date(radek.dt * 1000)).getDate());

    let jedenDen = data.list.filter(radek => (new Date(radek.dt * 1000)).getDate() === dataZacatku[i]);

    let nejvyssiDenniTeplota = `${Math.round(jedenDen.map(radek => radek.main.temp).reduce((max, cur) => Math.max(max, cur)))} °C`;

    return nejvyssiDenniTeplota;

}

function urciIkonu(i, data, zacatky) {

    let devetHodin = data.list.filter(radek => (new Date(radek.dt * 1000)).getHours() === new Date(((zacatky[0].dt + 32400) * 1000)).getHours());
    //pole předpovědí pro devět hodin ráno, ze kterých chci získat ikonu počasí v daném dni. Toto pole musím získat v závislosti na začátcích dne, protože chci devět hodin daného dne, nikoli devět hodin dne předtím. Číslo 32400 je 9 hodin v sekundách.

    let novaIkona = getWeatherIcon(devetHodin[i].weather[0].id, devetHodin[i].weather[0].icon);

    return novaIkona;

}

function urciDatum(i, zacatky) {

    let datum = `${(new Date(zacatky[i].dt * 1000)).getDate()}`;
    let mesic = Number(`${(new Date(zacatky[i].dt * 1000)).getMonth()}`);
    let den = denVTydnu(Number(`${(new Date(zacatky[i].dt * 1000)).getDay()}`));
    let celeDatum = `${den} ${datum}. ${mesic + 1}.`;
    return celeDatum;
}



function predpovedDen(cisloRadku, data, zacatky) {

    //cisloRadku je číslo řádku předpovědi v HTML

    let datumPredpoved = document.querySelector(`#datumPredpoved${cisloRadku}`);
    let teplotaPredpoved = document.querySelector(`#teplotaPredpoved${cisloRadku}`);
    let ikonaPredpoved = document.querySelector(`#ikonaPredpoved${cisloRadku}`);

    //cisloRadku-1 v HTML vždy odpovídá indexu v poli zacatky, tedy i dataZacatku a devetHodin
    teplotaPredpoved.textContent = nejvyssiTeplota(cisloRadku - 1, data, zacatky);
    datumPredpoved.textContent = urciDatum(cisloRadku - 1, zacatky);
    ikonaPredpoved.innerHTML = urciIkonu(cisloRadku - 1, data, zacatky);

}


//Funkci na získávání ikon připojuji sem, protože se pak stránka načítá rychleji, než kdyby byla v samostatném souboru. Trochu jsem změnila podmínku pro rozlišování mezi dnem a nocí, protože se mi z neznámého důvodu nenačítá ikona pro jasné počasí v noci. Pokud je tedy v noci jasno (id=800), zobrazuje se sluníčko.

function getWeatherIcon(code, img) {
    let prefix = 'wi wi-';
    let partOfDay = '';
    let icon = weatherIcons[code].icon;

    if (img.slice(-1) === 'd') {
        partOfDay = 'day-';
    } else if (img.slice(-1) === 'n') {
        partOfDay = 'night-';
    }

    // icons 7xx and 9xx do not get prefixed with day/night
    if (code === 800) {
        icon = 'day-' + icon;
    } else if (!(code > 699 && code < 801) && !(code > 899 && code < 1000)) {
        icon = partOfDay + icon;
    }

    // Put everything together and return it
    return `<i class="${prefix + icon}"></i>`;
}


// mapping of Weather Icons (https://github.com/erikflowers/weather-icons)
// to OpenWeatherMap weather codes
const weatherIcons = {
    "200": {
        "label": "thunderstorm with light rain",
        "icon": "storm-showers"
    },

    "201": {
        "label": "thunderstorm with rain",
        "icon": "storm-showers"
    },

    "202": {
        "label": "thunderstorm with heavy rain",
        "icon": "storm-showers"
    },

    "210": {
        "label": "light thunderstorm",
        "icon": "storm-showers"
    },

    "211": {
        "label": "thunderstorm",
        "icon": "thunderstorm"
    },

    "212": {
        "label": "heavy thunderstorm",
        "icon": "thunderstorm"
    },

    "221": {
        "label": "ragged thunderstorm",
        "icon": "thunderstorm"
    },

    "230": {
        "label": "thunderstorm with light drizzle",
        "icon": "storm-showers"
    },

    "231": {
        "label": "thunderstorm with drizzle",
        "icon": "storm-showers"
    },

    "232": {
        "label": "thunderstorm with heavy drizzle",
        "icon": "storm-showers"
    },

    "300": {
        "label": "light intensity drizzle",
        "icon": "sprinkle"
    },

    "301": {
        "label": "drizzle",
        "icon": "sprinkle"
    },

    "302": {
        "label": "heavy intensity drizzle",
        "icon": "sprinkle"
    },

    "310": {
        "label": "light intensity drizzle rain",
        "icon": "sprinkle"
    },

    "311": {
        "label": "drizzle rain",
        "icon": "sprinkle"
    },

    "312": {
        "label": "heavy intensity drizzle rain",
        "icon": "sprinkle"
    },

    "313": {
        "label": "shower rain and drizzle",
        "icon": "sprinkle"
    },

    "314": {
        "label": "heavy shower rain and drizzle",
        "icon": "sprinkle"
    },

    "321": {
        "label": "shower drizzle",
        "icon": "sprinkle"
    },

    "500": {
        "label": "light rain",
        "icon": "rain"
    },

    "501": {
        "label": "moderate rain",
        "icon": "rain"
    },

    "502": {
        "label": "heavy intensity rain",
        "icon": "rain"
    },

    "503": {
        "label": "very heavy rain",
        "icon": "rain"
    },

    "504": {
        "label": "extreme rain",
        "icon": "rain"
    },

    "511": {
        "label": "freezing rain",
        "icon": "rain-mix"
    },

    "520": {
        "label": "light intensity shower rain",
        "icon": "showers"
    },

    "521": {
        "label": "shower rain",
        "icon": "showers"
    },

    "522": {
        "label": "heavy intensity shower rain",
        "icon": "showers"
    },

    "531": {
        "label": "ragged shower rain",
        "icon": "showers"
    },

    "600": {
        "label": "light snow",
        "icon": "snow"
    },

    "601": {
        "label": "snow",
        "icon": "snow"
    },

    "602": {
        "label": "heavy snow",
        "icon": "snow"
    },

    "611": {
        "label": "sleet",
        "icon": "sleet"
    },

    "612": {
        "label": "shower sleet",
        "icon": "sleet"
    },

    "615": {
        "label": "light rain and snow",
        "icon": "rain-mix"
    },

    "616": {
        "label": "rain and snow",
        "icon": "rain-mix"
    },

    "620": {
        "label": "light shower snow",
        "icon": "rain-mix"
    },

    "621": {
        "label": "shower snow",
        "icon": "rain-mix"
    },

    "622": {
        "label": "heavy shower snow",
        "icon": "rain-mix"
    },

    "701": {
        "label": "mist",
        "icon": "sprinkle"
    },

    "711": {
        "label": "smoke",
        "icon": "smoke"
    },

    "721": {
        "label": "haze",
        "icon": "day-haze"
    },

    "731": {
        "label": "sand, dust whirls",
        "icon": "cloudy-gusts"
    },

    "741": {
        "label": "fog",
        "icon": "fog"
    },

    "751": {
        "label": "sand",
        "icon": "cloudy-gusts"
    },

    "761": {
        "label": "dust",
        "icon": "dust"
    },

    "762": {
        "label": "volcanic ash",
        "icon": "smog"
    },

    "771": {
        "label": "squalls",
        "icon": "day-windy"
    },

    "781": {
        "label": "tornado",
        "icon": "tornado"
    },

    "800": {
        "label": "clear sky",
        "icon": "sunny"
    },

    "801": {
        "label": "few clouds",
        "icon": "cloudy"
    },

    "802": {
        "label": "scattered clouds",
        "icon": "cloudy"
    },

    "803": {
        "label": "broken clouds",
        "icon": "cloudy"
    },

    "804": {
        "label": "overcast clouds",
        "icon": "cloudy"
    },


    "900": {
        "label": "tornado",
        "icon": "tornado"
    },

    "901": {
        "label": "tropical storm",
        "icon": "hurricane"
    },

    "902": {
        "label": "hurricane",
        "icon": "hurricane"
    },

    "903": {
        "label": "cold",
        "icon": "snowflake-cold"
    },

    "904": {
        "label": "hot",
        "icon": "hot"
    },

    "905": {
        "label": "windy",
        "icon": "windy"
    },

    "906": {
        "label": "hail",
        "icon": "hail"
    },

    "951": {
        "label": "calm",
        "icon": "sunny"
    },

    "952": {
        "label": "light breeze",
        "icon": "cloudy-gusts"
    },

    "953": {
        "label": "gentle breeze",
        "icon": "cloudy-gusts"
    },

    "954": {
        "label": "moderate breeze",
        "icon": "cloudy-gusts"
    },

    "955": {
        "label": "fresh breeze",
        "icon": "cloudy-gusts"
    },

    "956": {
        "label": "strong breeze",
        "icon": "cloudy-gusts"
    },

    "957": {
        "label": "high wind, near gale",
        "icon": "cloudy-gusts"
    },

    "958": {
        "label": "gale",
        "icon": "cloudy-gusts"
    },

    "959": {
        "label": "severe gale",
        "icon": "cloudy-gusts"
    },

    "960": {
        "label": "storm",
        "icon": "thunderstorm"
    },

    "961": {
        "label": "violent storm",
        "icon": "thunderstorm"
    },

    "962": {
        "label": "hurricane",
        "icon": "cloudy-gusts"
    }
}