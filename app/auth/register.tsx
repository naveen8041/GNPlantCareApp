import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { AuthService } from '@/services/AuthService';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nurseryName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, nurseryName, password, confirmPassword } = formData;

    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!nurseryName.trim()) {
      Alert.alert('Error', 'Please enter your nursery name');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await AuthService.register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        nurseryName: formData.nurseryName.trim(),
        password: formData.password,
      });

      Alert.alert(
        'Registration Successful!',
        'Welcome to Gandhi Nursery Plant Care. You can now start managing your plants.'
      );
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Join Gandhi Nursery</Text>
        <Text style={styles.subtitle}>Create your account to get started</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nursery Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="business" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your nursery name"
              value={formData.nurseryName}
              onChangeText={(value) => updateFormData('nurseryName', value)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={Colors.gray} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                size={20} 
                color={Colors.gray} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginSection}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>Why choose our app?</Text>
        <View style={styles.benefitItem}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
          <Text style={styles.benefitText}>Secure and private plant data</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="flash" size={20} color={Colors.success} />
          <Text style={styles.benefitText}>AI-powered plant identification</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="notifications" size={20} color={Colors.success} />
          <Text style={styles.benefitText}>Smart care reminders</Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="people" size={20} color={Colors.success} />
          <Text style={styles.benefitText}>Expert guidance and support</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    padding: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  benefits: {
    marginHorizontal: 20,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 12,
    flex: 1,
  },
});