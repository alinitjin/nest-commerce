import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { loginDTO, registerDTO } from 'src/auth/auth.dto';
import * as mongoose from 'mongoose';
import 'dotenv/config';
import { app } from './constants';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();

  console.log('mongoose',mongoose.connection.readyState);

});

afterAll(async done => {
    await mongoose.disconnect(done);
});

describe('AUTH', () => {
    const user: registerDTO | loginDTO = {
        username: 'username',
        password: 'password'
    };

    const sellerRegister: registerDTO = {
        username: 'seller',
        password: 'password',
        seller: true
    };

    const sellerLogin: loginDTO ={
        username: 'seller',
        password: 'password'
    };

    let UserToken: string;
    let SellerToken: string;

    it('should register User', () => {
        return request(app).post('/auth/register')
            .set('Accept', 'application/json')
            .send(user)
            .expect(({ body }) => {
                expect(body.token).toBeDefined();   
                expect(body.user.username).toEqual('username');
                expect(body.user.seller).toBeFalsy();
            })
            .expect(HttpStatus.CREATED);
    });

    it('should register Seller', () => {
        return request(app).post('/auth/register')
            .set('Accept', 'application/json')
            .send(sellerRegister)
            .expect(({ body }) => {
                expect(body.token).toBeDefined();
                expect(body.user.username).toEqual('seller');
                expect(body.user.seller).toBeTruthy();
            })
            .expect(HttpStatus.CREATED);
    });

    it('should reject duplicate registration User', () => {
        return request(app)
            .post('/auth/register')
            .set('Accept', 'application/json')
            .send(user)
            .expect(({ body }) => {
                // console.log(body)
                expect(body.code).toEqual(HttpStatus.BAD_REQUEST);
                expect(body.message).toEqual('user Already Exists');

            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('should login User', () => {
        return request(app)
            .post('/auth/login')
            .send(user)
            .expect(({ body }) => {
                // console.log(body)
                UserToken = body.token;
                expect(body.token).toBeDefined();
                expect(body.user.username).toEqual('username');
                expect(body.user.seller).toBeFalsy();
            })
            .expect(HttpStatus.CREATED);
    });

    it('should login Seller', () => {
        return request(app)
            .post('/auth/login')
            .send(sellerLogin)
            .expect(({ body }) => {
                // console.log(body)
                SellerToken = body.token;
                expect(body.token).toBeDefined();
                expect(body.user.username).toEqual('seller');
                expect(body.user.seller).toBeTruthy();
            })
            .expect(HttpStatus.CREATED);
    });

});