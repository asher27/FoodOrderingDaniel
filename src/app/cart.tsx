import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import Button from '@/components/Button';
import CartListItem from '@/components/CartListItem';
import { useCart } from '@/providers/CartProvider';
import { FlatList } from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';

export default function CartScreen() {
    const { items, total, checkout } = useCart();

    return (
        <View style={{ padding: 10 }}>
            <FlatList data={items} renderItem={({ item }) => <CartListItem cartItem={item} />} contentContainerStyle={{ gap: 10 }} />

            <Text style={{ marginTop: 20, fontSize: 20, fontWeight: '500' }}>Total: ${total.toFixed(2)}</Text>
            <Button onPress={checkout} text="Checkout" />

            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}
