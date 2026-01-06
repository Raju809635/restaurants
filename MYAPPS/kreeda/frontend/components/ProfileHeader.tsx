import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-paper';

interface ProfileHeaderProps {
  name: string;
  avatar?: string;
  title?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, avatar, title }) => {
  return (
    <View style={styles.container}>
      <Avatar.Image size={80} source={avatar ? { uri: avatar } : require('../assets/default-avatar.png')} />
      <Text variant="headlineSmall" style={styles.name}>{name}</Text>
      {title && <Text variant="bodyLarge" style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  name: {
    marginTop: 8,
  },
  title: {
    marginTop: 4,
    opacity: 0.7,
  },
});

export default ProfileHeader; 