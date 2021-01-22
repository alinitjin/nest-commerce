import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/type/product';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { User } from '../type/user';


@Injectable()
export class ProductService {
    constructor(@InjectModel('Product') private productModel: Model<Product>) { }

     async findAll(): Promise<any> {
        return  this.productModel.find().populate('owner');
    }

    async findOne(id: string): Promise<Product> {
        return await this.productModel.findById(id).populate('owner');
    }

    async findById(id: string): Promise<Product> {
        const product = await this.productModel.findById(id).populate('owner');
        if (!product) {
            throw new HttpException('Product do not exists', HttpStatus.NO_CONTENT);
        }
        return product;
    }

    // async findByOwner(userId: string): Promise<Product[]> {
    //    // return await this.productModel.find(function (err, results) { if (err) { return res.send(500, { error: err }); }});
    //     //return await this.productModel.find({ owner:  }).exec().populate('owner');
    //     const data = await this.productModel.find({owner: userId}, function (err, users) {
    //         const opts = [{ path: 'users', match: { x: 1 }, select: '_id' }];
    //
    //         const promise = this.productModel.populate(users, opts);
    //         promise.then(console.log).end();
    //     });
    //     return  data;
    //     // return await this.productModel.find().populate('owner').exec(function (err, docs) {
    //     //     //console.log(docs[0].branch.name);
    //     //     console.log(docs);
    //     // });
    // }

    async create(productDTO: CreateProductDTO, user: User): Promise<Product> {
        const product = await this.productModel.create({
            ...productDTO,
            owner: user
        });
        await product.save();
        return product.populate('owner');
    }

    async update(id: string, productDTO: UpdateProductDTO, userId: string): Promise<Product> {
        const product = await this.productModel.findById(id);
        if (userId !== product.owner.toString()) {
            throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
        }
        //console.log('product', product);
        await product.update(productDTO);
        return await this.productModel.findById(id).populate('owner');
    }

    async delete(id: string, userId: string): Promise<Product> {
        const product = await this.productModel.findById(id);

        if (userId !== product.owner.toString()) {
            throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
        }
        await product.remove();
        return await this.productModel.findById(id);
    }

}
