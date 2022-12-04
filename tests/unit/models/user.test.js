const config = require('config');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        // jwt.sign = jest.fn().mockReturnValue({ _id: '1', isAdmin: true });
        // config.get = jest.fn();
        const payload = {
            _id: new mongoose.Types.ObjectId, 
            isAdmin: true }
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
        // expect(jwt.sing.mock.calls[0][1]).toBe();
        // expect(jwt.sing.mock.calls[0][2]).toBe();
    });
});