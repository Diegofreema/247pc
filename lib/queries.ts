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

// export const useSpecial = () => {
//   const { id, user } = useStoreId();
//   return useQuery({
//     queryKey: ['cart'],
//     queryFn: async () => {
//       const response = await axios.get(
//         `https://test.ngpoolsbetting.com.ng/api.aspx?api=cartpageload&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}`
//       );

//       return response.data;
//     },
//   });
// };
export const useCart = () => {
  const { id, user } = useStoreId();
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=cartpageload&productincart=${user?.productInCart}&myuserid=${id}&communityId=${user?.communityId}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=cartlist&myuserid=${id}`
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
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
};

export type Id = {
  id: string;
};

export const useSpecial = (state: any) => {
  return useQuery({
    queryKey: ['special', state],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=specialoffers&statename=${state} `
      );

      return data as Id[];
    },
  });
};
export const useNewProducts = (state?: string, categories?: string) => {
  return useQuery({
    queryKey: ['newProducts'],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=newproducts&statename=imo&category=Fragrance%26Gift `
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=productinfo&productid=${id}`
      );
      // console.log('🚀 ~ useProduct ~ response:', JSON.parse(response.data));

      return response.data as Product;
    },
  });
};
export const useCommunities = (state = 'abuja') => {
  return useQuery({
    queryKey: ['communities', state],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=communities&statename=${state}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=states`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=userinfo&myuserid=${id}`
      );

      return data as LoggedUserType;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    retry: 5,
  });
};
export const useFee = (id: any, productInCart: any, communityId: any) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['fee'],
    queryFn: async () => {
      const res = await axios.post(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=cartpageload&productincart=${productInCart}&myuserid=${id}&communityId=${communityId}`
      );
      queryClient.invalidateQueries({ queryKey: ['order'] });
      return res;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
};
export const useSpecialInfo = (state?: string, id?: string) => {
  return useQuery({
    queryKey: ['specialInfo', state, id],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=specialofferinfo&statename=${state}&specialId=${id}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=specialofferproducts&productlist=${productId}`
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
  const { id, user } = useStoreId();
  return useQuery({
    queryKey: ['wishlist', id, user?.statename],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=wishlist&statename=${user?.statename}&myuserid=${id}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=newarrivals&statename=${user?.statename}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=maincategories`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=newproducts&statename=${user?.statename}&category=${replacedPhrase}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=menusubcategories&category=${replacedPhrase} `
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=productbycategory&statename=${user?.statename}&category=${replacedPhrase}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=dealercategories&dealerid=${id} `
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=dealercategoryproducts&dealerid=${id}&category=${replacedPhrase} `
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=ordersummary&myuserid=${id} `
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
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=allproduct&statename=${user?.statename}`
      );
      console.log('🚀 ~ useSearch ~ response:', response);

      let data = [];
      if (response.data.length > 0) {
        data = response.data;
      }

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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=recentlyviewed&statename=imo&myuserid=${id}`
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
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=walletinfo&myuserid=${id}`
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
export const useGetFullOrder = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['fullOrder', id],
    queryFn: async () => {
      const response = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=myorders&myuserid=${id}`
      );

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
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
};
export const useWalletBalance = () => {
  const { id } = useStoreId();
  return useQuery({
    queryKey: ['walletBalance', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=walletbalance&myuserid=${id}`
      );

      return data;
    },
  });
};

export const useGetUpdateUser = (id: string) => {
  return useQuery({
    queryKey: ['updatedUser', id],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=userinfo&myuserid=${id}`
      );

      return data;
    },
  });
};
export const useGetState = () => {
  return useQuery({
    queryKey: ['state'],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=states`
      );
      let newArray: State[] = data?.map((item: { statename: string }) => {
        return {
          key: item?.statename,
          value: item?.statename,
        };
      });
      return newArray;
    },
  });
};

type ComType = {
  key: string;
  value: string;
};
export const useGetCom = (state: string) => {
  return useQuery({
    queryKey: ['communities', state],
    queryFn: async () => {
      const { data } = await axios.get(
        `https://test.ngpoolsbetting.com.ng/api.aspx?api=communities&statename=${state}`
      );
      let newArray: ComType[] = data?.map(
        (item: { communityname: string; id: string }) => {
          return {
            key: item.id,
            value: item.communityname,
          };
        }
      );
      return newArray;
    },
  });
};
export const useGetProfile = (id: string) => {
  const getProfile = async () => {
    const { data } = await axios.get(
      `https://test.ngpoolsbetting.com.ng/api.aspx?api=userinfo&myuserid=${id}`
    );

    return data;
  };
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      const data = await getProfile();

      return data;
    },
  });
};
