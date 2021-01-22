import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SellerGuard } from 'src/guards/seller.guard';
import { Payload } from 'src/type/payload';
import { User } from 'src/utilities/user.decorator';
import { UserService } from '../shared/user/user.service';
import { loginDTO, registerDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private UserService: UserService,
        private authService: AuthService
    ) { }

    @Get()
    @UseGuards(AuthGuard('jwt'), SellerGuard)
    async findAll(@User() user: any) {
        console.log(user);
        return await this.UserService.findAll();
    }


    // @Get()
    // @UseGuards(AuthGuard('jwt'))
    // tempAuth() {
    //     return { auth: 'works' };
    // }

    @Post('login')
    async login(@Body() userDTO: loginDTO) {

        const user = await this.UserService.findByLogin(userDTO);
        // TODO MOVE THIS LOGIC TO SERVICE
        const payload: Payload = {
            username: user.username,
            seller: user.seller,

        };
        const token = await this.authService.signPayload(payload);
        return { user, token };
    }

    @Post('register')
    async register(@Body() userDTO: registerDTO) {
        const user = await this.UserService.create(userDTO);
        // TODO MOVE THIS LOGIC TO SERVICE
        const payload: Payload = {
            username: user.username,
            seller: user.seller,
        };
        const token = await this.authService.signPayload(payload);
        return { user, token };
    }
}
