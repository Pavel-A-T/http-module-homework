const http = require('http');
const readLine = require('readline');
const {units, cityDefault, APIKey} = require('./config');

const reader = readLine.createInterface(
    {
        input: process.stdin,
        output: process.stdout
    }
);

function getWeather(city)  {
    const url = `http://api.weatherstack.com/current?access_key=${APIKey}&query=${city}&units=${units}`;
    http.get(url, (res) => {
        const statusCode = res.statusCode;
        if (statusCode !== 200) {
            console.error(`Status Code: ${statusCode}`);
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => rawData += chunk);
        res.on('end', () => {
            let parsedData = JSON.parse(rawData);
            console.log(parsedData);
            continueApp();
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}


const continueApp = () => {
    reader.question("Хотите продолжить? print please Y or N  ", (data) => {
        if (data.startsWith("N") || data.startsWith("n")) {
            reader.close();
        } else if (data.startsWith("Y") || data.startsWith("y")) {
            start();
        } else {
            console.log("Некорректный ввод");
            continueApp();
        }
    });
}

const start = () => {
    console.log("Прогноз погоды");
    reader.question("Напечатайте название города латиницей и нажмите <ENTER> чтобы узнать прогноз: ", (data) => {
        if (data && data.length > 3) getWeather(data);
        else getWeather(cityDefault);
    })
}

start();
