import * as mongoose from 'mongoose';
import axios from 'axios';
import * as request from 'supertest';
import { registerDTO } from 'src/auth/auth.dto';
import { app } from './constants';
import { CreateProductDTO } from 'src/product/product.dto';
import { HttpStatus } from '@nestjs/common';

let SellerToken: string;
let productId: string;
let productSeller: registerDTO = {
    seller: true,
    username: 'productSeller',
    password: 'password'
}
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connection.db.dropDatabase();


    const { data: { token } } = await axios.post(`http://localhost:3000/auth/register`, productSeller);
    SellerToken = token;
   
});

afterAll(async done => {
    await mongoose.disconnect(done);
});
describe('PRODUCT', () => {

    const product: CreateProductDTO = {
        title: 'new Phone',
        description: 'description',
        price: 10
    }
    it('should list all products', () => {
        return request(app)
            .get('/product')
            .expect(200)
    });


    // it('should list my products', () => {
    //     return request(app)
    //         .get('/product/mine')
    //         .set('Authorization', `Bearer ${SellerToken}`)
    //         .expect(200);
    // });

    it('should create product', () => {
        return request(app)
            .post('/product')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${SellerToken}`)
            .send(product)
            .expect(({ body }) => {
                productId = body._id;
                // console.log('body', body._id);
                expect(body._id).toBeDefined();
                expect(body.title).toEqual(product.title);
                expect(body.description).toEqual(product.description);
                expect(body.price).toEqual(product.price);

                //expect(body.owner.username).toEqual(productSeller.username);
            })
            .expect(HttpStatus.CREATED);
    });

    it('should read product', () => {2
        return request(app)
            .get(`/product/${productId}`)
            .expect(({ body }) => {
                expect(body._id).toBeDefined();
                expect(body.title).toEqual(product.title);
                expect(body.description).toEqual(product.description);
                expect(body.price).toEqual(product.price);
                expect(body.owner.username).toEqual(productSeller.username);
            })
            .expect(200);
    });

    it('should update product', () => {
        return request(app)
            .put(`/product/${productId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${SellerToken}`)
            .send({title: 'new title'})
            .expect(({ body }) => {
                expect(body._id).toEqual(productId);
                expect(body.title).not.toEqual(product.title);
                expect(body.description).toEqual(product.description);
                expect(body.price).toEqual(product.price);
                expect(body.owner.username).toEqual(productSeller.username);
            })
            .expect(200);
    });

    it('should delete product', async () => {
        await axios.delete(`http://localhost:3000/product/${productId}`, {
            headers: { Authorization: `Bearer ${SellerToken}`}
        });

        return request(app)
        .get(`/product/${productId}`)
        .expect(200)
    });
});
