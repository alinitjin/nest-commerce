export interface CreateProductDTO {
    title: string;
    description: string;
    price: number;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;