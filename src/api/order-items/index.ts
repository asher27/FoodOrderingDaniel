import { supabase } from '@/lib/supabase';
import { InsertTables } from '@/types';
import { useMutation } from '@tanstack/react-query';


// * 배열 데이터 한번에 insert : 해당 배열 object를 넣으면 된다  ..........
export const useInsertOrderItems = () => {
    return useMutation({
        async mutationFn(items: InsertTables<'order_items'>[]) {
            const { error, data: newOrderItems } = await supabase
                .from('order_items')
                .insert(items)
                .select();
                // console.log('saveOrderItems > orderItems > useInsertOrderItems', error);


            if (error) throw new Error(error.message);

            return newOrderItems;
        },
    });
};
