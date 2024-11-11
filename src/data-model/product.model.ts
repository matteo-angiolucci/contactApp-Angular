
export interface Product{
    image : Image,
    name: string
    category: string,
    price: number,
    id : number
}

export interface Image {
  thumbnail: string,
  mobile: string,
  tablet: string,
  desktop: string
}
