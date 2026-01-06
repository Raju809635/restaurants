import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { 
  TextInput, 
  Button, 
  HelperText, 
  Card, 
  Text, 
  Chip, 
  IconButton,
  Surface,
  Menu,
  Switch
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as ImagePicker from 'expo-image-picker';

interface EventFormValues {
  title: string;
  description: string;
  sport: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  address: string;
  maxParticipants: string;
  entryFee: string;
  difficulty: string;
  requirements: string[];
  prizes: string[];
  isPublic: boolean;
  allowSpectators: boolean;
  provideEquipment: boolean;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(5, 'Title too short'),
  description: Yup.string().required('Description is required').min(20, 'Description too short'),
  sport: Yup.string().required('Sport is required'),
  location: Yup.string().required('Location is required'),
  address: Yup.string().required('Full address is required'),
  maxParticipants: Yup.string()
    .required('Maximum participants is required')
    .matches(/^[0-9]+$/, 'Must be a number')
    .test('min-participants', 'Minimum 2 participants required', (value) => {
      return parseInt(value || '0') >= 2;
    }),
  entryFee: Yup.string().matches(/^[0-9]*$/, 'Entry fee must be a number'),
  difficulty: Yup.string().required('Difficulty level is required'),
});

const EventFormScreen = ({ navigation, route }: { navigation: any, route?: any }) => {
  const isEditing = route?.params?.event ? true : false;
  const existingEvent = route?.params?.event;
  
  const [eventImage, setEventImage] = useState<string | null>(existingEvent?.image || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [sportMenuVisible, setSportMenuVisible] = useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);
  
  const sports = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Running', 'Kabaddi', 'Hockey', 'Volleyball', 'Swimming'];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  const initialValues: EventFormValues = {
    title: existingEvent?.title || '',
    description: existingEvent?.description || '',
    sport: existingEvent?.sport || '',
    date: existingEvent?.date ? new Date(existingEvent.date) : new Date(),
    startTime: existingEvent?.startTime ? new Date(`2024-01-01T${existingEvent.startTime}`) : new Date(),
    endTime: existingEvent?.endTime ? new Date(`2024-01-01T${existingEvent.endTime}`) : new Date(),
    location: existingEvent?.location?.name || '',
    address: existingEvent?.location?.address || '',
    maxParticipants: existingEvent?.maxParticipants?.toString() || '',
    entryFee: existingEvent?.entryFee?.toString() || '0',
    difficulty: 'Beginner',
    requirements: existingEvent?.requirements || [],
    prizes: existingEvent?.prizes || [],
    isPublic: true,
    allowSpectators: true,
    provideEquipment: false
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEventImage(result.assets[0].uri);
    }
  };

  const handleSubmit = (values: EventFormValues) => {
    const eventData = {
      ...values,
      image: eventImage,
      date: values.date.toISOString().split('T')[0],
      startTime: values.startTime.toTimeString().slice(0, 5),
      endTime: values.endTime.toTimeString().slice(0, 5),
      maxParticipants: parseInt(values.maxParticipants),
      entryFee: values.entryFee ? parseInt(values.entryFee) : 0,
      location: {
        name: values.location,
        address: values.address
      }
    };
    
    console.log('Event Data:', eventData);
    Alert.alert(
      isEditing ? 'Event Updated!' : 'Event Created!', 
      `Your event "${values.title}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
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
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.form}>
            {/* Header */}
            <View style={styles.header}>
              <Text variant="headlineMedium" style={styles.headerTitle}>
                {isEditing ? 'Edit Event' : 'Create New Event'}
              </Text>
              <Text variant="bodyMedium" style={styles.headerSubtitle}>
                नया खेल इवेंट बनाएं - Fill in the details below
              </Text>
            </View>

            {/* Event Image */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Event Image</Text>
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                  {eventImage ? (
                    <Image source={{ uri: eventImage }} style={styles.eventImage} />
                  ) : (
                    <Surface style={styles.imagePlaceholder} elevation={1}>
                      <IconButton icon="camera-plus" size={40} iconColor="#6B7280" />
                      <Text variant="bodyMedium" style={styles.placeholderText}>
                        Add Event Photo
                      </Text>
                    </Surface>
                  )}
                </TouchableOpacity>
              </Card.Content>
            </Card>

            {/* Basic Information */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Basic Information</Text>
                
                <TextInput
                  label="Event Title *"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  error={touched.title && !!errors.title}
                  style={styles.input}
                  placeholder="e.g., Mumbai Cricket Championship 2024"
                />
                <HelperText type="error" visible={touched.title && !!errors.title}>
                  {errors.title}
                </HelperText>

                <TextInput
                  label="Description *"
                  value={values.description}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  multiline
                  numberOfLines={4}
                  error={touched.description && !!errors.description}
                  style={styles.input}
                  placeholder="Describe your event, rules, what to expect..."
                />
                <HelperText type="error" visible={touched.description && !!errors.description}>
                  {errors.description}
                </HelperText>

                <Menu
                  visible={sportMenuVisible}
                  onDismiss={() => setSportMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setSportMenuVisible(true)}>
                      <TextInput
                        label="Sport *"
                        value={values.sport}
                        editable={false}
                        error={touched.sport && !!errors.sport}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                      />
                    </TouchableOpacity>
                  }
                >
                  {sports.map((sport) => (
                    <Menu.Item
                      key={sport}
                      onPress={() => {
                        setFieldValue('sport', sport);
                        setSportMenuVisible(false);
                      }}
                      title={sport}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.sport && !!errors.sport}>
                  {errors.sport}
                </HelperText>

                <Menu
                  visible={difficultyMenuVisible}
                  onDismiss={() => setDifficultyMenuVisible(false)}
                  anchor={
                    <TouchableOpacity onPress={() => setDifficultyMenuVisible(true)}>
                      <TextInput
                        label="Difficulty Level *"
                        value={values.difficulty}
                        editable={false}
                        error={touched.difficulty && !!errors.difficulty}
                        style={styles.input}
                        right={<TextInput.Icon icon="chevron-down" />}
                      />
                    </TouchableOpacity>
                  }
                >
                  {difficulties.map((difficulty) => (
                    <Menu.Item
                      key={difficulty}
                      onPress={() => {
                        setFieldValue('difficulty', difficulty);
                        setDifficultyMenuVisible(false);
                      }}
                      title={difficulty}
                    />
                  ))}
                </Menu>
                <HelperText type="error" visible={touched.difficulty && !!errors.difficulty}>
                  {errors.difficulty}
                </HelperText>
              </Card.Content>
            </Card>

            {/* Date & Time */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Date & Time</Text>
                
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    label="Event Date *"
                    value={values.date.toDateString()}
                    editable={false}
                    style={styles.input}
                    right={<TextInput.Icon icon="calendar" />}
                  />
                </TouchableOpacity>

                <View style={styles.timeRow}>
                  <TouchableOpacity style={styles.timeInput} onPress={() => setShowStartTimePicker(true)}>
                    <TextInput
                      label="Start Time"
                      value={values.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      editable={false}
                      right={<TextInput.Icon icon="clock" />}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndTimePicker(true)}>
                    <TextInput
                      label="End Time"
                      value={values.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      editable={false}
                      right={<TextInput.Icon icon="clock" />}
                    />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>

            {/* Location */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
                
                <TextInput
                  label="Venue Name *"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  error={touched.location && !!errors.location}
                  style={styles.input}
                  placeholder="e.g., Central Park Cricket Ground"
                />
                <HelperText type="error" visible={touched.location && !!errors.location}>
                  {errors.location}
                </HelperText>

                <TextInput
                  label="Full Address *"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  error={touched.address && !!errors.address}
                  style={styles.input}
                  placeholder="Complete address with city and state"
                  multiline
                  numberOfLines={2}
                />
                <HelperText type="error" visible={touched.address && !!errors.address}>
                  {errors.address}
                </HelperText>
              </Card.Content>
            </Card>

            {/* Participants & Pricing */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Participants & Pricing</Text>
                
                <View style={styles.row}>
                  <TextInput
                    label="Max Participants *"
                    value={values.maxParticipants}
                    onChangeText={handleChange('maxParticipants')}
                    onBlur={handleBlur('maxParticipants')}
                    keyboardType="numeric"
                    error={touched.maxParticipants && !!errors.maxParticipants}
                    style={[styles.input, styles.halfInput]}
                  />
                  
                  <TextInput
                    label="Entry Fee (₹)"
                    value={values.entryFee}
                    onChangeText={handleChange('entryFee')}
                    onBlur={handleBlur('entryFee')}
                    keyboardType="numeric"
                    error={touched.entryFee && !!errors.entryFee}
                    style={[styles.input, styles.halfInput]}
                    placeholder="0 for free"
                  />
                </View>
                <HelperText type="error" visible={touched.maxParticipants && !!errors.maxParticipants}>
                  {errors.maxParticipants}
                </HelperText>
              </Card.Content>
            </Card>

            {/* Settings */}
            <Card style={styles.section}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>Event Settings</Text>
                
                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Public Event</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      Anyone can view and join this event
                    </Text>
                  </View>
                  <Switch
                    value={values.isPublic}
                    onValueChange={(value) => {
                      setFieldValue('isPublic', value);
                    }}
                  />
                </View>

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Allow Spectators</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      People can watch without participating
                    </Text>
                  </View>
                  <Switch
                    value={values.allowSpectators}
                    onValueChange={(value) => {
                      setFieldValue('allowSpectators', value);
                    }}
                  />
                </View>

                <View style={styles.switchRow}>
                  <View style={styles.switchInfo}>
                    <Text variant="bodyLarge">Provide Equipment</Text>
                    <Text variant="bodySmall" style={styles.switchDescription}>
                      You will provide sports equipment
                    </Text>
                  </View>
                  <Switch
                    value={values.provideEquipment}
                    onValueChange={(value) => {
                      setFieldValue('provideEquipment', value);
                    }}
                  />
                </View>
              </Card.Content>
            </Card>

            {/* Submit Buttons */}
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
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
              >
                {isEditing ? 'Update Event' : 'Create Event'}
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
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  halfInput: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  imageContainer: {
    marginBottom: 8,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#6B7280',
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  switchInfo: {
    flex: 1,
    marginRight: 16,
  },
  switchDescription: {
    color: '#6B7280',
    marginTop: 2,
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
  submitButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default EventFormScreen;
