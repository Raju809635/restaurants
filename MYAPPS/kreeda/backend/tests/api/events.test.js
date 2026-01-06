const request = require('supertest');
const app = require('../../app');
const Event = require('../../models/Event');
const { 
  AuthTestUtils, 
  EventTestUtils, 
  ResponseTestUtils,
  MockDataUtils 
} = require('../utils/testUtils');

describe('Events API', () => {
  let organizer;
  let organizerHeaders;
  let participant;
  let participantHeaders;

  beforeEach(async () => {
    organizer = await AuthTestUtils.createTestUser({
      name: 'Event Organizer',
      email: 'organizer@example.com'
    });
    organizerHeaders = AuthTestUtils.getAuthHeaders(organizer);

    participant = await AuthTestUtils.createTestUser({
      name: 'Event Participant',
      email: 'participant@example.com'
    });
    participantHeaders = AuthTestUtils.getAuthHeaders(participant);
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      // Create multiple test events
      await EventTestUtils.createMultipleEvents(5, {}, organizer);
    });

    it('should get all events successfully', async () => {
      const response = await request(app)
        .get('/api/events');

      ResponseTestUtils.validateSuccessResponse(response, 200);
      ResponseTestUtils.validatePaginationResponse(response);
      
      expect(response.body.data.items).toHaveLength(5);
      response.body.data.items.forEach(event => {
        ResponseTestUtils.validateEventObject(event);
      });
    });

    it('should filter events by sport', async () => {
      await EventTestUtils.createTestEvent({ sport: 'Football' }, organizer);
      
      const response = await request(app)
        .get('/api/events')
        .query({ sport: 'Football' });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.items.length).toBeGreaterThan(0);
      response.body.data.items.forEach(event => {
        expect(event.sport).toBe('Football');
      });
    });

    it('should filter events by difficulty', async () => {
      await EventTestUtils.createTestEvent({ difficulty: 'Advanced' }, organizer);
      
      const response = await request(app)
        .get('/api/events')
        .query({ difficulty: 'Advanced' });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      response.body.data.items.forEach(event => {
        expect(event.difficulty).toBe('Advanced');
      });
    });

    it('should filter events by date range', async () => {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 86400000);
      const dayAfter = new Date(today.getTime() + 172800000);

      await EventTestUtils.createTestEvent({ date: tomorrow }, organizer);
      
      const response = await request(app)
        .get('/api/events')
        .query({ 
          dateFrom: today.toISOString().split('T')[0],
          dateTo: dayAfter.toISOString().split('T')[0]
        });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.items.length).toBeGreaterThan(0);
    });

    it('should filter events by location', async () => {
      await EventTestUtils.createTestEvent({
        location: {
          name: 'Mumbai Cricket Ground',
          address: 'Mumbai, Maharashtra',
          latitude: 19.0760,
          longitude: 72.8777
        }
      }, organizer);
      
      const response = await request(app)
        .get('/api/events')
        .query({ location: 'Mumbai' });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      response.body.data.items.forEach(event => {
        expect(event.location.address).toContain('Mumbai');
      });
    });

    it('should search events by title', async () => {
      await EventTestUtils.createTestEvent({ title: 'Special Championship Match' }, organizer);
      
      const response = await request(app)
        .get('/api/events')
        .query({ search: 'Championship' });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.items.some(event => 
        event.title.includes('Championship')
      )).toBe(true);
    });

    it('should sort events by date', async () => {
      const response = await request(app)
        .get('/api/events')
        .query({ sortBy: 'date', sortOrder: 'asc' });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      
      const events = response.body.data.items;
      for (let i = 1; i < events.length; i++) {
        const prevDate = new Date(events[i - 1].date);
        const currDate = new Date(events[i].date);
        expect(currDate >= prevDate).toBe(true);
      }
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/events')
        .query({ page: 1, limit: 2 });

      ResponseTestUtils.validateSuccessResponse(response, 200);
      ResponseTestUtils.validatePaginationResponse(response);
      
      expect(response.body.data.items.length).toBeLessThanOrEqual(2);
      expect(response.body.data.pagination.currentPage).toBe(1);
    });

    it('should return only public events for unauthenticated users', async () => {
      // Create private event
      await EventTestUtils.createTestEvent({ isPublic: false }, organizer);
      
      const response = await request(app)
        .get('/api/events');

      ResponseTestUtils.validateSuccessResponse(response, 200);
      response.body.data.items.forEach(event => {
        expect(event.isPublic).toBe(true);
      });
    });
  });

  describe('GET /api/events/:id', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await EventTestUtils.createTestEvent({}, organizer);
    });

    it('should get single event successfully', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent._id}`);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      ResponseTestUtils.validateEventObject(response.body.data);
      expect(response.body.data._id).toBe(testEvent._id.toString());
      expect(response.body.data.title).toBe(testEvent.title);
    });

    it('should return 404 for non-existent event', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/events/${fakeId}`);

      ResponseTestUtils.validateErrorResponse(response, 404);
      expect(response.body.message).toContain('Event not found');
    });

    it('should return 400 for invalid event ID', async () => {
      const response = await request(app)
        .get('/api/events/invalid-id');

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('Invalid event ID');
    });

    it('should include organizer details', async () => {
      const response = await request(app)
        .get(`/api/events/${testEvent._id}`);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.organizer).toHaveProperty('_id');
      expect(response.body.data.organizer).toHaveProperty('name');
      expect(response.body.data.organizer.name).toBe(organizer.name);
    });

    it('should include participant count', async () => {
      // Register some participants
      await EventTestUtils.registerUserForEvent(testEvent, participant);
      
      const response = await request(app)
        .get(`/api/events/${testEvent._id}`);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.participants).toHaveLength(1);
      expect(response.body.data.participantCount).toBe(1);
    });
  });

  describe('POST /api/events', () => {
    let eventData;

    beforeEach(() => {
      eventData = testUtils.generateEventData();
      delete eventData.organizer; // Will be set from token
    });

    it('should create event successfully with valid data', async () => {
      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send(eventData);

      ResponseTestUtils.validateSuccessResponse(response, 201);
      ResponseTestUtils.validateEventObject(response.body.data);
      
      expect(response.body.data.title).toBe(eventData.title);
      expect(response.body.data.sport).toBe(eventData.sport);
      expect(response.body.data.organizer).toBe(organizer._id.toString());
      
      // Verify event was saved to database
      const savedEvent = await Event.findById(response.body.data._id);
      expect(savedEvent).toBeTruthy();
      expect(savedEvent.title).toBe(eventData.title);
    });

    it('should not create event without authentication', async () => {
      const response = await request(app)
        .post('/api/events')
        .send(eventData);

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('token');
    });

    it('should validate required fields', async () => {
      const requiredFields = ['title', 'description', 'sport', 'date', 'startTime', 'endTime', 'location'];
      
      for (const field of requiredFields) {
        const incompleteData = { ...eventData };
        delete incompleteData[field];

        const response = await request(app)
          .post('/api/events')
          .set(organizerHeaders)
          .send(incompleteData);

        ResponseTestUtils.validateErrorResponse(response, 400);
        expect(response.body.message).toContain(field);
      }
    });

    it('should validate date is in future', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      
      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send({ ...eventData, date: pastDate });

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('future');
    });

    it('should validate start time is before end time', async () => {
      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send({ 
          ...eventData, 
          startTime: '15:00',
          endTime: '10:00' // Earlier than start time
        });

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('time');
    });

    it('should validate maxParticipants is positive', async () => {
      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send({ ...eventData, maxParticipants: -5 });

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('participants');
    });

    it('should validate location coordinates', async () => {
      const invalidLocation = {
        ...eventData.location,
        latitude: 200, // Invalid latitude
        longitude: 400 // Invalid longitude
      };
      
      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send({ ...eventData, location: invalidLocation });

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toMatch(/(latitude|longitude)/i);
    });

    it('should set default values for optional fields', async () => {
      const minimalData = {
        title: 'Test Event',
        description: 'Test Description',
        sport: 'Cricket',
        date: new Date(Date.now() + 86400000),
        startTime: '10:00',
        endTime: '12:00',
        location: {
          name: 'Test Ground',
          address: 'Test Address',
          latitude: 19.0760,
          longitude: 72.8777
        }
      };

      const response = await request(app)
        .post('/api/events')
        .set(organizerHeaders)
        .send(minimalData);

      ResponseTestUtils.validateSuccessResponse(response, 201);
      
      const event = response.body.data;
      expect(event.status).toBe('upcoming');
      expect(event.isPublic).toBe(true);
      expect(event.allowSpectators).toBe(true);
      expect(event.provideEquipment).toBe(false);
      expect(event.entryFee).toBe(0);
      expect(event.difficulty).toBe('Beginner');
    });
  });

  describe('PUT /api/events/:id', () => {
    let testEvent;
    let updateData;

    beforeEach(async () => {
      testEvent = await EventTestUtils.createTestEvent({}, organizer);
      updateData = {
        title: 'Updated Event Title',
        description: 'Updated description',
        maxParticipants: 30
      };
    });

    it('should update event successfully by organizer', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent._id}`)
        .set(organizerHeaders)
        .send(updateData);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.maxParticipants).toBe(updateData.maxParticipants);

      // Verify database was updated
      const updatedEvent = await Event.findById(testEvent._id);
      expect(updatedEvent.title).toBe(updateData.title);
    });

    it('should not update event by non-organizer', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent._id}`)
        .set(participantHeaders)
        .send(updateData);

      ResponseTestUtils.validateErrorResponse(response, 403);
      expect(response.body.message).toContain('permission');
    });

    it('should not update event without authentication', async () => {
      const response = await request(app)
        .put(`/api/events/${testEvent._id}`)
        .send(updateData);

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('token');
    });

    it('should not update past events', async () => {
      const pastEvent = await EventTestUtils.createTestEvent({
        date: new Date(Date.now() - 86400000), // Yesterday
        status: 'completed'
      }, organizer);

      const response = await request(app)
        .put(`/api/events/${pastEvent._id}`)
        .set(organizerHeaders)
        .send(updateData);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('cannot be updated');
    });

    it('should not reduce maxParticipants below current participant count', async () => {
      // Register participants
      await EventTestUtils.registerUserForEvent(testEvent, participant);
      const anotherUser = await AuthTestUtils.createTestUser();
      await EventTestUtils.registerUserForEvent(testEvent, anotherUser);

      const response = await request(app)
        .put(`/api/events/${testEvent._id}`)
        .set(organizerHeaders)
        .send({ maxParticipants: 1 }); // Less than current participants

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('participants');
    });
  });

  describe('DELETE /api/events/:id', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await EventTestUtils.createTestEvent({}, organizer);
    });

    it('should delete event successfully by organizer', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEvent._id}`)
        .set(organizerHeaders);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.message).toContain('deleted');

      // Verify event was deleted from database
      const deletedEvent = await Event.findById(testEvent._id);
      expect(deletedEvent).toBeNull();
    });

    it('should not delete event by non-organizer', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEvent._id}`)
        .set(participantHeaders);

      ResponseTestUtils.validateErrorResponse(response, 403);
      expect(response.body.message).toContain('permission');
    });

    it('should not delete event with registered participants', async () => {
      await EventTestUtils.registerUserForEvent(testEvent, participant);

      const response = await request(app)
        .delete(`/api/events/${testEvent._id}`)
        .set(organizerHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('participants');
    });
  });

  describe('POST /api/events/:id/register', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await EventTestUtils.createTestEvent({}, organizer);
    });

    it('should register for event successfully', async () => {
      const response = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.message).toContain('registered');

      // Verify registration in database
      const updatedEvent = await Event.findById(testEvent._id);
      expect(updatedEvent.participants).toContain(participant._id);
    });

    it('should not register without authentication', async () => {
      const response = await request(app)
        .post(`/api/events/${testEvent._id}/register`);

      ResponseTestUtils.validateErrorResponse(response, 401);
      expect(response.body.message).toContain('token');
    });

    it('should not register for own event', async () => {
      const response = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set(organizerHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('own event');
    });

    it('should not register twice for same event', async () => {
      // Register first time
      await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set(participantHeaders);

      // Try to register again
      const response = await request(app)
        .post(`/api/events/${testEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('already registered');
    });

    it('should not register for full event', async () => {
      const fullEvent = await EventTestUtils.createTestEvent({
        maxParticipants: 1
      }, organizer);

      // Fill the event
      const firstParticipant = await AuthTestUtils.createTestUser();
      await EventTestUtils.registerUserForEvent(fullEvent, firstParticipant);

      const response = await request(app)
        .post(`/api/events/${fullEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('full');
    });

    it('should not register for past event', async () => {
      const pastEvent = await EventTestUtils.createTestEvent({
        date: new Date(Date.now() - 86400000), // Yesterday
        status: 'completed'
      }, organizer);

      const response = await request(app)
        .post(`/api/events/${pastEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('past event');
    });
  });

  describe('DELETE /api/events/:id/register', () => {
    let testEvent;

    beforeEach(async () => {
      testEvent = await EventTestUtils.createTestEvent({}, organizer);
      await EventTestUtils.registerUserForEvent(testEvent, participant);
    });

    it('should unregister from event successfully', async () => {
      const response = await request(app)
        .delete(`/api/events/${testEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateSuccessResponse(response, 200);
      expect(response.body.message).toContain('unregistered');

      // Verify unregistration in database
      const updatedEvent = await Event.findById(testEvent._id);
      expect(updatedEvent.participants).not.toContain(participant._id);
    });

    it('should not unregister if not registered', async () => {
      const anotherUser = await AuthTestUtils.createTestUser();
      const anotherUserHeaders = AuthTestUtils.getAuthHeaders(anotherUser);

      const response = await request(app)
        .delete(`/api/events/${testEvent._id}/register`)
        .set(anotherUserHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('not registered');
    });

    it('should not unregister within 24 hours of event', async () => {
      const nearEvent = await EventTestUtils.createTestEvent({
        date: new Date(Date.now() + 3600000), // 1 hour from now
        startTime: '10:00'
      }, organizer);

      await EventTestUtils.registerUserForEvent(nearEvent, participant);

      const response = await request(app)
        .delete(`/api/events/${nearEvent._id}/register`)
        .set(participantHeaders);

      ResponseTestUtils.validateErrorResponse(response, 400);
      expect(response.body.message).toContain('24 hours');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent registrations gracefully', async () => {
      const limitedEvent = await EventTestUtils.createTestEvent({
        maxParticipants: 1
      }, organizer);

      const users = await AuthTestUtils.createMultipleUsers(3);
      
      // Attempt concurrent registrations
      const promises = users.map(user => {
        const headers = AuthTestUtils.getAuthHeaders(user);
        return request(app)
          .post(`/api/events/${limitedEvent._id}/register`)
          .set(headers);
      });

      const responses = await Promise.all(promises);
      
      // Only one should succeed
      const successCount = responses.filter(r => r.status === 200).length;
      const errorCount = responses.filter(r => r.status === 400).length;
      
      expect(successCount).toBe(1);
      expect(errorCount).toBe(2);
    });

    it('should handle database connection issues gracefully', async () => {
      // This test would require mocking mongoose connection issues
      // For now, we'll test that the API doesn't crash with valid requests
      const response = await request(app)
        .get('/api/events')
        .timeout(5000);

      expect(response.status).toBeLessThan(500);
    });
  });
});
