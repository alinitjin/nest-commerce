import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDTO, UpdateProductDTO } from './product.dto';
import { ProductService } from './product.service';
import { User } from 'src/utilities/user.decorator';
import { User as UserDocument } from '../type/user';
import { SellerGuard } from 'src/guards/seller.guard';
import { Product } from 'src/type/product';

@Controller('product')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    async listAll(): Promise<Product[]>  {
        return await this.productService.findAll()
    }

    // @Get('/mine')
    // @UseGuards(AuthGuard('jwt'), SellerGuard)
    // async listMine(@User() user: UserDocument): Promise<Product[]> {
    //     const {id} = user;
    //     return await this.productService.findByOwner(id);
    // }

    // @Get('/seller/:id')
    // async listBySeller(@Param('id') id: string): any {
    //     return await this.productService.findByOwner(id);
    // }

    @Post()
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async create(@Body() product: CreateProductDTO, @User() user: UserDocument): Promise<Product> {
        return await this.productService.create(product, user);
    }

    @Get(':id')
    async read(@Param('id') id: string): Promise<Product> {
        return await this.productService.findOne(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async update(
        @Param('id') id: string,
        @Body() product: UpdateProductDTO,
        @User()  user: UserDocument,
    ): Promise<Product> {
        const {id: userId} = user;

        const update = await this.productService.update(id, product, userId);
        console.log('update', update);
        return update;
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async delete(
        @Param('id') id: string,
        @User()  user: UserDocument,
    ): Promise<Product> {
        const {id: userId} = user;
        return await this.productService.delete(id, userId);
    }
}
