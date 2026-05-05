export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  active: boolean;
}
export interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    username: string;
}
export interface CartItem{
    product: Product;
    quantity: number;
}
export interface Order{
    id: number;
    status: string;
    total: string;
    address: string;
    created_at:string;
}
export interface Customer {
  id: number;
  username: string;
  email: string;
  role: "admin" | "employee" | "customer";
}
