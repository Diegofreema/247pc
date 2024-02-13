import { useQuery, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';
import {
  Cat,
  Community,
  LoggedUserType,
  Order,
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
import { getProfile } from './helpers';

const api = process.env.EXPO_PUBLIC_API_URL;
export const useCart = () => {
  const { id, user } = useStoreId();
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get(
        `${api}?api=cartpageload&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}`
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
      const response = await axios.get(`${api}?api=cartlist&myuserid=${id}`);

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
    refetchInterval: 1000,
  });
};

export type Id = {
  id: string;
};

export const useSpecial = (state: string) => {
  return useQuery({
    queryKey: ['special', state],
    queryFn: async () => {
      const response = await axios.get(
        `${api}?api=specialoffers&statename=${state} `
      );

      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }
      return data as Id[];
    },
  });
};
export const useNewProducts = (state?: string, categories?: string) => {
  return useQuery({
    queryKey: ['newProducts'],
    queryFn: async () => {
      const response = await axios.get(
        `${api}?api=newproducts&statename=imo&category=Fragrance%26Gift `
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
        `${api}?api=productinfo&productid=${id}`
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
        `${api}?api=communities&statename=${state}`
      );
      return response.data as Community[];
    },
  });
};
export const useStates = () => {
  return useQuery({
    queryKey: ['state'],
    queryFn: async () => {
      const response = await axios.get(`${api}?api=states`);
      return response.data as State[];
    },
  });
};
export const useUser = (id: any) => {
  const { setUser } = useStoreId();
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await axios.get(`${api}?api=userinfo&myuserid=${id}`);

      return data as LoggedUserType;
    },
    refetchInterval: 20000,
  });
};
export const useFee = (id: any, productInCart: any, communityId: any) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['fee'],
    queryFn: async () => {
      const res = await axios.post(
        `${api}?api=cartpageload&productincart=${productInCart}&myuserid=${id}&communityId=${communityId}`
      );
      queryClient.invalidateQueries({ queryKey: ['order'] });
      return res;
    },
    refetchInterval: 1000,
  });
};
export const useSpecialInfo = (state?: string, id?: string) => {
  return useQuery({
    queryKey: ['specialInfo', state, id],
    queryFn: async () => {
      const response = await axios.get(
        `${api}?api=specialofferinfo&statename=${state}&specialId=${id}`
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
        `${api}?api=specialofferproducts&productlist=${productId}`
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
        `${api}?api=wishlist&statename=imo&myuserid=${id}`
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

  return useQuery({
    queryKey: ['newArrival', user?.statename],
    queryFn: async () => {
      const response = await axios.get(
        `${api}?api=newarrivals&statename=${user?.statename}`
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
      const { data } = await axios.get(`${api}?api=maincategories`);

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
        `${api}?api=newproducts&statename=${user?.statename}&category=${replacedPhrase}`
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
        `${api}?api=menusubcategories&category=${replacedPhrase} `
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
        `${api}?api=productbycategory&statename=${user?.statename}&category=${replacedPhrase}`
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
        `${api}?api=dealercategories&dealerid=${id} `
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
        `${api}?api=dealercategoryproducts&dealerid=${id}&category=${replacedPhrase} `
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
        `${api}?api=ordersummary&myuserid=${id} `
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
        `${api}?api=allproduct&statename=${user?.statename}`
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
        `${api}?api=recentlyviewed&statename=imo&myuserid=${id}`
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
      const response = await axios.get(`${api}?api=walletinfo&myuserid=${id}`);
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
export const useGetFullOrder = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['fullOrder', id],
    queryFn: async () => {
      const response = await axios.get(`${api}?api=myorders&myuserid=${id}`);

      let data = [];
      if (Object.prototype.toString.call(response.data) === '[object Object]') {
        data.push(response.data);
      } else if (
        Object.prototype.toString.call(response.data) === '[object Array]'
      ) {
        data = [...response.data];
      }

      return data as Order[];
    },
    refetchInterval: 10000,
  });
};
export const useWalletBalance = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['walletBalance', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${api}?api=walletbalance&myuserid=${id}`
      );

      return data;
    },
  });
};
