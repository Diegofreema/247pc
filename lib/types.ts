import { useGetFullOrder } from './queries';
export type User = {
  name: string;
  email: string;
  address: string;
  state: string;
  password: string;
  location: string;
  phoneNumber: string;
  communityId: string;
};

export type State = {
  statename: string;
};
export type Community = {
  communityname: string;
  id: string;
};

export type LoggedUserType = {
  addres: string;
  communityId: string;
  customername: string;
  email: string;
  phone: string;
  productInCart: string;
  statename: string;
};

export type Product = {
  available: string;
  category: string;
  description: string;
  product: string;
  seller: string;
  sellerid: string;
  sellingprice: string;
};

export type WishlistType = {
  category: string;
  id: string;
  product: string;
  sellingprice: string;
  description?: string;
};

export type Cat = {
  list: string;
  productgroup: string;
};

export type SubProps = {
  category: string;
};

export type SellerType = {
  category: string;
  groupImageId: string;
};
export type SearchType = {
  Dealer?: string;
  alsoLike?: boolean;
};

export type Searched = SearchType & WishlistType;

export type CartType = {
  product: string;
  productid: string;
  qty: string;
  saleid: string;
  seller: string;
  unitprice: string;
};

export type OrderType = {
  delivery: string;
  items: string;
  subtotal: string;
  total: string;
};

export type Special = {
  GroupTitle: string;
  productlist: string;
};
export type Order = {
  id: string;
  price: string;
  product: string;
  productid: string;
  qty: string;
  rateSet: null | string;
  seller: string;
  statuz: string;
};
