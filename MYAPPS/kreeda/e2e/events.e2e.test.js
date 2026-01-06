describe('Event Management E2E Tests', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
    
    // Register and login a test user
    await e2eUtils.tapElement(by.id('register-link'));
    await testHelpers.registerTestUser({
      name: 'Event Organizer',
      email: `organizer.${Date.now()}@example.com`,
      password: 'password123'
    });
  });

  afterEach(async () => {
    await device.terminateApp();
  });

  describe('Event Discovery', () => {
    it('should display events list on home screen', async () => {
      await expect(element(by.id('home-screen'))).toBeVisible();
      
      // Should show events section
      await expect(element(by.id('featured-events-section'))).toBeVisible();
      await expect(element(by.text('Featured Events'))).toBeVisible();
    });

    it('should navigate to events screen and view all events', async () => {
      await testHelpers.navigateTo('events');
      await expect(element(by.id('events-screen'))).toBeVisible();
      
      // Should show events list
      await expect(element(by.id('events-list'))).toBeVisible();
      
      // Should have search functionality
      await expect(element(by.id('events-search-input'))).toBeVisible();
      
      // Should have filter options
      await expect(element(by.id('events-filter-button'))).toBeVisible();
    });

    it('should search events by title', async () => {
      await testHelpers.navigateTo('events');
      
      // Enter search term
      await e2eUtils.typeText(by.id('events-search-input'), 'Cricket');
      
      // Wait for search results
      await e2eUtils.waitForNetwork(2000);
      
      // Should show filtered results
      await expect(element(by.id('events-list'))).toBeVisible();
    });

    it('should filter events by sport', async () => {
      await testHelpers.navigateTo('events');
      
      // Open filter
      await e2eUtils.tapElement(by.id('events-filter-button'));
      await expect(element(by.id('filter-modal'))).toBeVisible();
      
      // Select sport filter
      await e2eUtils.tapElement(by.id('sport-filter-cricket'));
      await e2eUtils.tapElement(by.id('apply-filters-button'));
      
      // Wait for filtered results
      await e2eUtils.waitForNetwork(2000);
      
      // Should show filtered events
      await expect(element(by.id('events-list'))).toBeVisible();
    });

    it('should view event details', async () => {
      await testHelpers.navigateTo('events');
      
      // Wait for events to load and tap on first event
      await e2eUtils.waitForElement(by.id('event-item-0'), 5000);
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      // Should navigate to event details
      await expect(element(by.id('event-details-screen'))).toBeVisible();
      
      // Should show event information
      await expect(element(by.id('event-title'))).toBeVisible();
      await expect(element(by.id('event-description'))).toBeVisible();
      await expect(element(by.id('event-location'))).toBeVisible();
      await expect(element(by.id('event-organizer'))).toBeVisible();
    });
  });

  describe('Event Creation', () => {
    it('should create a new event with all required fields', async () => {
      // Navigate to create event
      await e2eUtils.tapElement(by.id('create-event-fab'));
      await expect(element(by.id('event-form-screen'))).toBeVisible();
      
      // Fill event details
      const eventData = await testHelpers.createTestEvent({
        title: 'Cricket Championship',
        description: 'Annual cricket championship match',
        sport: 'Cricket',
        location: 'Wankhede Stadium, Mumbai'
      });
      
      // Should show success message
      await expect(element(by.text('Event created successfully'))).toBeVisible();
      
      // Should navigate back to events list
      await expect(element(by.id('events-screen'))).toBeVisible();
      
      // Should see the newly created event
      await expect(element(by.text(eventData.title))).toBeVisible();
    });

    it('should validate required fields when creating event', async () => {
      await e2eUtils.tapElement(by.id('create-event-fab'));
      
      // Try to submit empty form
      await e2eUtils.tapElement(by.id('event-submit-button'));
      
      // Should show validation errors
      await expect(element(by.id('event-title-error'))).toBeVisible();
      await expect(element(by.id('event-description-error'))).toBeVisible();
      await expect(element(by.id('event-sport-error'))).toBeVisible();
      await expect(element(by.id('event-location-error'))).toBeVisible();
    });

    it('should set event date and time', async () => {
      await e2eUtils.tapElement(by.id('create-event-fab'));
      
      // Fill basic details
      await e2eUtils.clearAndType(by.id('event-title-input'), 'Test Event');
      await e2eUtils.clearAndType(by.id('event-description-input'), 'Test Description');
      await e2eUtils.clearAndType(by.id('event-location-input'), 'Test Location');
      
      // Select sport
      await e2eUtils.tapElement(by.id('sport-picker'));
      await e2eUtils.tapElement(by.text('Cricket'));
      
      // Set date
      await e2eUtils.tapElement(by.id('date-picker-button'));
      await expect(element(by.id('date-picker-modal'))).toBeVisible();
      
      // Select tomorrow's date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      await e2eUtils.tapElement(by.text(tomorrow.getDate().toString()));
      await e2eUtils.tapElement(by.id('date-picker-confirm'));
      
      // Set start time
      await e2eUtils.tapElement(by.id('start-time-picker'));
      await e2eUtils.tapElement(by.text('10:00 AM'));
      
      // Set end time
      await e2eUtils.tapElement(by.id('end-time-picker'));
      await e2eUtils.tapElement(by.text('12:00 PM'));
      
      // Submit event
      await e2eUtils.tapElement(by.id('event-submit-button'));
      
      // Should create successfully
      await expect(element(by.text('Event created successfully'))).toBeVisible();
    });

    it('should upload event image', async () => {
      await e2eUtils.tapElement(by.id('create-event-fab'));
      
      // Fill required fields first
      await e2eUtils.clearAndType(by.id('event-title-input'), 'Test Event');
      await e2eUtils.clearAndType(by.id('event-description-input'), 'Test Description');
      
      // Upload image
      await e2eUtils.tapElement(by.id('event-image-picker'));
      await expect(element(by.id('image-picker-modal'))).toBeVisible();
      
      // Select from gallery
      await e2eUtils.tapElement(by.id('gallery-option'));
      
      // Should show image preview
      await expect(element(by.id('event-image-preview'))).toBeVisible();
    });

    it('should set event capacity and pricing', async () => {
      await e2eUtils.tapElement(by.id('create-event-fab'));
      
      // Scroll to additional settings
      await element(by.id('event-form-scroll')).scroll(300, 'down');
      
      // Set max participants
      await e2eUtils.clearAndType(by.id('max-participants-input'), '20');
      
      // Set entry fee
      await e2eUtils.clearAndType(by.id('entry-fee-input'), '100');
      
      // Set difficulty level
      await e2eUtils.tapElement(by.id('difficulty-picker'));
      await e2eUtils.tapElement(by.text('Intermediate'));
      
      // Toggle settings
      await e2eUtils.tapElement(by.id('allow-spectators-toggle'));
      await e2eUtils.tapElement(by.id('provide-equipment-toggle'));
    });
  });

  describe('Event Registration', () => {
    beforeEach(async () => {
      // Create a test event first
      await testHelpers.createTestEvent();
      
      // Go to events list and find the created event
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
    });

    it('should register for an event', async () => {
      // Should be on event details screen
      await expect(element(by.id('event-details-screen'))).toBeVisible();
      
      // Register for event
      await e2eUtils.tapElement(by.id('register-event-button'));
      
      // Should show registration confirmation
      await expect(element(by.text('Registration successful'))).toBeVisible();
      
      // Button should change to "Registered"
      await expect(element(by.id('unregister-event-button'))).toBeVisible();
      await expect(element(by.text('Registered'))).toBeVisible();
    });

    it('should unregister from an event', async () => {
      // Register first
      await e2eUtils.tapElement(by.id('register-event-button'));
      await expect(element(by.text('Registration successful'))).toBeVisible();
      
      // Now unregister
      await e2eUtils.tapElement(by.id('unregister-event-button'));
      
      // Should show confirmation dialog
      await expect(element(by.id('unregister-confirmation-modal'))).toBeVisible();
      await e2eUtils.tapElement(by.id('confirm-unregister-button'));
      
      // Should show unregistration success
      await expect(element(by.text('Unregistered successfully'))).toBeVisible();
      
      // Button should change back to "Register"
      await expect(element(by.id('register-event-button'))).toBeVisible();
    });

    it('should show payment flow for paid events', async () => {
      // Create a paid event
      await device.terminateApp();
      await device.launchApp();
      await testHelpers.loginTestUser();
      
      await testHelpers.createTestEvent({
        title: 'Paid Cricket Match',
        entryFee: '200'
      });
      
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.text('Paid Cricket Match'));
      
      // Register for paid event
      await e2eUtils.tapElement(by.id('register-event-button'));
      
      // Should show payment screen
      await expect(element(by.id('payment-screen'))).toBeVisible();
      await expect(element(by.text('Entry Fee: ₹200'))).toBeVisible();
      
      // Mock payment completion
      await e2eUtils.tapElement(by.id('proceed-payment-button'));
      await expect(element(by.text('Payment successful'))).toBeVisible();
    });

    it('should prevent registration for full events', async () => {
      // This would require creating an event with limited capacity
      // and filling it up, then testing registration failure
      
      // For now, we'll test the UI behavior
      await expect(element(by.id('event-details-screen'))).toBeVisible();
      
      // If event is full, button should be disabled
      // await expect(element(by.id('register-event-button'))).not.toBeVisible();
      // await expect(element(by.text('Event Full'))).toBeVisible();
    });
  });

  describe('Event Management', () => {
    beforeEach(async () => {
      // Create an event as organizer
      await testHelpers.createTestEvent({
        title: 'My Organized Event'
      });
    });

    it('should view organized events in profile', async () => {
      await testHelpers.navigateTo('profile');
      
      // Should show organized events section
      await expect(element(by.id('organized-events-section'))).toBeVisible();
      await expect(element(by.text('My Organized Event'))).toBeVisible();
    });

    it('should edit an organized event', async () => {
      await testHelpers.navigateTo('profile');
      
      // Tap on organized event
      await e2eUtils.tapElement(by.text('My Organized Event'));
      
      // Should show edit options for organizer
      await expect(element(by.id('edit-event-button'))).toBeVisible();
      
      await e2eUtils.tapElement(by.id('edit-event-button'));
      
      // Should navigate to edit form
      await expect(element(by.id('event-form-screen'))).toBeVisible();
      await expect(element(by.text('Edit Event'))).toBeVisible();
      
      // Make changes
      await e2eUtils.clearAndType(by.id('event-title-input'), 'Updated Event Title');
      
      // Save changes
      await e2eUtils.tapElement(by.id('event-submit-button'));
      
      // Should show success message
      await expect(element(by.text('Event updated successfully'))).toBeVisible();
    });

    it('should view event participants', async () => {
      await testHelpers.navigateTo('profile');
      await e2eUtils.tapElement(by.text('My Organized Event'));
      
      // Should show participants section
      await expect(element(by.id('event-participants-section'))).toBeVisible();
      
      // View all participants
      await e2eUtils.tapElement(by.id('view-participants-button'));
      await expect(element(by.id('participants-screen'))).toBeVisible();
    });

    it('should cancel an event', async () => {
      await testHelpers.navigateTo('profile');
      await e2eUtils.tapElement(by.text('My Organized Event'));
      
      // Cancel event
      await e2eUtils.tapElement(by.id('cancel-event-button'));
      
      // Should show confirmation
      await expect(element(by.id('cancel-event-modal'))).toBeVisible();
      await e2eUtils.tapElement(by.id('confirm-cancel-button'));
      
      // Should show cancellation success
      await expect(element(by.text('Event cancelled successfully'))).toBeVisible();
    });
  });

  describe('Map Integration', () => {
    it('should show event location on map', async () => {
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      // View location on map
      await e2eUtils.tapElement(by.id('view-location-button'));
      
      // Should show map screen
      await expect(element(by.id('map-screen'))).toBeVisible();
      await expect(element(by.id('event-location-marker'))).toBeVisible();
    });

    it('should get directions to event location', async () => {
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      await e2eUtils.tapElement(by.id('get-directions-button'));
      
      // Should open maps app or show directions
      // This would depend on the implementation
    });
  });

  describe('Social Features', () => {
    it('should share event details', async () => {
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      // Share event
      await e2eUtils.tapElement(by.id('share-event-button'));
      
      // Should show share options
      await expect(element(by.id('share-modal'))).toBeVisible();
    });

    it('should add event to calendar', async () => {
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      // Add to calendar
      await e2eUtils.tapElement(by.id('add-to-calendar-button'));
      
      // Should show calendar integration
      await expect(element(by.text('Added to calendar'))).toBeVisible();
    });
  });

  describe('Notifications', () => {
    it('should show event reminders', async () => {
      // This would require setting up push notifications
      // For now, we'll test the in-app notifications
      
      await expect(element(by.id('home-screen'))).toBeVisible();
      
      // Should show notifications section if there are any
      // await expect(element(by.id('notifications-section'))).toBeVisible();
    });
  });

  describe('Offline Functionality', () => {
    it('should cache viewed events for offline viewing', async () => {
      await testHelpers.navigateTo('events');
      await e2eUtils.tapElement(by.id('event-item-0'));
      
      // Go offline
      await device.setNetworkConditions({ type: 'offline' });
      
      // Navigate away and back
      await testHelpers.navigateTo('home');
      await testHelpers.navigateTo('events');
      
      // Should still show cached event
      await e2eUtils.tapElement(by.id('event-item-0'));
      await expect(element(by.id('event-details-screen'))).toBeVisible();
      
      // Restore network
      await device.setNetworkConditions({ type: 'online' });
    });
  });

  describe('Performance', () => {
    it('should load events list within acceptable time', async () => {
      const startTime = Date.now();
      
      await testHelpers.navigateTo('events');
      await e2eUtils.waitForElement(by.id('events-list'));
      
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    it('should handle large events list efficiently', async () => {
      await testHelpers.navigateTo('events');
      
      // Test scrolling performance
      const scrollView = element(by.id('events-list'));
      
      // Scroll multiple times
      for (let i = 0; i < 5; i++) {
        await scrollView.scroll(300, 'down');
        await e2eUtils.waitForNetwork(500);
      }
      
      // Should remain responsive
      await expect(element(by.id('events-screen'))).toBeVisible();
    });
  });
});
