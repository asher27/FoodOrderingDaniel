import { useProduct } from '@/api/products';
import RemoteImage from '@/components/RemoteImage';
import Colors from '@/constants/Colors';
import { defaultPizzaImage } from '@/constants/Defaults';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { addItem } = useCart();

    const {
        data: product,
        isLoading,
        error,
    } = useProduct(parseInt(typeof id === 'string' ? id : id[0]));

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

    const addToCart = () => {
        if (!product) return;

        addItem(product, selectedSize);
        router.push('/cart');
    };

    if (isLoading) return <ActivityIndicator />;

    if (error || !product) return <Text>Fail to fetch product</Text>;

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Menu',
                    headerRight: () => (
                        <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name='pencil'
                                        size={25}
                                        color={Colors.light.tint}
                                        style={{
                                            marginRight: 15,
                                            opacity: pressed ? 0.5 : 1,
                                        }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
                }}
            />

            <Stack.Screen options={{ title: product.name }} />

            <RemoteImage
                fallback={defaultPizzaImage}
                path={product.image}
                style={styles.image}
                resizeMode='contain'
            />

            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    price: {
        fontSize: 18,
        fontWeight: '500',
    },
});

export default ProductDetailScreen;
