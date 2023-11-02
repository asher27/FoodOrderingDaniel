import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { Link, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const index = () => {
    const { session, profile, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    if (profile?.group === 'ADMIN') {
        return (
            <View style={styles.container}>
                <Link href={'/(user)'} asChild>
                    <Button text="User" />
                </Link>
                <Link href={'/(admin)'} asChild>
                    <Button text="Admin" />
                </Link>

                <Button text="Log out" onPress={async () => await supabase.auth.signOut()} />
            </View>
        );
    }

    return <Redirect href={'/(user)'} />;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddding: 10,
    },
});

export default index;
