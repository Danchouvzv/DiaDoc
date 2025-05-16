import { db } from '@/lib/firebase-config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export interface UserSettings {
  // Внешний вид
  theme: 'light' | 'dark' | 'system';
  colorTheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  
  // Уведомления
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderNotifications: boolean;
  
  // Единицы измерения
  glucoseUnit: 'mg/dL' | 'mmol/L';
  weightUnit: 'kg' | 'lb';
  carbUnit: 'g' | 'oz';
  timeFormat: '12h' | '24h';
  
  // Приватность и безопасность
  twoFactorEnabled: boolean;
  shareWithHealthcare: boolean;
  shareForResearch: boolean;
  allowMarketing: boolean;
  
  // Дополнительные настройки
  language: 'english' | 'russian' | 'spanish' | 'french' | 'german';
}

export const defaultSettings: UserSettings = {
  // Внешний вид
  theme: 'system',
  colorTheme: 'blue',
  fontSize: 'medium',
  reduceMotion: false,
  
  // Уведомления
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  reminderNotifications: true,
  
  // Единицы измерения
  glucoseUnit: 'mg/dL',
  weightUnit: 'kg',
  carbUnit: 'g',
  timeFormat: '24h',
  
  // Приватность и безопасность
  twoFactorEnabled: false,
  shareWithHealthcare: true,
  shareForResearch: false,
  allowMarketing: false,
  
  // Дополнительные настройки
  language: 'english',
};

export const settingsService = {
  /**
   * Получение настроек пользователя
   */
  async getUserSettings(userId: string): Promise<UserSettings> {
    try {
      const userSettingsRef = doc(db, 'userSettings', userId);
      const userSettingsDoc = await getDoc(userSettingsRef);
      
      if (userSettingsDoc.exists()) {
        return userSettingsDoc.data() as UserSettings;
      } else {
        // Если настроек еще нет, создадим их с значениями по умолчанию
        await setDoc(userSettingsRef, defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      console.error('Error getting user settings:', error);
      return defaultSettings;
    }
  },
  
  /**
   * Обновление настроек пользователя
   */
  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
    try {
      const userSettingsRef = doc(db, 'userSettings', userId);
      
      // Проверим существуют ли настройки
      const userSettingsDoc = await getDoc(userSettingsRef);
      
      if (userSettingsDoc.exists()) {
        // Если настройки существуют, обновим их
        await updateDoc(userSettingsRef, settings);
      } else {
        // Если настроек еще нет, создадим их с заданными параметрами
        await setDoc(userSettingsRef, {...defaultSettings, ...settings});
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw new Error('Failed to update settings');
    }
  },
  
  /**
   * Обновление настроек темы
   */
  async updateThemeSettings(userId: string, themeSettings: Pick<UserSettings, 'theme' | 'colorTheme' | 'fontSize' | 'reduceMotion'>): Promise<void> {
    return this.updateUserSettings(userId, themeSettings);
  },
  
  /**
   * Обновление настроек уведомлений
   */
  async updateNotificationSettings(userId: string, notificationSettings: Pick<UserSettings, 'notificationsEnabled' | 'emailNotifications' | 'pushNotifications' | 'reminderNotifications'>): Promise<void> {
    return this.updateUserSettings(userId, notificationSettings);
  },
  
  /**
   * Обновление настроек единиц измерения
   */
  async updateUnitSettings(userId: string, unitSettings: Pick<UserSettings, 'glucoseUnit' | 'weightUnit' | 'carbUnit' | 'timeFormat'>): Promise<void> {
    return this.updateUserSettings(userId, unitSettings);
  },
  
  /**
   * Обновление настроек приватности
   */
  async updatePrivacySettings(userId: string, privacySettings: Pick<UserSettings, 'twoFactorEnabled' | 'shareWithHealthcare' | 'shareForResearch' | 'allowMarketing'>): Promise<void> {
    return this.updateUserSettings(userId, privacySettings);
  },
  
  /**
   * Сброс настроек по умолчанию
   */
  async resetSettings(userId: string): Promise<void> {
    try {
      const userSettingsRef = doc(db, 'userSettings', userId);
      await setDoc(userSettingsRef, defaultSettings);
    } catch (error) {
      console.error('Error resetting user settings:', error);
      throw new Error('Failed to reset settings');
    }
  }
}; 