import { CreateProductDto } from "src/products/dto/create-product.dto";
export const createAutoSlug = (CreateProductDto: CreateProductDto) => {

    const { slug, title } = CreateProductDto;
    
    if (!slug) {
    return title.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
    } else {
    return slug.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
    }
        
    
};

