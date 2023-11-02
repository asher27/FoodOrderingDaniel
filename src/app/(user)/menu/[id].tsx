import { useProduct } from '@/api/products';
import Button from '@/components/Button';
import RemoteImage from '@/components/RemoteImage';
import { defaultPizzaImage } from '@/constants/Defaults';
import { useCart } from '@/providers/CartProvider';
import { PizzaSize } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
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
            <Stack.Screen options={{ title: product.name }} />

            <RemoteImage
                fallback={defaultPizzaImage}
                path={product.image}
                style={styles.image}
                resizeMode='contain'
            />

            <Text style={styles.subtitle}>Select size</Text>
            <View style={styles.sizes}>
                {sizes.map((size) => (
                    <Pressable
                        key={size}
                        onPress={() => setSelectedSize(size)}
                        style={[
                            styles.size,
                            {
                                backgroundColor:
                                    size === selectedSize
                                        ? 'gainsboro'
                                        : 'white',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.sizeText,
                                {
                                    color:
                                        size === selectedSize
                                            ? 'black'
                                            : 'gray',
                                },
                            ]}
                        >
                            {size}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.price}>Price: ${product.price.toFixed(2)}</Text>
            <Button onPress={addToCart} text='Add to cart' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
        alignSelf: 'center',
    },
    subtitle: {
        marginVertical: 10,
        fontWeight: '600',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 'auto',
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    size: {
        width: 50,
        aspectRatio: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sizeText: {
        fontSize: 20,
        fontWeight: '500',
        color: 'black',
    },
});

export default ProductDetailScreen;
