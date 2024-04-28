import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from './types';
import { useToast } from 'react-native-toast-notifications';
import { useStoreId } from './zustand/auth';
import { useModalState } from './zustand/modalState';
import { colors } from '../constants/Colors';
import { router, useRouter } from 'expo-router';
import { getProfile } from './helpers';

// export const useNewUser = () => {
//   return useMutation({
//     mutationKey: ['user'],
//     mutationFn: async (values: User) => {
//       console.log(values);

//       return response.data;
//     },
//   });
// };
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const { id } = useStoreId();
  return useMutation({
    mutationKey: ['wishlist'],
    mutationFn: async (productId?: string) => {
      console.log(productId, id);
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=addtowishlist&productid=${productId}&myuserid=${id}`
      );

      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      show('Added to wishlist', {
        type: 'success',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },

    onError: async () => {
      show('Something went wrong adding to wishlist', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const { id, user } = useStoreId();
  return useMutation({
    mutationKey: ['addToCart'],
    mutationFn: async ({
      productId,
      qty,
    }: {
      productId: string;
      qty: number;
    }) => {
      try {
        const response = await axios.post(
          ` https://test.omega12x.net/api.aspx?api=addtocart&productid=${productId}&myuserid=${id}&qty=${qty}&statename=${user?.statename}`
        );

        console.log('sfdsfdg', response.data);
        return response.data;
      } catch (error) {
        console.log('🚀 ~ useAddToCart ~ error:', error);
      }
    },
    onSuccess: async (data) => {
      console.log('🚀 ~ useAddToCart ~ data:', data);
      queryClient.invalidateQueries({ queryKey: ['cartList'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      show('Added to cart', {
        type: 'success',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.log(data);
    },

    onError: async () => {
      show('Something went wrong adding to cart', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { show } = useToast();

  return useMutation({
    mutationKey: ['removeFromCart'],
    mutationFn: async ({ salesId }: { salesId: string }) => {
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=removefromcart&saleid=${salesId}`
      );

      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['cartList'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
      show('Removed from cart', {
        type: 'success',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
      console.log(data);
    },

    onError: async () => {
      show('Something went wrong removing from cart', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};

type PaystackType = {
  totalcost: string;
  salesref: string;
};
export const usePayStack = () => {
  const queryClient = useQueryClient();
  const { show } = useToast();
  const { user, id } = useStoreId();
  return useMutation({
    mutationKey: ['payStack'],
    mutationFn: async ({
      productInCart,
      couponCode,
    }: {
      productInCart: string;
      couponCode: string;
    }) => {
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=cartpaycard&productincart=${productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${couponCode}`
      );

      return response.data as PaystackType;
    },
    onSuccess: async (data) => {
      console.log('🚀 ~ onSuccess: ~ data:', data);
    },

    onError: async () => {
      show('Something went wrong removing from cart', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useWallet = () => {
  const { show } = useToast();
  const { user, id } = useStoreId();
  const { onOpen } = useModalState();

  return useMutation({
    mutationKey: ['wallet'],
    mutationFn: async ({
      productInCart,
      couponCode,
    }: {
      productInCart: string;
      couponCode: string;
    }) => {
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=cartpaywallet&productincart=${productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${couponCode}&fullname=${user?.customername}&addres=${user?.addres}&emailaddress=${user?.email}`
      );

      return response.data;
    },
    onSuccess: async (data) => {
      if (data === 'saved') {
        router.push('/order');
        return show('Purchased successful', {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          animationType: 'slide-in',
        });
      }

      if (data === 'insufficient fund') {
        return onOpen();
      }

      console.log('Mutation', data);
    },

    onError: async () => {
      show('Something went wrong removing from cart', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useJoinUs = () => {
  const { show } = useToast();

  return useMutation({
    mutationKey: ['join'],
    mutationFn: async ({
      email,
      pharmacyName,
      stateName,
      phoneNumber,
      address,
    }: {
      pharmacyName: string;
      stateName: string;
      email: string;
      phoneNumber: string;
      address: string;
    }) => {
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=pharmacyregistration&pharmacyname=$${pharmacyName}&statename=${stateName}&addres=${address}&emailaddress=${email}&phone=${phoneNumber}`
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data === 'saved') {
        return show(
          'Completed!,You will be contacted by our team shortly to complete your registration process.',
          {
            type: 'success',
            placement: 'top',
            duration: 4000,
            animationType: 'slide-in',
            style: {
              marginTop: 50,
              padding: 10,
            },
            successColor: colors.lightGreen,
            textStyle: {
              color: 'white',
              textAlign: 'center',
            },
            swipeEnabled: true,
          }
        );
      }
      console.log(data);
    },

    onError: async () => {
      show('Something went wrong removing from cart', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useComment = () => {
  const { show } = useToast();
  const { user, id } = useStoreId();
  return useMutation({
    mutationKey: ['comment'],
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: string;
      rating: number;

      comment: string;
    }) => {
      const response = await axios.post(
        ` https://test.omega12x.net/api.aspx?api=ratedeliveredprod&myuserid=${id}&productid=${productId}&fullname=${user?.customername}&ratestar=${rating}&rateinfo=${comment}`
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data === 'saved') {
        return show('Thanks for rating this product!!', {
          type: 'success',
          placement: 'top',
          duration: 4000,
          animationType: 'slide-in',
          style: {
            marginTop: 50,
            padding: 10,
          },
          successColor: colors.lightGreen,
          textStyle: {
            color: 'white',
            textAlign: 'center',
          },
          swipeEnabled: true,
        });
      }
      console.log(data);
    },

    onError: async () => {
      show('Something went wrong, please try again later', {
        type: 'danger',
        placement: 'bottom',
        duration: 4000,
        animationType: 'slide-in',
      });
    },
  });
};
export const useGetProfile = () => {
  const { show } = useToast();
  const { user, id } = useStoreId();
  const router = useRouter();
  return useMutation({
    mutationKey: ['profile'],
    mutationFn: async () => {
      const data = await getProfile(id);
      console.log(data, 'query data');
      return data;
    },
    onSuccess: async (data) => {
      console.log(data);
    },

    onError: async () => {
      router.push('/');
    },
  });
};
