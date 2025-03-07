import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { refetchDeliveryFee } from '../lib/helpers';
import { useUser } from '../lib/queries';
import { useStoreId } from '../lib/zustand/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useRefetchFee = () => {
  const { id } = useStoreId();
  const isFocused = useIsFocused();
  console.log({ isFocused });
  const queryClient = useQueryClient();
  const { data, isPending, isFetching, isRefetching, isLoading } = useUser(id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!data) return;
      setLoading(true);
      try {
        const response = await refetchDeliveryFee(
          id,
          data?.productInCart,
          data?.communityId
        );
        queryClient.invalidateQueries({ queryKey: ['order'] });
        console.log('Delivery fee data:', response.data);
      } catch (error) {
        console.error('Error fetching delivery fee:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchData();
    } // Call the function when the screen is focused
  }, [
    id,
    data?.productInCart,
    data?.communityId,
    isFocused,
    data,
    queryClient,
  ]); // Dependencies to re-run the effect if they change

  return isPending || isRefetching || isLoading || isFetching || loading;
};
