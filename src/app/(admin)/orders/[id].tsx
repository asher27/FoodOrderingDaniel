import { useOrderDetails, useUpdateOrder } from '@/api/orders';
import OrderItemListItem from '@/components/OrderItemListItem';
import OrderListItem from '@/components/OrderListItem';
import Colors from '@/constants/Colors';
import { OrderStatusList } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const OrderDetailScreen = () => {
    const { id: idString } = useLocalSearchParams();
    const id = parseFloat(
        typeof idString === 'string' ? idString : idString[0]
    );

    const { data: order, isLoading, error } = useOrderDetails(id);
    const { mutate: updateOrder } = useUpdateOrder();

    const updateStatus = async (status: string) => {
        await updateOrder({
            id,
            updatedFields: { status },
        });
      if (order) {
          // TODO: user에게 상태변화 알리기 trigger..
        }
    };

    if (isLoading) return <ActivityIndicator />;
    if (error || !order) return <Text>Fail to fetch order details.</Text>;

    return (
        <View style={{ flex: 1, padding: 10, gap: 20 }}>
            <Stack.Screen options={{ title: `Order #${order.id}` }} />
            <FlatList
                data={order?.order_items}
                renderItem={({ item }) => <OrderItemListItem item={item} />}
                contentContainerStyle={{ gap: 10 }}
                ListHeaderComponent={() => <OrderListItem order={order} />}
                ListFooterComponent={() => (
                    <>
                        <Text>Status</Text>
                        <View style={{ flexDirection: 'row', gap: 5 }}>
                            {OrderStatusList.map((status) => (
                                <Pressable
                                    key={status}
                                    onPress={() => updateStatus(status)}
                                    style={{
                                        borderColor: Colors.light.tint,
                                        borderWidth: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginVertical: 10,
                                        backgroundColor:
                                            order?.status === status
                                                ? Colors.light.tint
                                                : 'transparent',
                                    }}
                                >
                                    <Text
                                        style={{
                                            color:
                                                order?.status === status
                                                    ? 'white'
                                                    : Colors.light.tint,
                                        }}
                                    >
                                        {status}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </>
                )}
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
