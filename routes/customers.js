const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//Get all customers
router.get('/', async (req, res) => {
    const result = await Customer.find({}).sort('name');

    res.send(result);
});

//Post a customer
router.post('/', async (req, res) => {
    //Validate the name and phone
    const { error } = validate( { 
        name: req.body.name, 
        phone: req.body.phone
    });
    if(error) return res.status(400).send(error.details[0].message);

    //Create an object with customer's attributes
    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    //Save the object to the database
    await customer.save();
    res.send(customer);
});

//Put a customer
router.put('/:id', async (req, res) => {
    //Validate the name and phone
    const { error } = validate( { 
        isGold: req.body.isGold,
        name: req.body.name, 
        phone: req.body.phone
    });
    if(error) return res.status(400).send(error.details[0].message);

    //Check if the document with the given id exist
    const customer = await Customer.findByIdAndUpdate( req.params.id, {
        $set: {
            isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone
        }
    }, {new: true});
    if(!customer) return res.status(404).send('The customer with the given id was not found...');

    res.send(customer);
});

//Delete a customer
router.delete('/:id', async (req, res) => {
    //Check if exist a customer with the given id
    //Delete customer
    const result = await Customer.findByIdAndDelete( req.params.id );
    if(!result) return res.status(404).send('The customer with the given id was not found...');

    //Response
    res.send(result);
});

//Get one customer
router.get('/:id', async (req, res) => {
    //Check if exist a customer with the given id
    const result = await Customer.findById( req.params.id );
    if(!result) return res.status(404).send('The customer with the given id was not found...');

    res.send(result);
});

module.exports = router;
