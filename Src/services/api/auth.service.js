import AsyncStorage from '@react-native-async-storage/async-storage';
import {APIRequest, TOKEN} from './api-request';

export class AuthService extends APIRequest {
  async login(data) {
    return this.post('/login', {
      ...data,
    });
  }

  async register(data) {
    return this.post('/register', {
      ...data,
    });
  }

  setToken(token) {
    // https://github.com/js-cookie/js-cookie
    // since Safari does not support, need a better solution
    AsyncStorage.setItem(TOKEN, token);
    this.setAuthHeaderToken(token);
  }

  async getToken() {
    const token = await AsyncStorage.getItem(TOKEN);
    return token;
  }

  async removeToken() {
    await AsyncStorage.removeItem(TOKEN);
  }

  async updateInfo(inputs) {
    return this.post('/update-info', inputs);
  }

  async changePassword(inputs) {
    return this.post('/change-password', inputs);
  }

  async updateProfilePics(inputs) {
    return this.post('/update-pics', inputs);
  }

  forgotPassword(data) {
    return this.post('/forgot/password', data);
  }

  resetPassword(data) {
    return this.post('/reset/password', data);
  }

  logout() {
    return this.post('/logout', {});
  }

  getUserProfile(user_id) {
    return this.get(`/get-user-profile/${user_id}`, {});
  }

  sendVerificationCode(payload) {
    return this.post('/send/verification/code', payload);
  }
}

export const authService = new AuthService();
