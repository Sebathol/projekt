import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function APIKeysScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [apiKeys, setApiKeys] = useState([
    {
      id: '1',
      name: 'OpenAI GPT-4',
      provider: 'OpenAI',
      proxyKey: 'APM_sk_openai_12345',
      status: 'active',
      lastUsed: '2 Stunden',
      requests: 1240,
    },
    {
      id: '2',
      name: 'Anthropic Claude',
      provider: 'Anthropic',
      proxyKey: 'APM_sk_anthropic_67890',
      status: 'active',
      lastUsed: '5 Minuten',
      requests: 850,
    },
    {
      id: '3',
      name: 'Google Maps',
      provider: 'Google',
      proxyKey: 'APM_gcp_maps_abcde',
      status: 'active',
      lastUsed: '1 Tag',
      requests: 420,
    },
  ]);

  const renderKeyCard = ({ item }) => (
    <View style={styles.keyCard}>
      <View style={styles.keyHeader}>
        <View style={styles.keyInfo}>
          <Text style={styles.keyName}>{item.name}</Text>
          <Text style={styles.keyProvider}>{item.provider}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'active' ? styles.statusActive : styles.statusInactive,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'active' ? 'Aktiv' : 'Inaktiv'}
          </Text>
        </View>
      </View>

      <View style={styles.proxyKeyContainer}>
        <Text style={styles.proxyKeyLabel}>Proxy Key:</Text>
        <Text style={styles.proxyKey}>{item.proxyKey}</Text>
        <TouchableOpacity style={styles.copyButton}>
          <Icon name="content-copy" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.keyStats}>
        <View style={styles.keyStat}>
          <Icon name="clock-outline" size={16} color="#64748b" />
          <Text style={styles.keyStatText}>Zuletzt: {item.lastUsed}</Text>
        </View>
        <View style={styles.keyStat}>
          <Icon name="chart-line" size={16} color="#64748b" />
          <Text style={styles.keyStatText}>{item.requests} Requests</Text>
        </View>
      </View>

      <View style={styles.keyActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="refresh" size={18} color="#10b981" />
          <Text style={styles.actionButtonText}>Rotieren</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chart-box" size={18} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="cog" size={18} color="#64748b" />
          <Text style={styles.actionButtonText}>Einstellungen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="API Keys durchsuchen..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={apiKeys}
        renderItem={renderKeyCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
    padding: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#fff',
    marginLeft: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  keyCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  keyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  keyInfo: {
    flex: 1,
  },
  keyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  keyProvider: {
    fontSize: 14,
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#10b98120',
  },
  statusInactive: {
    backgroundColor: '#ef444420',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
  },
  proxyKeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  proxyKeyLabel: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 8,
  },
  proxyKey: {
    flex: 1,
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  keyStats: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  keyStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyStatText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 6,
  },
  keyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#94a3b8',
    marginLeft: 6,
  },
});
