import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from './types';
import { useToast } from 'react-native-toast-notifications';
import { useStoreId } from './zustand/auth';
import { useModalState } from './zustand/modalState';
import { colors } from '../constants/Colors';
const api = process.env.EXPO_PUBLIC_API_URL;

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
        `${api}?api=addtowishlist&productid=${productId}&myuserid=${id}`
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
      const response = await axios.post(
        `${api}?api=addtocart&productid=${productId}&myuserid=${id}&qty=${qty}&statename=${user?.statename}`
      );

      console.log(qty, user?.statename, productId, id);

      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['cartList'] });
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
        `${api}?api=removefromcart&saleid=${salesId}`
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
        `${api}?api=cartpaycard&productincart=${productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${couponCode}`
      );

      return response.data as PaystackType;
    },
    onSuccess: async (data) => {
      // queryClient.invalidateQueries({ queryKey: ['cartList'] });
      // queryClient.invalidateQueries({ queryKey: ['user'] });
      // show('Removed from cart', {
      //   type: 'success',
      //   placement: 'bottom',
      //   duration: 4000,
      //   animationType: 'slide-in',
      // });
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
        `${api}?api=cartpaywallet&productincart=${productInCart}&myuserid=${id}&communityId=${user?.communityId}&couponCode=${couponCode}&fullname=${user?.customername}&addres=${user?.addres}&emailaddress=${user?.email}`
      );

      return response.data;
    },
    onSuccess: async (data) => {
      if (data === 'saved') {
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
        `${api}?api=pharmacyregistration&pharmacyname=$${pharmacyName}&statename=${stateName}&addres=${address}&emailaddress=${email}&phone=${phoneNumber}`
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
