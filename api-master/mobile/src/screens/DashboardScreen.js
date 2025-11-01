import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalAPIs: 12,
    activeKeys: 45,
    totalRequests: 15420,
    monthlyRevenue: 1850,
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={32} color={color} />
        <View style={styles.statTextContainer}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Willkommen zurück!</Text>
        <Text style={styles.subtitle}>Ihr API Dashboard</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="APIs"
          value={stats.totalAPIs}
          icon="api"
          color="#3b82f6"
          subtitle="Integriert"
        />
        <StatCard
          title="API Keys"
          value={stats.activeKeys}
          icon="key"
          color="#10b981"
          subtitle="Aktiv"
        />
        <StatCard
          title="Requests"
          value={stats.totalRequests.toLocaleString()}
          icon="chart-line"
          color="#f59e0b"
          subtitle="Diesen Monat"
        />
        <StatCard
          title="Umsatz"
          value={`€${stats.monthlyRevenue}`}
          icon="cash"
          color="#8b5cf6"
          subtitle="Kleinunternehmer"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Nutzung (7 Tage)</Text>
        <LineChart
          data={{
            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
            datasets: [{ data: [120, 150, 180, 160, 200, 170, 190] }],
          }}
          width={350}
          height={200}
          chartConfig={{
            backgroundColor: '#1e293b',
            backgroundGradientFrom: '#1e293b',
            backgroundGradientTo: '#1e293b',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            style: { borderRadius: 16 },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Compliance Status</Text>
        <View style={styles.complianceCard}>
          <Icon name="shield-check" size={40} color="#10b981" />
          <View style={styles.complianceInfo}>
            <Text style={styles.complianceTitle}>§19 UStG konform</Text>
            <Text style={styles.complianceText}>
              Umsatz: €{stats.monthlyRevenue * 12} / €22.000
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((stats.monthlyRevenue * 12) / 22000) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Schnellzugriff</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="key-plus" size={24} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Neuen API Key hinzufügen</Text>
          <Icon name="chevron-right" size={24} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="chart-box" size={24} color="#10b981" />
          <Text style={styles.actionButtonText}>Nutzungsanalyse anzeigen</Text>
          <Icon name="chevron-right" size={24} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="file-document" size={24} color="#f59e0b" />
          <Text style={styles.actionButtonText}>Rechnung erstellen</Text>
          <Icon name="chevron-right" size={24} color="#64748b" />
        </TouchableOpacity>
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
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
    marginTop: 8,
  },
  complianceCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  complianceInfo: {
    marginLeft: 16,
    flex: 1,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  complianceText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
});
