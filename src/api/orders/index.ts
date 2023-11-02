import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { InsertTables, Tables, UpdateTables } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 다중 행 가져오기...............
export const useAdminOrderList = ({ archived = false }) => {
    const statuses = archived
        ? ['Delivered']
        : ['New', 'Cooking', 'Delivering'];

    return useQuery<Tables<'orders'>[]>({
        queryKey: ['orders', { archived }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', statuses)
                .order('created_at', { ascending: false });

            if (error) throw new Error(error.message);

            return data;
        },
    });
};

export const useMyOrderList = () => {
    const { session } = useAuth();
    const id = session?.user.id;

    return useQuery<Tables<'orders'>[]>({
        queryKey: ['orders', { userId: id }],
        queryFn: async () => {
            if (!id) return [];
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false });

            if (error) throw new Error(error.message);

            return data;
        },
    });
};

// * order id 로 주문 정보 가져오기 : order_items, products 정보도 함께
export const useOrderDetails = (id: number) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        },
    });
};

// * insert ...........
export const useInsertOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: InsertTables<'orders'>) {
            const { error, data: newOrder } = await supabase
                .from('orders')
                .insert({ ...data })
                .select()
                .single();

            if (error) throw new Error(error.message);
            return newOrder;
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['orders']);
        },
    });
};

// * update............
export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({
            id,
            updatedFields,
        }: {
            id: number;
            updatedFields: UpdateTables<'orders'>;
        }) {
            const { error, data: updatedOrder } = await supabase
                .from('orders')
                .update(updatedFields)
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return updatedOrder;
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['orders']);
            await queryClient.invalidateQueries(['orders', id]);
        },
    });
};
