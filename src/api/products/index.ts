import { supabase } from '@/lib/supabase';
import { Tables } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 다중 행 가져오기...............
export const useProductList = () => {
    return useQuery<Tables<'products'>[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name', { ascending: true });
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
    });
};

// id 로 특정 행 가져오기...............
export const useProduct = (id: number) => {
    return useQuery<Tables<'products'>>({
        queryKey: ['product'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        },
    });
};

// insert ...............
export const useInsertProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(data: Omit<Tables<'products'>, 'id'>) {
            const { error, data: newProduct } = await supabase
                .from('products')
                .insert({
                    name: data.name,
                    price: data.price,
                    image: data.image,
                });

            if (error) throw new Error(error.message);

            return newProduct;
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['products']);
        },
        onError(error) {
            console.log(error);
        },
    });
};

// update ............
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn({ id, ...update }: Tables<'products'>) {
            const { error, data: updatedProduct } = await supabase
                .from('products')
                .update(update)
                .eq('id', id)
                .select();

            if (error) throw new Error(error.message);

            return updatedProduct;
        },
        async onSuccess(_, { id }) {
            await queryClient.invalidateQueries(['products']);
            await queryClient.invalidateQueries(['product', id]);
        },
        onError(error) {
            console.log(error);
        },
    });
};

// delete ......
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        async mutationFn(id: number) {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw new Error(error.message);
        },
        async onSuccess() {
            await queryClient.invalidateQueries(['products']);
        },
    });
};
