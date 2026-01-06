import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ProfileScreen from '../../src/screens/ProfileScreen';
import EditProfileScreen from '../../src/screens/EditProfileScreen';
import AchievementsScreen from '../../src/screens/AchievementsScreen';
import HomeScreen from '../../src/screens/HomeScreen';
import {
  ApiMockUtils,
  NavigationTestUtils,
  UserTestUtils,
  StateTestUtils,
  PermissionTestUtils,
  EventTestUtils
} from '../utils/testUtils';

// Mock navigation
const mockNavigation = NavigationTestUtils.createMockNavigation();
const mockRoute = NavigationTestUtils.createMockRoute();

describe('Profile Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiMockUtils.clearMocks();
    PermissionTestUtils.mockGrantedPermissions();
  });

  describe('ProfileScreen', () => {
    const mockUser = UserTestUtils.createMockUser();

    it('should render profile screen correctly', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId, getByText } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
        expect(getByText(mockUser.name)).toBeTruthy();
        expect(getByText(mockUser.email)).toBeTruthy();
        expect(getByTestId('profile-avatar')).toBeTruthy();
      });
    });

    it('should display user statistics', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId, getByText } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('user-level')).toBeTruthy();
        expect(getByTestId('user-xp')).toBeTruthy();
        expect(getByTestId('events-played-stat')).toBeTruthy();
        expect(getByTestId('events-organized-stat')).toBeTruthy();
        expect(getByText(`Level ${mockUser.level}`)).toBeTruthy();
      });
    });

    it('should display sports interests', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('sports-interests-section')).toBeTruthy();
        mockUser.sportsInterests.forEach((sport, index) => {
          expect(getByTestId(`sport-interest-${index}`)).toBeTruthy();
        });
      });
    });

    it('should display recent achievements', async () => {
      const userWithAchievements = {
        ...mockUser,
        achievements: [
          { _id: '1', title: 'First Event', description: 'Attended first event', unlockedAt: new Date() },
          { _id: '2', title: 'Team Player', description: 'Registered for team event', unlockedAt: new Date() }
        ]
      };
      ApiMockUtils.mockSuccessResponse(userWithAchievements);

      const { getByTestId, getByText } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('achievements-section')).toBeTruthy();
        expect(getByText('First Event')).toBeTruthy();
        expect(getByText('Team Player')).toBeTruthy();
      });
    });

    it('should navigate to edit profile', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const editButton = getByTestId('edit-profile-button');
        fireEvent.press(editButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('EditProfile');
      });
    });

    it('should navigate to achievements screen', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const achievementsButton = getByTestId('view-achievements-button');
        fireEvent.press(achievementsButton);

        expect(mockNavigation.navigate).toHaveBeenCalledWith('Achievements');
      });
    });

    it('should display organized events', async () => {
      const mockEvents = EventTestUtils.createMockEvents(2);
      const userWithEvents = {
        ...mockUser,
        organizedEvents: mockEvents.map(e => e._id)
      };
      
      ApiMockUtils.mockSuccessResponse(userWithEvents);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('organized-events-section')).toBeTruthy();
      });
    });

    it('should display registered events', async () => {
      const mockEvents = EventTestUtils.createMockEvents(3);
      const userWithEvents = {
        ...mockUser,
        registeredEvents: mockEvents.map(e => e._id)
      };
      
      ApiMockUtils.mockSuccessResponse(userWithEvents);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('registered-events-section')).toBeTruthy();
      });
    });

    it('should handle logout functionality', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);
      jest.spyOn(Alert, 'alert');

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const logoutButton = getByTestId('logout-button');
        fireEvent.press(logoutButton);

        expect(Alert.alert).toHaveBeenCalledWith(
          'Logout',
          'Are you sure you want to logout?',
          expect.any(Array)
        );
      });
    });

    it('should show loading state', () => {
      // Mock delayed response
      global.fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: mockUser })
          }), 1000)
        )
      );

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('profile-loading')).toBeTruthy();
    });

    it('should handle error state', async () => {
      ApiMockUtils.mockNetworkError();

      const { getByTestId, getByText } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('profile-error-state')).toBeTruthy();
        expect(getByText('Failed to load profile')).toBeTruthy();
      });
    });
  });

  describe('EditProfileScreen', () => {
    const mockUser = UserTestUtils.createMockUser();

    it('should render edit profile form', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId, getByText } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('edit-profile-screen')).toBeTruthy();
        expect(getByText('Edit Profile')).toBeTruthy();
        expect(getByTestId('edit-name-input')).toBeTruthy();
        expect(getByTestId('edit-email-input')).toBeTruthy();
        expect(getByTestId('edit-bio-input')).toBeTruthy();
      });
    });

    it('should populate form with current user data', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('edit-name-input')).toHaveProp('value', mockUser.name);
        expect(getByTestId('edit-email-input')).toHaveProp('value', mockUser.email);
        expect(getByTestId('edit-bio-input')).toHaveProp('value', mockUser.bio);
      });
    });

    it('should handle avatar upload', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const avatarButton = getByTestId('edit-avatar-button');
        fireEvent.press(avatarButton);

        expect(getByTestId('avatar-picker-modal')).toBeTruthy();
      });

      // Select camera option
      const cameraOption = getByTestId('camera-option');
      fireEvent.press(cameraOption);

      // Should show avatar preview
      await waitFor(() => {
        expect(getByTestId('avatar-preview')).toBeTruthy();
      });
    });

    it('should handle sports interests selection', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const sportsSelector = getByTestId('sports-interests-selector');
        fireEvent.press(sportsSelector);

        expect(getByTestId('sports-selection-modal')).toBeTruthy();
      });

      // Select new sport
      const footballOption = getByTestId('sport-option-football');
      fireEvent.press(footballOption);

      expect(getByTestId('selected-sport-football')).toBeTruthy();
    });

    it('should validate form fields', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        // Clear required fields
        fireEvent.changeText(getByTestId('edit-name-input'), '');
        fireEvent.changeText(getByTestId('edit-email-input'), '');

        const saveButton = getByTestId('save-profile-button');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(getByTestId('edit-name-error')).toBeTruthy();
        expect(getByTestId('edit-email-error')).toBeTruthy();
      });
    });

    it('should save profile changes', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        // Make changes
        fireEvent.changeText(getByTestId('edit-name-input'), 'Updated Name');
        fireEvent.changeText(getByTestId('edit-bio-input'), 'Updated bio');

        // Mock successful update
        ApiMockUtils.mockSuccessResponse({ ...mockUser, name: 'Updated Name' });

        const saveButton = getByTestId('save-profile-button');
        fireEvent.press(saveButton);
      });

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/users/profile',
          expect.objectContaining({
            method: 'PUT',
            body: expect.stringContaining('Updated Name')
          })
        );
      });

      // Should navigate back
      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });

    it('should handle privacy settings', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('privacy-settings-section')).toBeTruthy();
        expect(getByTestId('public-profile-toggle')).toBeTruthy();
        expect(getByTestId('show-email-toggle')).toBeTruthy();
      });

      // Toggle privacy setting
      const publicProfileToggle = getByTestId('public-profile-toggle');
      fireEvent.press(publicProfileToggle);

      expect(publicProfileToggle.props.value).toBe(!mockUser.preferences.publicProfile);
    });

    it('should handle notification preferences', async () => {
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <EditProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('notification-settings-section')).toBeTruthy();
        expect(getByTestId('push-notifications-toggle')).toBeTruthy();
        expect(getByTestId('email-notifications-toggle')).toBeTruthy();
      });
    });
  });

  describe('AchievementsScreen', () => {
    const mockAchievements = [
      { _id: '1', title: 'First Event', description: 'Attended first event', rarity: 'common', unlockedAt: new Date() },
      { _id: '2', title: 'Team Player', description: 'Registered for team event', rarity: 'rare', unlockedAt: new Date() },
      { _id: '3', title: 'Marathon Master', description: 'Completed 10 events', rarity: 'epic', unlockedAt: null }
    ];

    it('should render achievements screen correctly', async () => {
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId, getByText } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('achievements-screen')).toBeTruthy();
        expect(getByText('Achievements')).toBeTruthy();
        expect(getByTestId('achievements-list')).toBeTruthy();
      });
    });

    it('should display achievement categories', async () => {
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('achievements-filter')).toBeTruthy();
        expect(getByTestId('filter-all')).toBeTruthy();
        expect(getByTestId('filter-unlocked')).toBeTruthy();
        expect(getByTestId('filter-locked')).toBeTruthy();
      });
    });

    it('should filter achievements by status', async () => {
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId, getAllByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        // Filter by unlocked
        const unlockedFilter = getByTestId('filter-unlocked');
        fireEvent.press(unlockedFilter);

        const achievementItems = getAllByTestId(/achievement-item-/);
        // Should only show unlocked achievements
        expect(achievementItems.length).toBeLessThan(mockAchievements.length);
      });
    });

    it('should display achievement progress', async () => {
      const achievementWithProgress = {
        ...mockAchievements[0],
        progress: { current: 5, total: 10 }
      };
      ApiMockUtils.mockSuccessResponse([achievementWithProgress]);

      const { getByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('achievement-progress-0')).toBeTruthy();
        expect(getByTestId('progress-bar-0')).toBeTruthy();
      });
    });

    it('should handle achievement sharing', async () => {
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const firstAchievement = getByTestId('achievement-item-0');
        fireEvent.press(firstAchievement);

        expect(getByTestId('achievement-detail-modal')).toBeTruthy();
        expect(getByTestId('share-achievement-button')).toBeTruthy();
      });
    });

    it('should display achievement statistics', async () => {
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('achievements-stats')).toBeTruthy();
        expect(getByTestId('total-achievements-stat')).toBeTruthy();
        expect(getByTestId('unlocked-achievements-stat')).toBeTruthy();
        expect(getByTestId('completion-percentage')).toBeTruthy();
      });
    });
  });

  describe('HomeScreen', () => {
    const mockUser = UserTestUtils.createMockUser();
    const mockEvents = EventTestUtils.createMockEvents(3);

    it('should render home screen correctly', async () => {
      ApiMockUtils.mockSuccessResponse({ user: mockUser, events: mockEvents });

      const { getByTestId, getByText } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('home-screen')).toBeTruthy();
        expect(getByText(`Welcome back, ${mockUser.name}!`)).toBeTruthy();
        expect(getByTestId('dashboard-stats')).toBeTruthy();
      });
    });

    it('should display user dashboard stats', async () => {
      ApiMockUtils.mockSuccessResponse({ user: mockUser, events: mockEvents });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('level-progress')).toBeTruthy();
        expect(getByTestId('xp-display')).toBeTruthy();
        expect(getByTestId('upcoming-events-count')).toBeTruthy();
        expect(getByTestId('achievements-count')).toBeTruthy();
      });
    });

    it('should display featured events', async () => {
      ApiMockUtils.mockSuccessResponse({ user: mockUser, events: mockEvents });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('featured-events-section')).toBeTruthy();
        expect(getByTestId('featured-events-carousel')).toBeTruthy();
      });
    });

    it('should display trending sports', async () => {
      const trendingSports = ['Cricket', 'Football', 'Tennis'];
      ApiMockUtils.mockSuccessResponse({ 
        user: mockUser, 
        events: mockEvents,
        trendingSports 
      });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('trending-sports-section')).toBeTruthy();
        trendingSports.forEach((sport, index) => {
          expect(getByTestId(`trending-sport-${index}`)).toBeTruthy();
        });
      });
    });

    it('should display recent activity', async () => {
      const recentActivity = [
        { type: 'registered', event: 'Cricket Match', timestamp: new Date() },
        { type: 'achievement', title: 'First Event', timestamp: new Date() }
      ];
      ApiMockUtils.mockSuccessResponse({ 
        user: mockUser, 
        events: mockEvents,
        recentActivity 
      });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('recent-activity-section')).toBeTruthy();
        expect(getByTestId('activity-item-0')).toBeTruthy();
        expect(getByTestId('activity-item-1')).toBeTruthy();
      });
    });

    it('should handle quick actions', async () => {
      ApiMockUtils.mockSuccessResponse({ user: mockUser, events: mockEvents });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('quick-actions')).toBeTruthy();
        expect(getByTestId('quick-create-event')).toBeTruthy();
        expect(getByTestId('quick-find-events')).toBeTruthy();
        expect(getByTestId('quick-view-profile')).toBeTruthy();
      });

      // Test quick create event
      const createEventButton = getByTestId('quick-create-event');
      fireEvent.press(createEventButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('EventForm');
    });

    it('should display weather information', async () => {
      const weatherData = {
        temperature: 28,
        condition: 'Sunny',
        location: 'Mumbai'
      };
      ApiMockUtils.mockSuccessResponse({ 
        user: mockUser, 
        events: mockEvents,
        weather: weatherData 
      });

      const { getByTestId, getByText } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('weather-widget')).toBeTruthy();
        expect(getByText('28°C')).toBeTruthy();
        expect(getByText('Sunny')).toBeTruthy();
      });
    });

    it('should handle pull to refresh', async () => {
      ApiMockUtils.mockSuccessResponse({ user: mockUser, events: mockEvents });

      const { getByTestId } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const scrollView = getByTestId('home-scroll-view');
        fireEvent(scrollView, 'refresh');

        // Should refetch data
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    it('should show personalized recommendations', async () => {
      const recommendations = mockEvents.slice(0, 2);
      ApiMockUtils.mockSuccessResponse({ 
        user: mockUser, 
        events: mockEvents,
        recommendations 
      });

      const { getByTestId, getByText } = render(
        <HomeScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('recommendations-section')).toBeTruthy();
        expect(getByText('Recommended for you')).toBeTruthy();
      });
    });
  });

  describe('Component Accessibility', () => {
    it('should have proper accessibility labels for profile screen', async () => {
      const mockUser = UserTestUtils.createMockUser();
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('profile-avatar')).toHaveProp(
          'accessibilityLabel',
          'Profile avatar'
        );
        expect(getByTestId('edit-profile-button')).toHaveProp(
          'accessibilityLabel',
          'Edit profile'
        );
        expect(getByTestId('logout-button')).toHaveProp(
          'accessibilityLabel',
          'Logout'
        );
      });
    });

    it('should support screen reader navigation', async () => {
      const mockUser = UserTestUtils.createMockUser();
      ApiMockUtils.mockSuccessResponse(mockUser);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        expect(getByTestId('user-level')).toHaveProp(
          'accessibilityRole',
          'text'
        );
        expect(getByTestId('sports-interests-section')).toHaveProp(
          'accessibilityRole',
          'list'
        );
      });
    });
  });

  describe('Performance Optimizations', () => {
    it('should implement proper image caching for avatars', async () => {
      const userWithAvatar = {
        ...UserTestUtils.createMockUser(),
        avatar: 'https://example.com/avatar.jpg'
      };
      ApiMockUtils.mockSuccessResponse(userWithAvatar);

      const { getByTestId } = render(
        <ProfileScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const avatar = getByTestId('profile-avatar');
        expect(avatar.props.source.cache).toBe('force-cache');
      });
    });

    it('should implement lazy loading for achievement images', async () => {
      const mockAchievements = [
        { _id: '1', title: 'Test', image: 'https://example.com/badge.png' }
      ];
      ApiMockUtils.mockSuccessResponse(mockAchievements);

      const { getByTestId } = render(
        <AchievementsScreen navigation={mockNavigation} route={mockRoute} />
      );

      await waitFor(() => {
        const achievementImage = getByTestId('achievement-image-0');
        expect(achievementImage.props.loadingIndicatorSource).toBeDefined();
      });
    });
  });
});
