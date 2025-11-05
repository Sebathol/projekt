import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import anthropicService from '../services/anthropicService';

export default function ComplianceScreen() {
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState({
    currentRevenue: 18500,
    yearlyLimit: 22000,
    status: 'compliant',
    invoiceCount: 142,
  });

  const analyzeCompliance = async () => {
    setLoading(true);
    try {
      const invoices = [
        { amount: 150, date: '2024-10-15', customer: 'Kunde A' },
        { amount: 280, date: '2024-10-20', customer: 'Kunde B' },
      ];

      const result = await anthropicService.checkCompliance(
        complianceData.currentRevenue,
        invoices
      );

      console.log('Compliance Analysis:', result);
    } catch (error) {
      console.error('Compliance check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const remaining = complianceData.yearlyLimit - complianceData.currentRevenue;
  const percentage = (complianceData.currentRevenue / complianceData.yearlyLimit) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kleinunternehmer-Regelung</Text>
        <Text style={styles.subtitle}>§19 UStG Deutschland</Text>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Icon
            name={percentage < 80 ? 'shield-check' : 'alert'}
            size={48}
            color={percentage < 80 ? '#10b981' : '#f59e0b'}
          />
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              {percentage < 80 ? 'Konform' : 'Achtung!'}
            </Text>
            <Text style={styles.statusSubtitle}>
              {percentage < 80
                ? 'Sie erfüllen die Anforderungen'
                : 'Sie nähern sich dem Limit'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.revenueCard}>
        <Text style={styles.cardTitle}>Jahresumsatz</Text>
        <View style={styles.revenueInfo}>
          <Text style={styles.revenueAmount}>
            €{complianceData.currentRevenue.toLocaleString()}
          </Text>
          <Text style={styles.revenueLimit}>
            von €{complianceData.yearlyLimit.toLocaleString()}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.remainingText}>
          Verbleibend: €{remaining.toLocaleString()}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Icon name="file-document" size={32} color="#3b82f6" />
          <Text style={styles.statValue}>{complianceData.invoiceCount}</Text>
          <Text style={styles.statLabel}>Rechnungen</Text>
        </View>
        <View style={styles.statBox}>
          <Icon name="cash" size={32} color="#10b981" />
          <Text style={styles.statValue}>
            €{Math.round(complianceData.currentRevenue / 12)}
          </Text>
          <Text style={styles.statLabel}>Ø Monat</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Wichtige Hinweise:</Text>
        <View style={styles.infoItem}>
          <Icon name="check-circle" size={20} color="#10b981" />
          <Text style={styles.infoText}>
            Keine Umsatzsteuer auf Rechnungen
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="check-circle" size={20} color="#10b981" />
          <Text style={styles.infoText}>
            Kein Vorsteuerabzug möglich
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="check-circle" size={20} color="#10b981" />
          <Text style={styles.infoText}>
            Pflichtangabe: "Kleinunternehmer gem. §19 UStG"
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Icon name="alert-circle" size={20} color="#f59e0b" />
          <Text style={styles.infoText}>
            Bei Überschreitung: Regelbesteuerung ab nächstem Jahr
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.analyzeButton}
        onPress={analyzeCompliance}
        disabled={loading}
      >
        <Icon name="robot" size={24} color="#fff" />
        <Text style={styles.analyzeButtonText}>
          {loading ? 'Analysiere...' : 'Mit Claude analysieren'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.invoiceButton}>
        <Icon name="file-plus" size={24} color="#3b82f6" />
        <Text style={styles.invoiceButtonText}>Neue Rechnung erstellen</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statusCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusInfo: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  revenueCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 12,
  },
  revenueInfo: {
    marginBottom: 12,
  },
  revenueAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  revenueLimit: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#0f172a',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  remainingText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 12,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  analyzeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 12,
  },
  invoiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  invoiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 12,
  },
});
