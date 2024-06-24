import { Product } from 'src/products/entities';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'users'
})
export class Auth {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column("text", {
        select: false
        
    })
    password: string;

    @Column("text")
    fullName: string;

    @Column(
        'bool', {
        default: true
    }
    )
    isActive: boolean;

    @Column({
        type: 'text',
        array: true,
        default: ["user"],

    })
    role: string[];

    @OneToMany(() => Product,(product) => product.user)
        
        product: Product[];

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }
}
