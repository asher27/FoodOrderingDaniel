import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator);

const OrdersTab = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
            <TopTabs>
                <TopTabs.Screen name="index" options={{title: 'Active'}}/>
            </TopTabs>
        </SafeAreaView>
    );
};

export default OrdersTab;
