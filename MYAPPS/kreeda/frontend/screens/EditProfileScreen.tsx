import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  Avatar, 
  Card, 
  Text, 
  Chip, 
  Surface, 
  IconButton,
  Menu,
  Switch,
  HelperText,
  Divider
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  age: number;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  sports: string[];
  skillLevels: { [sport: string]: string };
  achievements: string[];
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    shareLocation: boolean;
    showAchievements: boolean;
  };
}

interface EditProfileScreenProps {
  route: {
    params: {
      profile: UserProfile;
    };
  };
  navigation: any;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name too short'),
  bio: Yup.string().max(200, 'Bio too long'),
  location: Yup.string().required('Location is required'),
  age: Yup.number().min(13, 'Must be at least 13 years old').max(120, 'Invalid age'),
  phone: Yup.string().matches(/^[0-9+\-\s()]*$/, 'Invalid phone number'),
  email: Yup.string().email('Invalid email').required('Email is required')
});

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ route, navigation }) => {
  const { profile } = route.params;
  const [avatar, setAvatar] = useState(profile.avatar || null);
  const [selectedSports, setSelectedSports] = useState<string[]>(profile.sports || []);
  const [skillLevels, setSkillLevels] = useState<{ [sport: string]: string }>(profile.skillLevels || {});
  const [genderMenuVisible, setGenderMenuVisible] = useState(false);
  
  const availableSports = [
    'Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 
    'Running', 'Kabaddi', 'Hockey', 'Volleyball', 'Swimming', 
    'Cycling', 'Boxing', 'Wrestling', 'Athletics'
  ];
  
  const skillLevelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const initialValues = {
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    location: profile.location || '',
    age: profile.age || '',
    phone: profile.phone || '',
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || '',
    preferences: {
      notifications: profile.preferences?.notifications ?? true,
      publicProfile: profile.preferences?.publicProfile ?? true,
      shareLocation: profile.preferences?.shareLocation ?? false,
      showAchievements: profile.preferences?.showAchievements ?? true
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to select a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter(s => s !== sport));
      const newSkillLevels = { ...skillLevels };
      delete newSkillLevels[sport];
      setSkillLevels(newSkillLevels);
    } else {
      setSelectedSports([...selectedSports, sport]);
      setSkillLevels({ ...skillLevels, [sport]: 'Beginner' });
    }
  };

  const updateSkillLevel = (sport: string, level: string) => {
    setSkillLevels({ ...skillLevels, [sport]: level });
  };

  const handleSave = (values: any) => {
    const updatedProfile = {
      ...profile,
      ...values,
      avatar,
      sports: selectedSports,
      skillLevels,
      age: parseInt(values.age.toString())
    };
    
    console.log('Updated Profile:', updatedProfile);
    Alert.alert(
      'Profile Updated!',
      'Your profile has been updated successfully.',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.headerTitle}>
                Edit Profile
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                प्रोफ़ाइल संपादित करें - Update your information below
              </Text>
            </View>

            {/* Profile Photo */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Profile Photo</Text>
                <View style={styles.avatarContainer}>
                  <Avatar.Image
                    size={120}
                    source={avatar ? { uri: avatar } : require('../assets/default-avatar.png')}
                    style={styles.avatar}
                  />
                  <View style={styles.photoButtons}>
                    <Button mode="outlined" onPress={showImagePicker} style={styles.photoButton}>
                      Change Photo
                    </Button>
                    {avatar && (
                      <IconButton
                        icon="delete"
                        iconColor="#EF4444"
                        onPress={() => setAvatar(null)}
                      />
                    )}
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Personal Information */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Personal Information</Text>
                
                <TextInput
                  label="Full Name *"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && !!errors.name}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.name && !!errors.name}>
                  {errors.name}
                </HelperText>

                <TextInput
                  label="Email *"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  error={touched.email && !!errors.email}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.email && !!errors.email}>
                  {errors.email}
                </HelperText>

                <TextInput
                  label="Phone Number"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType="phone-pad"
                  error={touched.phone && !!errors.phone}
                  style={styles.input}
                  placeholder="+91 9876543210"
                />
                <HelperText type="error" visible={touched.phone && !!errors.phone}>
                  {errors.phone}
                </HelperText>

                <View style={styles.row}>
                  <TextInput
                    label="Age *"
                    value={values.age.toString()}
                    onChangeText={handleChange('age')}
                    onBlur={handleBlur('age')}
                    keyboardType="numeric"
                    error={touched.age && !!errors.age}
                    style={[styles.input, styles.halfInput]}
                  />
                  
                  <Menu
                    visible={genderMenuVisible}
                    onDismiss={() => setGenderMenuVisible(false)}
                    anchor={
                      <TouchableOpacity style={styles.halfInput} onPress={() => setGenderMenuVisible(true)}>
                        <TextInput
                          label="Gender"
                          value={values.gender}
                          editable={false}
                          style={styles.input}
                          right={<TextInput.Icon icon="chevron-down" />}
                        />
                      </TouchableOpacity>
                    }
                  >
                    {genderOptions.map((gender) => (
                      <Menu.Item
                        key={gender}
                        onPress={() => {
                          setFieldValue('gender', gender);
                          setGenderMenuVisible(false);
                        }}
                        title={gender}
                      />
                    ))}
                  </Menu>
                </View>
                <HelperText type="error" visible={touched.age && !!errors.age}>
                  {errors.age}
                </HelperText>

                <TextInput
                  label="Location *"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  error={touched.location && !!errors.location}
                  style={styles.input}
                  placeholder="City, State"
                />
                <HelperText type="error" visible={touched.location && !!errors.location}>
                  {errors.location}
                </HelperText>

                <TextInput
                  label="Bio"
                  value={values.bio}
                  onChangeText={handleChange('bio')}
                  onBlur={handleBlur('bio')}
                  multiline
                  numberOfLines={4}
                  error={touched.bio && !!errors.bio}
                  style={styles.input}
                  placeholder="Tell others about yourself, your interests, and sports experience..."
                />
                <HelperText type="info">
                  {values.bio.length}/200 characters
                </HelperText>
              </Card.Content>
            </Card>

            {/* Sports & Skills */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Sports & Skills</Text>
                <Text variant="bodySmall" style={styles.sectionDescription}>
                  Select the sports you play and set your skill level for each
                </Text>
                
                <View style={styles.sportsGrid}>
                  {availableSports.map((sport) => (
                    <View key={sport} style={styles.sportItem}>
                      <Chip
                        selected={selectedSports.includes(sport)}
                        onPress={() => toggleSport(sport)}
                        style={[
                          styles.sportChip,
                          selectedSports.includes(sport) && styles.selectedSportChip
                        ]}
                        textStyle={{
                          color: selectedSports.includes(sport) ? '#FFFFFF' : '#FF6B35'
                        }}
                        selectedColor="#FF6B35"
                      >
                        {sport}
                      </Chip>
                      
                      {selectedSports.includes(sport) && (
                        <View style={styles.skillLevelContainer}>
                          {skillLevelOptions.map((level) => (
                            <Chip
                              key={level}
                              selected={skillLevels[sport] === level}
                              onPress={() => updateSkillLevel(sport, level)}
                              style={styles.skillChip}
                              textStyle={{
                                fontSize: 10,
                                color: skillLevels[sport] === level ? '#FFFFFF' : '#6B7280'
                              }}
                              selectedColor="#10B981"
                            >
                              {level}
                            </Chip>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </Card.Content>
            </Card>

            {/* Privacy Settings */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Privacy & Preferences</Text>
                
                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Enable Notifications</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      Receive updates about events and activities
                    </Text>
                  </View>
                  <Switch
                    value={values.preferences.notifications}
                    onValueChange={(value) => {
                      setFieldValue('preferences.notifications', value);
                    }}
                  />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Public Profile</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      Allow others to view your profile
                    </Text>
                  </View>
                  <Switch
                    value={values.preferences.publicProfile}
                    onValueChange={(value) => {
                      setFieldValue('preferences.publicProfile', value);
                    }}
                  />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Share Location</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      Show your city in your profile
                    </Text>
                  </View>
                  <Switch
                    value={values.preferences.shareLocation}
                    onValueChange={(value) => {
                      setFieldValue('preferences.shareLocation', value);
                    }}
                  />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Show Achievements</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      Display your achievements on your profile
                    </Text>
                  </View>
                  <Switch
                    value={values.preferences.showAchievements}
                    onValueChange={(value) => {
                      setFieldValue('preferences.showAchievements', value);
                    }}
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                contentStyle={styles.buttonContent}
              >
                Cancel
              </Button>
              
              <Button
                mode="contained"
                onPress={() => handleSubmit()}
                style={styles.saveButton}
                contentStyle={styles.buttonContent}
              >
                Save Changes
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  form: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6B7280',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionDescription: {
    color: '#6B7280',
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    borderWidth: 4,
    borderColor: '#FF6B35',
    marginBottom: 12,
  },
  photoButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  photoButton: {
    borderColor: '#FF6B35',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  sportsGrid: {
    gap: 16,
  },
  sportItem: {
    marginBottom: 16,
  },
  sportChip: {
    backgroundColor: '#F9FAFB',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  selectedSportChip: {
    backgroundColor: '#FF6B35',
  },
  skillLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 12,
  },
  skillChip: {
    height: 28,
    backgroundColor: '#F3F4F6',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EditProfileScreen;
