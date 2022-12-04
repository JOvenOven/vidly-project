const auth = require('../middleware/auth');
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Get all movies
router.get('/', async (req, res) => {
    const result = await Movie.find().sort('title');

    res.send(result);
});

//Post a movie
router.post('/', auth, async (req, res) => {
    //Validate movie
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Validate if genre with the given id exists
    const genre = await Genre.findById(req.body.genreID);
    if(!genre) return res.status(400).send('Invalid genre.');

    const movie = new Movie({
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });

    await movie.save();
    res.send(movie);
});

//Put a movie
router.put('/:id', async (req, res) => {
    //Validate movie
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Validate if genre with the given id exists
    const genre = await Genre.findById(req.body.genreID);
    if(!genre) return res.status(400).send('Invalid genre.');

    //Update movie
    const result = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    }, { new: true });
    if(!result) return res.status(404).send('The movie with the given id was not found...');

    res.send(result);
});

//Delete a movie
router.delete('/:id', async (req, res) => {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if(!result) return res.status(404).send('The movie with the given id was not found...');

    res.send(result);
});

//Get one movie
router.get('/:id', async (req, res) => {
    const result = await Movie.findById(req.params.id);
    if(!result) return res.status(404).send('The movie with the given id was not found...');

    return result;
})

module.exports = router;