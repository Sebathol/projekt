import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const werbelinks = [
  {
    id: 1,
    active: true,
    title: 'Simple Weather App',
    description: 'Professionelle Wetter-Vorhersage für Ihre Region. Genau, schnell, zuverlässig.',
    image: 'https://placehold.co/300x150/0ea5e9/ffffff?text=Weather+App',
    link: 'https://weather-app.example.com',
    buttonText: 'Kostenlos testen',
    priority: 1,
  },
  {
    id: 2,
    active: true,
    title: 'Task Manager Pro',
    description: 'Organisieren Sie Ihre Aufgaben effizient. Perfekt für Teams und Einzelpersonen.',
    image: 'https://placehold.co/300x150/8b5cf6/ffffff?text=Task+Manager',
    link: 'https://taskmanager.example.com',
    buttonText: 'Jetzt starten',
    priority: 2,
  },
  {
    id: 3,
    active: true,
    title: 'Finance Tracker',
    description: 'Verwalten Sie Ihre Finanzen intelligent. Automatische Kategorisierung und Berichte.',
    image: 'https://placehold.co/300x150/10b981/ffffff?text=Finance+Tracker',
    link: 'https://finance.example.com',
    buttonText: 'Mehr erfahren',
    priority: 3,
  },
];

export default function WerbelinksScreen({ navigation }) {
  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  const renderWerbelink = (link) => (
    <View key={link.id} style={styles.card}>
      <Image
        source={{ uri: link.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{link.title}</Text>
        <Text style={styles.description}>{link.description}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleLinkPress(link.link)}
        >
          <Text style={styles.buttonText}>{link.buttonText}</Text>
          <Icon name="open-in-new" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unsere Apps</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Icon name="apps" size={48} color="#3b82f6" />
          <Text style={styles.bannerTitle}>Entdecken Sie unsere Apps</Text>
          <Text style={styles.bannerSubtitle}>
            Von Ai Storm Create - Alle Apps professionell entwickelt
          </Text>
        </View>

        {werbelinks
          .filter(link => link.active)
          .sort((a, b) => a.priority - b.priority)
          .map(renderWerbelink)}

        <View style={styles.footer}>
          <Icon name="information" size={24} color="#64748b" />
          <Text style={styles.footerText}>
            Alle Apps werden von Ai Storm Create entwickelt und gepflegt
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  banner: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#1e293b',
    marginBottom: 16,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#334155',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#94a3b8',
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    flex: 1,
  },
});
