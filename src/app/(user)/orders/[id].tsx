import { useUpdateOrderSubscription } from '@/api/order-items/\bsubscriptoins';
import { useOrderDetails } from '@/api/orders';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const OrderDetailScreen = () => {
    const router = useRouter();
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
        typeof idString === 'string' ? idString : idString[0]
    );

    const { data: order, isLoading, error } = useOrderDetails(id);

    useUpdateOrderSubscription(id);

    if (isLoading) return <ActivityIndicator />;
    if (error || !order) return <Text>Fail to fetch order details.</Text>;

    return (
        <View style={{ flex: 1, padding: 10, gap: 20 }}>
            <Stack.Screen options={{
                title: `Order #${order.id}`,
                headerRight: () => (
                    <Link href={'/(user)/orders'} asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                    name='list'
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
                )
            
            }} />
            <FlatList
                data={order?.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}
                ListHeaderComponent={() => <OrderListItem order={order} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default OrderDetailScreen;
