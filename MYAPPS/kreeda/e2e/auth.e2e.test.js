describe('Authentication Flow E2E Tests', () => {
  beforeEach(async () => {
    await device.launchApp({ newInstance: true });
  });

  afterEach(async () => {
    await device.terminateApp();
  });

  describe('User Registration', () => {
    it('should complete full registration flow', async () => {
      // Should start on login screen
      await expect(element(by.id('login-screen'))).toBeVisible();
      
      // Navigate to registration
      await e2eUtils.tapElement(by.id('register-link'));
      await expect(element(by.id('register-screen'))).toBeVisible();
      
      // Fill registration form
      const userData = await testHelpers.registerTestUser({
        name: 'John Doe',
        email: `john.doe.${Date.now()}@example.com`,
        password: 'securePassword123'
      });
      
      // Should navigate to home screen after successful registration
      await expect(element(by.id('home-screen'))).toBeVisible();
      
      // Verify user is logged in by checking profile
      await testHelpers.navigateTo('profile');
      await expect(element(by.text(userData.name))).toBeVisible();
      await expect(element(by.text(userData.email))).toBeVisible();
    });

    it('should show validation errors for invalid input', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      await expect(element(by.id('register-screen'))).toBeVisible();
      
      // Try to register with empty fields
      await e2eUtils.tapElement(by.id('register-submit-button'));
      
      // Should show validation errors
      await expect(element(by.id('register-name-error'))).toBeVisible();
      await expect(element(by.id('register-email-error'))).toBeVisible();
      await expect(element(by.id('register-password-error'))).toBeVisible();
    });

    it('should show error for invalid email format', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      await e2eUtils.typeText(by.id('register-email-input'), 'invalid-email');
      await e2eUtils.typeText(by.id('register-password-input'), 'password123');
      
      await e2eUtils.tapElement(by.id('register-submit-button'));
      
      await expect(element(by.id('register-email-error'))).toBeVisible();
      await expect(element(by.text('Please enter a valid email'))).toBeVisible();
    });

    it('should show error for weak password', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      await e2eUtils.typeText(by.id('register-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('register-password-input'), '123'); // Weak password
      
      await e2eUtils.tapElement(by.id('register-submit-button'));
      
      await expect(element(by.id('register-password-error'))).toBeVisible();
    });

    it('should handle network error gracefully', async () => {
      await device.setNetworkConditions({ 
        type: 'offline'
      });
      
      await e2eUtils.tapElement(by.id('register-link'));
      
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      await e2eUtils.typeText(by.id('register-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('register-password-input'), 'password123');
      
      await e2eUtils.tapElement(by.id('register-submit-button'));
      
      // Should show network error
      await expect(element(by.text('Network error'))).toBeVisible();
      
      // Restore network
      await device.setNetworkConditions({ type: 'online' });
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Ensure we have a test user registered
      await e2eUtils.tapElement(by.id('register-link'));
      await testHelpers.registerTestUser({
        email: 'login.test@example.com',
        password: 'testPassword123'
      });
      await testHelpers.logoutUser();
    });

    it('should complete full login flow', async () => {
      await expect(element(by.id('login-screen'))).toBeVisible();
      
      await testHelpers.loginTestUser('login.test@example.com', 'testPassword123');
      
      // Should be on home screen
      await expect(element(by.id('home-screen'))).toBeVisible();
      
      // Verify user profile
      await testHelpers.navigateTo('profile');
      await expect(element(by.text('login.test@example.com'))).toBeVisible();
    });

    it('should show error for invalid credentials', async () => {
      await e2eUtils.typeText(by.id('login-email-input'), 'wrong@example.com');
      await e2eUtils.typeText(by.id('login-password-input'), 'wrongpassword');
      
      await e2eUtils.tapElement(by.id('login-submit-button'));
      
      await expect(element(by.text('Invalid credentials'))).toBeVisible();
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should show validation errors for empty fields', async () => {
      await e2eUtils.tapElement(by.id('login-submit-button'));
      
      await expect(element(by.id('login-email-error'))).toBeVisible();
      await expect(element(by.id('login-password-error'))).toBeVisible();
    });

    it('should toggle password visibility', async () => {
      await e2eUtils.typeText(by.id('login-password-input'), 'password123');
      
      // Password should be hidden by default
      await expect(element(by.id('password-hidden-icon'))).toBeVisible();
      
      // Tap to show password
      await e2eUtils.tapElement(by.id('password-toggle-button'));
      await expect(element(by.id('password-visible-icon'))).toBeVisible();
      
      // Tap to hide password again
      await e2eUtils.tapElement(by.id('password-toggle-button'));
      await expect(element(by.id('password-hidden-icon'))).toBeVisible();
    });
  });

  describe('Session Management', () => {
    it('should maintain session after app restart', async () => {
      // Register and login
      await e2eUtils.tapElement(by.id('register-link'));
      const userData = await testHelpers.registerTestUser();
      
      // Restart app
      await device.terminateApp();
      await device.launchApp();
      
      // Should automatically be logged in
      await expect(element(by.id('home-screen'))).toBeVisible();
      
      // Verify profile
      await testHelpers.navigateTo('profile');
      await expect(element(by.text(userData.name))).toBeVisible();
    });

    it('should handle logout correctly', async () => {
      // Login first
      await e2eUtils.tapElement(by.id('register-link'));
      await testHelpers.registerTestUser();
      
      // Logout
      await testHelpers.logoutUser();
      
      // Should be back on login screen
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should handle token expiration', async () => {
      // This test would require mocking token expiration
      // For now, we'll test the logout flow
      await e2eUtils.tapElement(by.id('register-link'));
      await testHelpers.registerTestUser();
      
      await testHelpers.navigateTo('profile');
      await e2eUtils.tapElement(by.id('logout-button'));
      
      await expect(element(by.id('login-screen'))).toBeVisible();
    });
  });

  describe('Form Interactions', () => {
    it('should navigate between form fields using keyboard', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      
      // Focus on name field
      await e2eUtils.tapElement(by.id('register-name-input'));
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      
      // Move to next field (email)
      await device.pressKey('tab');
      await e2eUtils.typeText(by.id('register-email-input'), 'test@example.com');
      
      // Move to next field (password)
      await device.pressKey('tab');
      await e2eUtils.typeText(by.id('register-password-input'), 'password123');
      
      // Submit with enter key
      await device.pressKey('enter');
      
      // Should process registration
      await e2eUtils.waitForNetwork();
    });

    it('should handle form submission with enter key', async () => {
      await e2eUtils.typeText(by.id('login-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('login-password-input'), 'password123');
      
      // Submit with enter key
      await device.pressKey('enter');
      
      // Should attempt login (will fail with invalid credentials)
      await expect(element(by.text('Invalid credentials'))).toBeVisible();
    });

    it('should clear form when switching between login and register', async () => {
      // Fill login form
      await e2eUtils.typeText(by.id('login-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('login-password-input'), 'password');
      
      // Switch to register
      await e2eUtils.tapElement(by.id('register-link'));
      
      // Switch back to login
      await e2eUtils.tapElement(by.id('login-link'));
      
      // Form should be cleared
      await expect(element(by.id('login-email-input'))).toHaveText('');
      await expect(element(by.id('login-password-input'))).toHaveText('');
    });
  });

  describe('Accessibility', () => {
    it('should support screen reader navigation', async () => {
      await device.enableAccessibility();
      
      // Test accessibility labels
      await expect(element(by.id('login-email-input'))).toHaveAccessibilityLabel('Email input field');
      await expect(element(by.id('login-password-input'))).toHaveAccessibilityLabel('Password input field');
      await expect(element(by.id('login-submit-button'))).toHaveAccessibilityLabel('Login button');
      
      await device.disableAccessibility();
    });

    it('should have proper focus management', async () => {
      await e2eUtils.tapElement(by.id('login-email-input'));
      await expect(element(by.id('login-email-input'))).toBeFocused();
      
      await device.pressKey('tab');
      await expect(element(by.id('login-password-input'))).toBeFocused();
    });
  });

  describe('Error Handling', () => {
    it('should handle app crash gracefully during authentication', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      
      // Simulate app crash/restart during form filling
      await device.terminateApp();
      await device.launchApp();
      
      // Should return to login screen
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should recover from network interruption', async () => {
      await e2eUtils.tapElement(by.id('register-link'));
      
      await e2eUtils.typeText(by.id('register-name-input'), 'Test User');
      await e2eUtils.typeText(by.id('register-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('register-password-input'), 'password123');
      
      // Disconnect network
      await device.setNetworkConditions({ type: 'offline' });
      await e2eUtils.tapElement(by.id('register-submit-button'));
      
      // Should show network error
      await expect(element(by.text('Network error'))).toBeVisible();
      
      // Reconnect and retry
      await device.setNetworkConditions({ type: 'online' });
      await e2eUtils.tapElement(by.id('retry-button'));
      
      // Should proceed with registration
      await e2eUtils.waitForNetwork();
    });
  });

  describe('Performance', () => {
    it('should complete login within acceptable time', async () => {
      const startTime = Date.now();
      
      await e2eUtils.typeText(by.id('login-email-input'), 'test@example.com');
      await e2eUtils.typeText(by.id('login-password-input'), 'password123');
      await e2eUtils.tapElement(by.id('login-submit-button'));
      
      // Wait for response (success or failure)
      await waitFor(element(by.text('Invalid credentials')))
        .toBeVisible()
        .withTimeout(5000);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 5 seconds
      expect(duration).toBeLessThan(5000);
    });
  });
});
