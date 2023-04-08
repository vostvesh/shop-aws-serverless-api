import { Product } from "./Product";

export interface Stock {
  product_id: Product['id'];
  count: number;
}
