import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen({ navigation }) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            await SecureStore.deleteItemAsync('userToken');
            // Navigation wird automatisch durch App.js gehandhabt
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color="#3b82f6" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <Icon name="chevron-right" size={24} color="#64748b" />}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Einstellungen</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sicherheit</Text>
        <SettingItem
          icon="fingerprint"
          title="Biometrische Authentifizierung"
          subtitle="Face ID / Fingerabdruck"
          rightElement={
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#334155', true: '#3b82f680' }}
              thumbColor={biometricEnabled ? '#3b82f6' : '#64748b'}
            />
          }
        />
        <SettingItem
          icon="key-change"
          title="API Keys rotieren"
          subtitle="Alle Keys neu generieren"
          onPress={() => Alert.alert('API Keys rotieren', 'Feature kommt bald!')}
        />
        <SettingItem
          icon="shield-lock"
          title="Verschlüsselung"
          subtitle="AES-256-GCM aktiv"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benachrichtigungen</Text>
        <SettingItem
          icon="bell"
          title="Push-Benachrichtigungen"
          subtitle="API-Warnungen und Updates"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#334155', true: '#3b82f680' }}
              thumbColor={notificationsEnabled ? '#3b82f6' : '#64748b'}
            />
          }
        />
        <SettingItem
          icon="alert-circle"
          title="Compliance-Warnungen"
          subtitle="Bei Annäherung an €22.000 Limit"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Darstellung</Text>
        <SettingItem
          icon="theme-light-dark"
          title="Dark Mode"
          subtitle="Dunkles Design"
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#334155', true: '#3b82f680' }}
              thumbColor={darkMode ? '#3b82f6' : '#64748b'}
            />
          }
        />
        <SettingItem
          icon="translate"
          title="Sprache"
          subtitle="Deutsch"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Abo & Zahlung</Text>
        <SettingItem
          icon="crown"
          title="Abo-Plan"
          subtitle="Individual - €19.99/Monat"
        />
        <SettingItem
          icon="credit-card"
          title="Zahlungsmethode"
          subtitle="Kreditkarte endet auf 4242"
        />
        <SettingItem
          icon="receipt"
          title="Rechnungen"
          subtitle="Alle Zahlungsbelege anzeigen"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="help-circle"
          title="Hilfe & FAQ"
          subtitle="Häufig gestellte Fragen"
        />
        <SettingItem
          icon="email"
          title="Support kontaktieren"
          subtitle="support@apimaster.com"
        />
        <SettingItem
          icon="file-document"
          title="Dokumentation"
          subtitle="API Docs & Guides"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Über</Text>
        <SettingItem
          icon="information"
          title="Version"
          subtitle="1.0.0"
        />
        <SettingItem
          icon="shield-check"
          title="Datenschutz"
          subtitle="Datenschutzerklärung lesen"
        />
        <SettingItem
          icon="file-document-outline"
          title="Nutzungsbedingungen"
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Abmelden</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Ai Storm Create
        </Text>
        <Text style={styles.footerText}>
          Sebastian Beyer - Kleinunternehmer gem. §19 UStG
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});
