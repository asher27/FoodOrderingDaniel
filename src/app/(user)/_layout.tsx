import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    const { session } = useAuth();
    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            }}
        >
            <Tabs.Screen name='index' options={{ href: null }} />
            <Tabs.Screen
                name='menu'
                options={{
                    title: 'Menu',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='cutlery' color={color} />
                    ),
                    headerRight: () => (
                        <Link href='/modal' asChild>
                            <Pressable>
                                {({ pressed }) => (
                                    <FontAwesome
                                        name='info-circle'
                                        size={25}
                                        color={
                                            Colors[colorScheme ?? 'light'].text
                                        }
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
            <Tabs.Screen
                name='orders'
                options={{
                    title: 'Orders',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='list' color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    headerShown: true,
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name='user' color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
