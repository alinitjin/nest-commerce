import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { loginDTO, registerDTO } from 'src/auth/auth.dto';
import { User } from 'src/type/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>){}

    private sanitizeUser(user: User) {
        return user.depopulate('password')
    }

    async findAll() {
        return this.userModel.find();
    }

    async create(userDTO: registerDTO) {  
        
        const {username} = userDTO;
        const user =  await this.userModel.findOne({username});
        if (user) {
            throw new HttpException('user Already Exists', HttpStatus.BAD_REQUEST);
        }

        const createdUser = new this.userModel(userDTO);
        await createdUser.save();
        return this.sanitizeUser(createdUser);

    }

    async findByLogin(userDTO: loginDTO) {
        const {username, password} = userDTO;
        const user =  await this.userModel.findOne({username});
        if (!user) {
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        }

        if ( await bcrypt.compare(password, user.password)) {
            return this.sanitizeUser(user);
        } else {
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        }
    }

    async findByPayload(payload: any) {
        const {username} = payload;
        return await this.userModel.findOne({username});
    }
    
} 
