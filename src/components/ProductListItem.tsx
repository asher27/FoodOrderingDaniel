import Colors from '@/constants/Colors';
import { defaultPizzaImage } from '@/constants/Defaults';
import { Tables } from '@/types';
import { Link, useSegments } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import RemoteImage from './RemoteImage';

type ProductListItemProps = {
    product: Tables<'products'>;
};

const ProductListItem = ({ product }: ProductListItemProps) => {
    const segments = useSegments();

    // console.log(segments);

    return (
        <Link href={`/${segments[0]}/menu/${product.id}`} asChild>
            <Pressable style={styles.container}>
                <RemoteImage
                    fallback={defaultPizzaImage}
                    path={product.image}
                    style={styles.image}
                    resizeMode='contain'
                />
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
            </Pressable>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 20,
        flex: 1,
        maxWidth: '50%',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 10,
    },
    price: {
        color: Colors.light.tint,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
});
export default ProductListItem;
