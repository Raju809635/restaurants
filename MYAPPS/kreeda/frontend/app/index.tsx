import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Krida</Text>
      <Text style={styles.subtitle}>Indian Sports App</Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/auth/login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={() => router.push('/auth/register')}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.tertiaryButton]} 
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={[styles.buttonText, styles.tertiaryText]}>Browse App</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 40
  },
  button: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    marginBottom: 15
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35'
  },
  tertiaryButton: {
    backgroundColor: '#138808'
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryText: {
    color: '#FF6B35'
  },
  tertiaryText: {
    color: 'white'
  }
});