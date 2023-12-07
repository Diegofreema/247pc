import { categories } from './../constants/index';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';
import { ProductProps } from '../components/ProductCard';
import {
  CartType,
  Cat,
  Community,
  LoggedUserType,
  OrderType,
  Product,
  Searched,
  SellerType,
  Special,
  State,
  SubProps,
  WishlistType,
} from './types';
import { useStoreId } from './zustand/auth';

// const api = process.env.EXPO_PUBLIC_PHP_API_KEY;
export const useCart = () => {
  const { id, user } = useStoreId();
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=cartpageload&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}`
      );

      return response.data;
    },
  });
};
export const useGetCart = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['cartList'],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=cartlist&myuserid=${id}`
      );

      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data;
    },
  });
};

export type Id = {
  id: string;
};

export const useSpecial = (state: string) => {
  return useQuery({
    queryKey: ['id', state],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=specialoffers&statename=${state} `
      );

      return response.data as Id[];
    },
  });
};
export const useNewProducts = (state?: string, categories?: string) => {
  return useQuery({
    queryKey: ['newProducts'],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=newproducts&statename=imo&category=Fragrance%26Gift `
      );

      return response.data;
    },
  });
};
export const useProduct = (id: any) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=productinfo&productid=${id}`
      );
      return response.data as Product;
    },
  });
};
export const useCommunities = (state = 'abuja') => {
  return useQuery({
    queryKey: ['communities', state],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=communities&statename=${state}`
      );
      return response.data as Community[];
    },
  });
};
export const useStates = () => {
  return useQuery({
    queryKey: ['state'],
    queryFn: async () => {
      const response = await axios.get(
        'https://247api.netpro.software/api.aspx?api=states'
      );
      return response.data as State[];
    },
  });
};
export const useUser = (id: any) => {
  const { setUser } = useStoreId();
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=userinfo&myuserid=${id}`
      );

      return data as LoggedUserType;
    },
  });
};
export const useSpecialInfo = (state?: string, id?: string) => {
  return useQuery({
    queryKey: ['specialInfo', state, id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=specialofferinfo&statename=${state}&specialId=${id}`
      );

      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as Special[];
    },
  });
};
export const useSpecialOfferProducts = (productId?: string) => {
  return useQuery({
    queryKey: ['specialOfferProducts', productId],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=specialofferproducts&productlist=${productId}`
      );

      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data;
    },
  });
};
export const useWishlist = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['wishlist', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=wishlist&statename=imo&myuserid=${id}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as WishlistType[];
    },
  });
};
export const useNewArrival = () => {
  const { user } = useStoreId();
  console.log('useNewArrival', user?.statename);
  return useQuery({
    queryKey: ['newArrival', user?.statename],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=newarrivals&statename=${user?.statename}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as WishlistType[];
    },
  });
};
export const useCat = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=maincategories`
      );

      return data as Cat[];
    },
  });
};
export const useNewCat = (cat: string) => {
  const { user } = useStoreId();
  const replacedPhrase = cat?.replace(/&/g, '%26')?.replace(/\s/g, '%20');

  return useQuery({
    queryKey: ['newCat'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=newproducts&statename=${user?.statename}&category=${replacedPhrase}`
      );

      return data as WishlistType[];
    },
  });
};
export const useSubCat = (cat: string) => {
  const replacedPhrase = cat?.replace(/&/g, '%26')?.replace(/\s/g, '%20');

  return useQuery({
    queryKey: ['subCat', cat],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=menusubcategories&category=${replacedPhrase} `
      );

      return data as SubProps[];
    },
  });
};
export const useProductCat = (cat: string) => {
  const { user } = useStoreId();
  const replacedPhrase = cat?.replace(/&/g, '%26')?.replace(/\s/g, '%20');
  console.log('replacedPhrase', replacedPhrase);
  return useQuery({
    queryKey: ['productCat', cat],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=productbycategory&statename=${user?.statename}&category=${replacedPhrase}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as WishlistType[];
    },
  });
};
export const useSeller = (id: string) => {
  return useQuery({
    queryKey: ['seller', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=dealercategories&dealerid=${id} `
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as SellerType[];
    },
  });
};
export const useSellerCat = (cat: string, id: string) => {
  const replacedPhrase = cat?.replace(/&/g, '%26')?.replace(/\s/g, '%20');
  return useQuery({
    queryKey: ['sellerCat', cat, id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=dealercategoryproducts&dealerid=${id}&category=${replacedPhrase} `
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as WishlistType[];
    },
  });
};
export const useGetOrder = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=ordersummary&myuserid=${id} `
      );

      return data as OrderType;
    },
  });
};
export const useSearch = () => {
  const { id, user } = useStoreId();
  return useQuery({
    queryKey: ['search', user?.statename],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=allproduct&statename=${user?.statename}`
      );

      return data as Searched[];
    },
  });
};
export const useGetRecentlyViewed = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['recentlyViewed', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=recentlyviewed&statename=imo&myuserid=${id}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as WishlistType[];
    },
  });
};
export const useWallet = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['wallet', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://247api.netpro.software/api.aspx?api=walletinfo&myuserid=${id}`
      );
      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data;
    },
  });
};
export const useWalletBalance = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['walletBalance', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=walletbalance&myuserid=${id}`
      );

      return data;
    },
  });
};
