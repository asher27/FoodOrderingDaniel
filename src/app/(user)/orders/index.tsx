import OrderListItem from '@/components/OrderListItem';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';

import { useMyOrderList } from '@/api/orders';

const OrdersScreen = () => {
    const { data: orders, isLoading, error } = useMyOrderList();

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Fail to fetch orders</Text>;

    return (
        <FlatList
            data={orders}
            renderItem={({ item }) => <OrderListItem order={item} />}
            contentContainerStyle={{ gap: 10, padding: 10 }}
        />
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

export default OrdersScreen;
