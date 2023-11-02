import { useProductList } from '@/api/products';
import ProductListItem from '@/components/ProductListItem';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function MenuScreen() {

    const {data: products, isLoading, error} = useProductList();

    if (isLoading) return <ActivityIndicator />
    if (error) return <Text>Fail to fetch products</Text>

    return (
        <View>
            <FlatList 
                data={products}
                renderItem={({ item }) => <ProductListItem product={item} />}
                numColumns={2}
                contentContainerStyle={{ gap: 10, padding: 10 }}
                columnWrapperStyle={{gap: 10}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
});
