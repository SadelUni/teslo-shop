import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { Auth } from "src/auth/entities/user.entity";


@Entity({
    name: 'products'
})
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    title: string;

    @Column('float', {
        default: 0
    })
    price: number;


    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('text', {
        unique: true
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;


    @Column('text', {
        array: true
    })
    sizes: string[];


    //tags

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(() => ProductImage, (image) => image.product, {
        cascade: true, eager: true
    }
    )
    images?: ProductImage[]


    @ManyToOne(() => Auth, (user) => user.product, {
        eager: true
    })
    user: Auth;

    @Column('text')
    gender: string;

    @BeforeInsert()
    updateSlug() {
        if (!this.slug) {
            this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        }
    }

    @BeforeUpdate()
    updateSlugOnUpdate() {
        if (this.slug) {
            this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '');
        }
    }
}
