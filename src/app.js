const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve 
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather app",
        name: "Daniel Bell"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About",
        name: "Daniel Bell"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        name: "Daniel Bell"
    })
})

app.get('/weather', (req, res) => {
    const queryAddress = req.query.address

    if (!queryAddress) {
        return res.send({
            error: "You must provide an address."
        })
    }

    geocode(queryAddress, (error, {longitude, latitude, place_name} = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }

            res.send({
                forecast: forecastData,
                address: queryAddress,
                location: place_name
            })
            })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        errorMessage: "Help article not found"
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        errorMessage: "Page not found"
    })
})

app.listen(port, () => {
    console.log("Server is running on port" + port)
})