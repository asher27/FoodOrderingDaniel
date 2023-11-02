import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';


// * orders table에 insert  되었을때 알림 subscription........
export const useInsertOrderSubscription = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const orderInsertSubscription = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Change received!', payload);
                    queryClient.invalidateQueries(['orders']);
                }
            )
            .subscribe();

        return () => {
          orderInsertSubscription.unsubscribe();
        };
    }, []);
};


// * orders table에 update  되었을때 알림 subscription........
export const useUpdateOrderSubscription = (id: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
      const orderUpdateSubscription = supabase
          .channel('custom-filter-channel')
          .on(
              'postgres_changes',
              { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
              (payload) => {
                  console.log('Change received!', payload);
                  queryClient.invalidateQueries(['orders', id]);
              }
          )
          .subscribe();

      return () => {
        orderUpdateSubscription.unsubscribe();
      };
  }, []);
};
