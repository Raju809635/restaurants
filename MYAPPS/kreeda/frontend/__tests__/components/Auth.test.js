import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import RegisterScreen from '../../src/screens/RegisterScreen';
import {
  ApiMockUtils,
  FormTestUtils,
  NavigationTestUtils,
  UserTestUtils,
  StateTestUtils
} from '../utils/testUtils';

// Mock navigation
const mockNavigation = NavigationTestUtils.createMockNavigation();
const mockRoute = NavigationTestUtils.createMockRoute();

describe('Authentication Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ApiMockUtils.clearMocks();
  });

  describe('LoginScreen', () => {
    it('should render login form correctly', () => {
      const { getByTestId, getByText } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('login-screen')).toBeTruthy();
      expect(getByTestId('login-email-input')).toBeTruthy();
      expect(getByTestId('login-password-input')).toBeTruthy();
      expect(getByTestId('login-submit-button')).toBeTruthy();
      expect(getByText('Welcome Back!')).toBeTruthy();
      expect(getByText('Sign in to continue')).toBeTruthy();
    });

    it('should validate empty form submission', async () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const submitButton = getByTestId('login-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('login-email-error')).toBeTruthy();
        expect(getByTestId('login-password-error')).toBeTruthy();
      });
    });

    it('should validate email format', async () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('login-email-error')).toBeTruthy();
      });
    });

    it('should handle successful login', async () => {
      const mockUser = UserTestUtils.createMockUser();
      const mockResponse = {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token'
        }
      };

      ApiMockUtils.mockSuccessResponse(mockResponse);

      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/login',
          expect.objectContaining({
            method: 'POST',
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              email: 'test@example.com',
              password: 'password123'
            })
          })
        );
      });

      // Should navigate to home screen on success
      await waitFor(() => {
        expect(mockNavigation.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: 'Main' }]
        });
      });
    });

    it('should handle login error', async () => {
      ApiMockUtils.mockErrorResponse('Invalid credentials', 401);
      jest.spyOn(Alert, 'alert');

      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Invalid credentials'
        );
      });
    });

    it('should toggle password visibility', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const passwordInput = getByTestId('login-password-input');
      const toggleButton = getByTestId('password-toggle-button');

      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);
      expect(getByTestId('password-hidden-icon')).toBeTruthy();

      // Toggle to show password
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(false);
      expect(getByTestId('password-visible-icon')).toBeTruthy();

      // Toggle back to hide password
      fireEvent.press(toggleButton);
      expect(passwordInput.props.secureTextEntry).toBe(true);
      expect(getByTestId('password-hidden-icon')).toBeTruthy();
    });

    it('should navigate to register screen', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const registerLink = getByTestId('register-link');
      fireEvent.press(registerLink);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
    });

    it('should handle network error', async () => {
      ApiMockUtils.mockNetworkError();
      jest.spyOn(Alert, 'alert');

      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Network error. Please check your connection.'
        );
      });
    });

    it('should show loading state during login', async () => {
      // Mock a delayed response
      global.fetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, data: {} })
          }), 1000)
        )
      );

      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      // Should show loading indicator
      expect(getByTestId('login-loading')).toBeTruthy();
      expect(submitButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('RegisterScreen', () => {
    it('should render registration form correctly', () => {
      const { getByTestId, getByText } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('register-screen')).toBeTruthy();
      expect(getByTestId('register-name-input')).toBeTruthy();
      expect(getByTestId('register-email-input')).toBeTruthy();
      expect(getByTestId('register-password-input')).toBeTruthy();
      expect(getByTestId('register-submit-button')).toBeTruthy();
      expect(getByText('Create Account')).toBeTruthy();
      expect(getByText('Join the sports community')).toBeTruthy();
    });

    it('should validate required fields', async () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const submitButton = getByTestId('register-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('register-name-error')).toBeTruthy();
        expect(getByTestId('register-email-error')).toBeTruthy();
        expect(getByTestId('register-password-error')).toBeTruthy();
      });
    });

    it('should validate password strength', async () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const passwordInput = getByTestId('register-password-input');
      const submitButton = getByTestId('register-submit-button');

      fireEvent.changeText(passwordInput, '123'); // Weak password
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('register-password-error')).toBeTruthy();
      });
    });

    it('should handle successful registration', async () => {
      const mockUser = UserTestUtils.createMockUser();
      const mockResponse = {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token'
        }
      };

      ApiMockUtils.mockSuccessResponse(mockResponse);

      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const nameInput = getByTestId('register-name-input');
      const emailInput = getByTestId('register-email-input');
      const passwordInput = getByTestId('register-password-input');
      const submitButton = getByTestId('register-submit-button');

      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(emailInput, 'john@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/auth/register',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              name: 'John Doe',
              email: 'john@example.com',
              password: 'password123'
            })
          })
        );
      });

      // Should navigate to home screen on success
      await waitFor(() => {
        expect(mockNavigation.reset).toHaveBeenCalledWith({
          index: 0,
          routes: [{ name: 'Main' }]
        });
      });
    });

    it('should handle registration error', async () => {
      ApiMockUtils.mockErrorResponse('Email already exists', 400);
      jest.spyOn(Alert, 'alert');

      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      FormTestUtils.fillForm(getByTestId, {
        'register-name-input': 'John Doe',
        'register-email-input': 'existing@example.com',
        'register-password-input': 'password123'
      });

      FormTestUtils.submitForm(getByTestId, 'register-submit-button');

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Email already exists'
        );
      });
    });

    it('should navigate to login screen', () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const loginLink = getByTestId('login-link');
      fireEvent.press(loginLink);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Login');
    });

    it('should show terms and conditions', () => {
      const { getByTestId, getByText } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByText(/By creating an account/)).toBeTruthy();
      expect(getByTestId('terms-link')).toBeTruthy();
      expect(getByTestId('privacy-link')).toBeTruthy();
    });

    it('should validate name length', async () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const nameInput = getByTestId('register-name-input');
      fireEvent.changeText(nameInput, 'A'); // Too short

      const submitButton = getByTestId('register-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        expect(getByTestId('register-name-error')).toBeTruthy();
      });
    });

    it('should show password strength indicator', () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const passwordInput = getByTestId('register-password-input');
      
      // Weak password
      fireEvent.changeText(passwordInput, '123');
      expect(getByTestId('password-strength-weak')).toBeTruthy();

      // Medium password
      fireEvent.changeText(passwordInput, 'password');
      expect(getByTestId('password-strength-medium')).toBeTruthy();

      // Strong password
      fireEvent.changeText(passwordInput, 'Password123!');
      expect(getByTestId('password-strength-strong')).toBeTruthy();
    });
  });

  describe('Form Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('login-email-input')).toHaveProp(
        'accessibilityLabel',
        'Email input field'
      );
      expect(getByTestId('login-password-input')).toHaveProp(
        'accessibilityLabel',
        'Password input field'
      );
      expect(getByTestId('login-submit-button')).toHaveProp(
        'accessibilityLabel',
        'Login button'
      );
    });

    it('should have proper accessibility roles', () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      expect(getByTestId('register-submit-button')).toHaveProp(
        'accessibilityRole',
        'button'
      );
      expect(getByTestId('register-name-input')).toHaveProp(
        'accessibilityRole',
        'text'
      );
    });

    it('should announce form errors to screen readers', async () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const submitButton = getByTestId('login-submit-button');
      fireEvent.press(submitButton);

      await waitFor(() => {
        const errorElement = getByTestId('login-email-error');
        expect(errorElement).toHaveProp('accessibilityLiveRegion', 'polite');
      });
    });
  });

  describe('Form State Management', () => {
    it('should persist form data during component re-renders', () => {
      const { getByTestId, rerender } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      // Re-render component
      rerender(<LoginScreen navigation={mockNavigation} route={mockRoute} />);

      expect(getByTestId('login-email-input')).toHaveProp('value', 'test@example.com');
    });

    it('should clear form when switching between screens', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      // Navigate to register screen
      const registerLink = getByTestId('register-link');
      fireEvent.press(registerLink);

      // Navigate back to login
      const { getByTestId: getByTestIdRegister } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );
      
      const loginLink = getByTestIdRegister('login-link');
      fireEvent.press(loginLink);

      // Form should be cleared
      expect(getByTestId('login-email-input')).toHaveProp('value', '');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button presses', async () => {
      ApiMockUtils.mockSuccessResponse({ success: true, data: {} });

      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const submitButton = getByTestId('login-submit-button');
      
      // Rapidly press submit button
      fireEvent.press(submitButton);
      fireEvent.press(submitButton);
      fireEvent.press(submitButton);

      // Should only make one API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle very long input values', () => {
      const { getByTestId } = render(
        <RegisterScreen navigation={mockNavigation} route={mockRoute} />
      );

      const nameInput = getByTestId('register-name-input');
      const longName = 'A'.repeat(1000);

      fireEvent.changeText(nameInput, longName);

      // Should truncate or handle long input gracefully
      expect(nameInput.props.value.length).toBeLessThanOrEqual(100);
    });

    it('should handle special characters in input', () => {
      const { getByTestId } = render(
        <LoginScreen navigation={mockNavigation} route={mockRoute} />
      );

      const emailInput = getByTestId('login-email-input');
      const specialEmail = 'test+123@example-domain.co.uk';

      fireEvent.changeText(emailInput, specialEmail);
      expect(emailInput.props.value).toBe(specialEmail);
    });
  });
});
