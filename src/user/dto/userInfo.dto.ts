import { ApiProperty } from '@nestjs/swagger';
import {User, UserOS, UserRole} from '@prisma/client'

export class UserInfoDto {
    @ApiProperty({ type: String })
    id!: string;

    @ApiProperty({ type: Date })
    createdAt!: Date

    @ApiProperty({ type: String })
    email!: string

    @ApiProperty({ type: String })
    name!: string;

    @ApiProperty({ type: UserRole })
    role!: UserRole;

    @ApiProperty( { type: String })
    photo: string;

    @ApiProperty( { type: UserOS })
    os!: UserOS

    @ApiProperty( { type: Number })
    streak!: number;

    @ApiProperty( { type: Boolean })
    marketingAgreement!: boolean;

    static of(data: User): UserInfoDto {
        return {
            id: data.id,
            createdAt: data.createdAt,
            email: data.email,
            name: data.name,
            role: data.role,
            photo: data.photo,
            os: data.os,
            streak: data.streak,
            marketingAgreement: data.marketingAgreement
        };
    }
}