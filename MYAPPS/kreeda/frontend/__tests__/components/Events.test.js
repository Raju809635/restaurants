import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import EventsScreen from '../../src/screens/EventsScreen';
import EventDetailsScreen from '../../src/screens/EventDetailsScreen';
import EventFormScreen from '../../src/screens/EventFormScreen';
import {
  ApiMockUtils,
  NavigationTestUtils,
  EventTestUtils,
  UserTestUtils,
  ComponentTestUtils,
  PermissionTestUtils
} from '../utils/testUtils';

// Mock navigation
const mockNavigation = NavigationTestUtils.createMockNavigation();
const mockRoute = NavigationTestUtils.createMockRoute();

describe('Events Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiMockUtils.clearMocks();
    PermissionTestUtils.mockGrantedPermissions();
  });

  describe('EventsScreen', () => {
    it('should render events screen correctly', async () => {
      const mockEvents = EventTestUtils.createMockEvents(3);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId, getByText } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('events-screen')).toBeTruthy();
      expect(getByTestId('events-search-input')).toBeTruthy();
      expect(getByTestId('events-filter-button')).toBeTruthy();
      expect(getByTestId('create-event-fab')).toBeTruthy();

      // Wait for events to load
      await waitFor(() => {
        expect(getByTestId('events-list')).toBeTruthy();
      });
    });

    it('should display events list after loading', async () => {
      const mockEvents = EventTestUtils.createMockEvents(3);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId, getAllByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const eventItems = getAllByTestId(/event-item-/);
        expect(eventItems).toHaveLength(3);
      });

      // Check first event details
      expect(getByTestId('event-item-0')).toBeTruthy();
    });

    it('should handle search functionality', async () => {
      const mockEvents = EventTestUtils.createMockEvents(2);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      const searchInput = getByTestId('events-search-input');
      fireEvent.changeText(searchInput, 'Cricket');

      // Should trigger search after debounce
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search=Cricket'),
          expect.any(Object)
        );
      }, { timeout: 2000 });
    });

    it('should handle filter functionality', async () => {
      const mockEvents = EventTestUtils.createMockEvents(3);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      // Open filter modal
      const filterButton = getByTestId('events-filter-button');
      fireEvent.press(filterButton);

      await waitFor(() => {
        expect(getByTestId('filter-modal')).toBeTruthy();
      });

      // Select sport filter
      const cricketFilter = getByTestId('sport-filter-cricket');
      fireEvent.press(cricketFilter);

      // Apply filters
      const applyButton = getByTestId('apply-filters-button');
      fireEvent.press(applyButton);

      // Should call API with filter
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('sport=Cricket'),
          expect.any(Object)
        );
      });
    });

    it('should handle pull to refresh', async () => {
      const mockEvents = EventTestUtils.createMockEvents(2);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('events-list')).toBeTruthy();
      });

      // Trigger pull to refresh
      const eventsList = getByTestId('events-list');
      fireEvent(eventsList, 'refresh');

      // Should refetch events
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle infinite scroll', async () => {
      const mockEvents = EventTestUtils.createMockEvents(10);
      ApiMockUtils.mockPaginatedResponse(mockEvents.slice(0, 5), 1, 2);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('events-list')).toBeTruthy();
      });

      // Mock second page response
      ApiMockUtils.mockPaginatedResponse(mockEvents.slice(5), 2, 2);

      // Trigger end reached
      const eventsList = getByTestId('events-list');
      fireEvent(eventsList, 'endReached');

      // Should load more events
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('page=2'),
          expect.any(Object)
        );
      });
    });

    it('should navigate to event details', async () => {
      const mockEvents = EventTestUtils.createMockEvents(1);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('event-item-0')).toBeTruthy();
      });

      // Tap on event
      const eventItem = getByTestId('event-item-0');
      fireEvent.press(eventItem);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('EventDetails', {
        eventId: mockEvents[0]._id
      });
    });

    it('should navigate to create event', () => {
      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      const createFab = getByTestId('create-event-fab');
      fireEvent.press(createFab);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('EventForm');
    });

    it('should display empty state when no events', async () => {
      ApiMockUtils.mockPaginatedResponse([]);

      const { getByTestId, getByText } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('empty-events-state')).toBeTruthy();
        expect(getByText('No events found')).toBeTruthy();
      });
    });

    it('should handle loading state', () => {
      // Mock delayed response
      global.fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: { items: [] } })
          }), 1000)
        )
      );

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('events-loading')).toBeTruthy();
    });

    it('should handle error state', async () => {
      ApiMockUtils.mockNetworkError();

      const { getByTestId, getByText } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('events-error-state')).toBeTruthy();
        expect(getByText('Failed to load events')).toBeTruthy();
      });

      // Should have retry button
      const retryButton = getByTestId('retry-button');
      expect(retryButton).toBeTruthy();

      // Retry should refetch
      fireEvent.press(retryButton);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('EventDetailsScreen', () => {
    const mockEvent = EventTestUtils.createMockEvent();
    const mockRouteWithParams = NavigationTestUtils.createMockRoute({
      eventId: mockEvent._id
    });

    it('should render event details correctly', async () => {
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const { getByTestId, getByText } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('event-details-screen')).toBeTruthy();
        expect(getByText(mockEvent.title)).toBeTruthy();
        expect(getByText(mockEvent.description)).toBeTruthy();
        expect(getByText(mockEvent.sport)).toBeTruthy();
      });
    });

    it('should display event information', async () => {
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('event-title')).toBeTruthy();
        expect(getByTestId('event-description')).toBeTruthy();
        expect(getByTestId('event-date')).toBeTruthy();
        expect(getByTestId('event-time')).toBeTruthy();
        expect(getByTestId('event-location')).toBeTruthy();
        expect(getByTestId('event-organizer')).toBeTruthy();
        expect(getByTestId('event-participants')).toBeTruthy();
      });
    });

    it('should handle event registration', async () => {
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('register-event-button')).toBeTruthy();
      });

      // Mock successful registration
      ApiMockUtils.mockSuccessResponse({ success: true });

      const registerButton = getByTestId('register-event-button');
      fireEvent.press(registerButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/events/${mockEvent._id}/register`,
          expect.objectContaining({
            method: 'POST'
          })
        );
      });

      // Should show success message
      await waitFor(() => {
        expect(getByTestId('registration-success')).toBeTruthy();
      });
    });

    it('should handle event unregistration', async () => {
      // Mock event where user is registered
      const registeredEvent = {
        ...mockEvent,
        isRegistered: true
      };
      ApiMockUtils.mockSuccessResponse(registeredEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('unregister-event-button')).toBeTruthy();
      });

      const unregisterButton = getByTestId('unregister-event-button');
      fireEvent.press(unregisterButton);

      // Should show confirmation modal
      await waitFor(() => {
        expect(getByTestId('unregister-confirmation-modal')).toBeTruthy();
      });

      // Confirm unregistration
      const confirmButton = getByTestId('confirm-unregister-button');
      ApiMockUtils.mockSuccessResponse({ success: true });
      fireEvent.press(confirmButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `http://localhost:3000/api/events/${mockEvent._id}/register`,
          expect.objectContaining({
            method: 'DELETE'
          })
        );
      });
    });

    it('should handle share event', () => {
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      waitFor(() => {
        const shareButton = getByTestId('share-event-button');
        fireEvent.press(shareButton);

        // Should show share modal
        expect(getByTestId('share-modal')).toBeTruthy();
      });
    });

    it('should handle view location on map', async () => {
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        const locationButton = getByTestId('view-location-button');
        fireEvent.press(locationButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Map', {
          location: mockEvent.location
        });
      });
    });

    it('should show organizer actions for event owner', async () => {
      const ownEvent = {
        ...mockEvent,
        isOwner: true
      };
      ApiMockUtils.mockSuccessResponse(ownEvent);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('edit-event-button')).toBeTruthy();
        expect(getByTestId('view-participants-button')).toBeTruthy();
        expect(getByTestId('cancel-event-button')).toBeTruthy();
      });
    });

    it('should handle participants list', async () => {
      const eventWithParticipants = {
        ...mockEvent,
        participants: [
          { _id: '1', name: 'John Doe', avatar: null },
          { _id: '2', name: 'Jane Smith', avatar: null }
        ]
      };
      ApiMockUtils.mockSuccessResponse(eventWithParticipants);

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        expect(getByTestId('participants-list')).toBeTruthy();
        expect(getByTestId('participant-1')).toBeTruthy();
        expect(getByTestId('participant-2')).toBeTruthy();
      });
    });
  });

  describe('EventFormScreen', () => {
    it('should render create event form', () => {
      const { getByTestId, getByText } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('event-form-screen')).toBeTruthy();
      expect(getByText('Create Event')).toBeTruthy();
      expect(getByTestId('event-title-input')).toBeTruthy();
      expect(getByTestId('event-description-input')).toBeTruthy();
      expect(getByTestId('sport-picker')).toBeTruthy();
      expect(getByTestId('event-submit-button')).toBeTruthy();
    });

    it('should validate required fields', async () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      const submitButton = getByTestId('event-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('event-title-error')).toBeTruthy();
        expect(getByTestId('event-description-error')).toBeTruthy();
        expect(getByTestId('event-sport-error')).toBeTruthy();
        expect(getByTestId('event-location-error')).toBeTruthy();
      });
    });

    it('should handle sport selection', async () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      const sportPicker = getByTestId('sport-picker');
      fireEvent.press(sportPicker);

      await waitFor(() => {
        expect(getByTestId('sport-picker-modal')).toBeTruthy();
      });

      const cricketOption = getByTestId('sport-option-cricket');
      fireEvent.press(cricketOption);

      expect(getByTestId('selected-sport-cricket')).toBeTruthy();
    });

    it('should handle date and time selection', async () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      // Select date
      const datePickerButton = getByTestId('date-picker-button');
      fireEvent.press(datePickerButton);

      await waitFor(() => {
        expect(getByTestId('date-picker-modal')).toBeTruthy();
      });

      // Select start time
      const startTimePicker = getByTestId('start-time-picker');
      fireEvent.press(startTimePicker);

      await waitFor(() => {
        expect(getByTestId('time-picker-modal')).toBeTruthy();
      });
    });

    it('should handle location input', async () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      const locationInput = getByTestId('event-location-input');
      fireEvent.changeText(locationInput, 'Mumbai Cricket Ground');

      // Should show location suggestions
      await waitFor(() => {
        expect(getByTestId('location-suggestions')).toBeTruthy();
      });

      const firstSuggestion = getByTestId('location-suggestion-0');
      fireEvent.press(firstSuggestion);

      expect(locationInput.props.value).toBe('Mumbai Cricket Ground');
    });

    it('should handle image upload', async () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      const imagePickerButton = getByTestId('event-image-picker');
      fireEvent.press(imagePickerButton);

      await waitFor(() => {
        expect(getByTestId('image-picker-modal')).toBeTruthy();
      });

      // Select from gallery
      const galleryOption = getByTestId('gallery-option');
      fireEvent.press(galleryOption);

      // Should show image preview
      await waitFor(() => {
        expect(getByTestId('event-image-preview')).toBeTruthy();
      });
    });

    it('should create event successfully', async () => {
      ApiMockUtils.mockSuccessResponse({ 
        success: true, 
        data: { _id: 'new-event-id' } 
      });

      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      // Fill form
      fireEvent.changeText(getByTestId('event-title-input'), 'Test Event');
      fireEvent.changeText(getByTestId('event-description-input'), 'Test Description');
      fireEvent.changeText(getByTestId('event-location-input'), 'Test Location');

      // Select sport
      fireEvent.press(getByTestId('sport-picker'));
      await waitFor(() => {
        fireEvent.press(getByTestId('sport-option-cricket'));
      });

      // Submit form
      fireEvent.press(getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/events',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Test Event')
          })
        );
      });

      // Should navigate back with success
      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });

    it('should handle create event error', async () => {
      ApiMockUtils.mockErrorResponse('Validation failed', 400);
      jest.spyOn(Alert, 'alert');

      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      // Fill required fields
      fireEvent.changeText(getByTestId('event-title-input'), 'Test Event');
      fireEvent.changeText(getByTestId('event-description-input'), 'Test Description');

      fireEvent.press(getByTestId('event-submit-button'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Validation failed'
        );
      });
    });

    it('should handle edit event mode', () => {
      const editEvent = EventTestUtils.createMockEvent();
      const editRoute = NavigationTestUtils.createMockRoute({ 
        event: editEvent 
      });

      const { getByTestId, getByText } = render(
        <EventFormScreen navigation={mockNavigation} route={editRoute} />
      );

      expect(getByText('Edit Event')).toBeTruthy();
      expect(getByTestId('event-title-input')).toHaveProp('value', editEvent.title);
      expect(getByTestId('event-description-input')).toHaveProp('value', editEvent.description);
    });

    it('should handle form scrolling', () => {
      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      const scrollView = getByTestId('event-form-scroll');
      expect(scrollView).toBeTruthy();

      // Should scroll to bottom when focused on bottom fields
      const submitButton = getByTestId('event-submit-button');
      fireEvent(submitButton, 'focus');
    });

    it('should show loading state during submission', async () => {
      // Mock delayed response
      global.fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: {} })
          }), 1000)
        )
      );

      const { getByTestId } = render(
        <EventFormScreen navigation={mockNavigation} route={mockRoute} />
      );

      // Fill minimal required fields
      fireEvent.changeText(getByTestId('event-title-input'), 'Test Event');
      fireEvent.changeText(getByTestId('event-description-input'), 'Test Description');

      const submitButton = getByTestId('event-submit-button');
      fireEvent.press(submitButton);

      // Should show loading state
      expect(getByTestId('form-loading')).toBeTruthy();
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Event Component Interactions', () => {
    it('should handle long press on event item', async () => {
      const mockEvents = EventTestUtils.createMockEvents(1);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('event-item-0')).toBeTruthy();
      });

      const eventItem = getByTestId('event-item-0');
      fireEvent(eventItem, 'longPress');

      // Should show context menu
      await waitFor(() => {
        expect(getByTestId('event-context-menu')).toBeTruthy();
      });
    });

    it('should handle swipe actions on event item', async () => {
      const mockEvents = EventTestUtils.createMockEvents(1);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('event-item-0')).toBeTruthy();
      });

      const eventItem = getByTestId('event-item-0');
      
      // Swipe left to reveal actions
      fireEvent(eventItem, 'swipeLeft');

      await waitFor(() => {
        expect(getByTestId('quick-register-button')).toBeTruthy();
        expect(getByTestId('quick-share-button')).toBeTruthy();
      });
    });

    it('should handle event favoriting', async () => {
      const mockEvent = EventTestUtils.createMockEvent();
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const mockRouteWithParams = NavigationTestUtils.createMockRoute({
        eventId: mockEvent._id
      });

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        const favoriteButton = getByTestId('favorite-event-button');
        fireEvent.press(favoriteButton);

        expect(getByTestId('favorite-event-active')).toBeTruthy();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should implement proper list virtualization', async () => {
      const mockEvents = EventTestUtils.createMockEvents(100);
      ApiMockUtils.mockPaginatedResponse(mockEvents);

      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const eventsList = getByTestId('events-list');
        expect(eventsList.props.removeClippedSubviews).toBe(true);
        expect(eventsList.props.maxToRenderPerBatch).toBeLessThanOrEqual(10);
      });
    });

    it('should implement image lazy loading', async () => {
      const mockEvent = EventTestUtils.createMockEvent({
        image: 'https://example.com/event-image.jpg'
      });
      ApiMockUtils.mockSuccessResponse(mockEvent);

      const mockRouteWithParams = NavigationTestUtils.createMockRoute({
        eventId: mockEvent._id
      });

      const { getByTestId } = render(
        <EventDetailsScreen navigation={mockNavigation} route={mockRouteWithParams} />
      );

      await waitFor(() => {
        const eventImage = getByTestId('event-image');
        expect(eventImage.props.loadingIndicatorSource).toBeDefined();
      });
    });

    it('should debounce search input', async () => {
      jest.useFakeTimers();
      
      const { getByTestId } = render(
        <EventsScreen navigation={mockNavigation} route={mockRoute} />
      );

      const searchInput = getByTestId('events-search-input');
      
      // Type multiple characters quickly
      fireEvent.changeText(searchInput, 'C');
      fireEvent.changeText(searchInput, 'Cr');
      fireEvent.changeText(searchInput, 'Cri');
      fireEvent.changeText(searchInput, 'Cricket');

      // Fast forward time
      jest.advanceTimersByTime(1000);

      // Should only trigger one search
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      jest.useRealTimers();
    });
  });
});
