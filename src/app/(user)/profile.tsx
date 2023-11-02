import Button from '@/components/Button';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
   
    return (
        <View style={styles.container}>
        <Text>Profile</Text>
        <Button
          text='Sign out'
          onPress={async () => await supabase.auth.signOut()}
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

export default ProfileScreen;
