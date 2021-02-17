const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=0fd1ddcd384c4353b6407639ec267ec3&query=' 
                + latitude + ',' + longitude + '&units=m'

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Unable to connect to weather service", undefined)
        } else if (body.error) {
            callback("Unable to find forecast data", undefined)
        } else {
            callback(undefined, 
                body.current.weather_descriptions[0] + '. Temperature is ' + body.current.temperature + ' degrees but feels like ' + body.current.feelslike + ' degrees. The cloud coverage is ' + body.current.cloudcover + '%.'
            )
        }
    })
}

module.exports = forecast