import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const MenuStack = () => {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                title: 'admin menu',
                headerRight: () => (
                    <Link href={'/(admin)/menu/create?id='} asChild>
                        <Pressable>
                            {({ pressed }) => (
                                <FontAwesome
                                    name='plus-square-o'
                                    size={25}
                                    color={Colors.light.tint}
                                    style={{marginRight: 15, opacity: pressed ? 0.5 : 1}}
                                />
                            )}
                        </Pressable>
                    </Link>
                )
            }} />
        </Stack>
    );
};

export default MenuStack;
