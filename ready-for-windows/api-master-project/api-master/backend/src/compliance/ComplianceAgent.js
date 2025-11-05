/**
 * Compliance Agent - Automated Compliance Monitoring & Management
 *
 * Für: Ai Storm Create (Sebastian Beyer)
 * Status: Kleinunternehmer nach §19 UStG
 * Zielgruppe: B2B
 */

const { Op } = require('sequelize');

class ComplianceAgent {
  constructor() {
    this.KLEINUNTERNEHMER_LIMIT = 22000; // Euro per year
    this.currentYear = new Date().getFullYear();

    // Plattform-Konfiguration
    this.platforms = {
      gumroad: { feePercent: 10, feeFixed: 0.30, merchantOfRecord: true },
      sellfy: { feePercent: 0, feeFixed: 29, merchantOfRecord: true },
      codecanyon: { feePercent: 50, merchantOfRecord: true },
      microsoftStore: { feePercent: 15, merchantOfRecord: false },
      macAppStore: { feePercent: 15, merchantOfRecord: false },
      chromeWebStore: { feePercent: 5, merchantOfRecord: false },
      githubMarketplace: { feePercent: 25, merchantOfRecord: false },
      amazon: { feePercent: 15, merchantOfRecord: true },
      ebay: { feePercent: 12.5, merchantOfRecord: false },
      etsy: { feePercent: 6.5, feeFixed: 0.20, merchantOfRecord: false }
    };

    // Steuersätze nach Land
    this.vatRates = {
      DE: 0, // Kleinunternehmer!
      AT: 0,
      FR: 0,
      IT: 0,
      ES: 0,
      NL: 0,
      BE: 0,
      // Weitere EU-Länder bei Bedarf
    };
  }

  /**
   * Prüfe ob Kleinunternehmer-Grenze erreicht
   */
  async checkKleinunternehmerLimit() {
    const yearStart = new Date(this.currentYear, 0, 1);
    const yearEnd = new Date(this.currentYear, 11, 31, 23, 59, 59);

    // Alle Einnahmen des Jahres summieren
    const totalRevenue = await this.calculateYearlyRevenue(yearStart, yearEnd);

    const remaining = this.KLEINUNTERNEHMER_LIMIT - totalRevenue;
    const percentage = (totalRevenue / this.KLEINUNTERNEHMER_LIMIT) * 100;

    return {
      totalRevenue,
      limit: this.KLEINUNTERNEHMER_LIMIT,
      remaining,
      percentage: percentage.toFixed(2),
      status: this.getLimitStatus(percentage),
      warning: percentage >= 80,
      critical: percentage >= 95
    };
  }

  /**
   * Status basierend auf Auslastung
   */
  getLimitStatus(percentage) {
    if (percentage < 50) return 'SAFE';
    if (percentage < 80) return 'MODERATE';
    if (percentage < 95) return 'WARNING';
    return 'CRITICAL';
  }

  /**
   * Berechne Jahresumsatz
   */
  async calculateYearlyRevenue(startDate, endDate) {
    // TODO: Aus Datenbank holen
    // Beispiel-Implementierung:
    const revenues = await this.getRevenuesFromDB(startDate, endDate);
    return revenues.reduce((sum, rev) => sum + rev.amount, 0);
  }

  /**
   * Generiere Kleinunternehmer-Rechnung
   */
  generateInvoice(invoiceData) {
    const {
      invoiceNumber,
      customerName,
      customerAddress,
      customerVatId,
      items,
      isEUBusiness,
      date,
      dueDate
    } = invoiceData;

    // Berechne Gesamtbetrag (OHNE MwSt - Kleinunternehmer!)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const invoice = {
      header: this.getInvoiceHeader(),
      invoiceNumber,
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || this.calculateDueDate(14),
      customer: {
        name: customerName,
        address: customerAddress,
        vatId: customerVatId || null
      },
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        price: this.formatCurrency(item.price),
        total: this.formatCurrency(item.price * item.quantity)
      })),
      subtotal: this.formatCurrency(subtotal),
      vatAmount: '0,00 €', // Kleinunternehmer!
      total: this.formatCurrency(subtotal),
      footer: this.getInvoiceFooter(isEUBusiness, customerVatId),
      paymentDetails: this.getPaymentDetails()
    };

    return invoice;
  }

  /**
   * Rechnungskopf
   */
  getInvoiceHeader() {
    return {
      company: 'Sebastian Beyer',
      businessName: 'Ai Storm Create - Softwareentwicklung und KI Lösungen',
      address: 'Bahnhofstraße 71',
      postalCode: '66636',
      city: 'Tholey',
      country: 'Deutschland',
      phone: '068738579828',
      email: 'aistormcreate.service@gmail.com',
      taxNumber: '060/206/00215'
    };
  }

  /**
   * Rechnungsfußzeile mit Kleinunternehmer-Hinweis
   */
  getInvoiceFooter(isEUBusiness, vatId) {
    let footer = 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.';

    // Reverse-Charge bei B2B EU-Ausland
    if (isEUBusiness && vatId) {
      footer += '\n\nReverse-Charge-Verfahren: Die Steuerschuld geht auf den Leistungsempfänger über.';
      footer += `\nUSt-ID des Kunden: ${vatId}`;
    }

    return footer;
  }

  /**
   * Zahlungsdetails
   */
  getPaymentDetails() {
    return {
      accountHolder: 'Sebastian Beyer',
      iban: 'DE__ ____ ____ ____ ____ __', // IBAN hier eintragen
      bic: '____________', // BIC hier eintragen
      bank: '__________' // Bank hier eintragen
    };
  }

  /**
   * Fälligkeitsdatum berechnen
   */
  calculateDueDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  /**
   * Währung formatieren
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  /**
   * USt-ID validieren (EU)
   */
  async validateVatId(vatId, countryCode) {
    // Format: DE123456789
    const regex = /^[A-Z]{2}[0-9A-Z]+$/;

    if (!regex.test(vatId)) {
      return {
        valid: false,
        error: 'Ungültiges Format'
      };
    }

    // TODO: Echte Validierung über EU VIES API
    // https://ec.europa.eu/taxation_customs/vies/

    return {
      valid: true,
      countryCode: vatId.substring(0, 2),
      number: vatId.substring(2)
    };
  }

  /**
   * Prüfe ob Reverse-Charge anzuwenden ist
   */
  shouldApplyReverseCharge(customerCountry, customerVatId) {
    // Nur bei B2B und EU-Ausland
    const euCountries = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
                         'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL',
                         'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];

    const isEU = euCountries.includes(customerCountry);
    const isNotDE = customerCountry !== 'DE';
    const hasVatId = !!customerVatId;

    return isEU && isNotDE && hasVatId;
  }

  /**
   * Berechne Plattform-Gebühren
   */
  calculatePlatformFee(platform, amount) {
    const config = this.platforms[platform];
    if (!config) {
      return { error: 'Unknown platform' };
    }

    const percentageFee = (amount * config.feePercent) / 100;
    const fixedFee = config.feeFixed || 0;
    const totalFee = percentageFee + fixedFee;
    const netAmount = amount - totalFee;

    return {
      platform,
      grossAmount: amount,
      fee: totalFee,
      netAmount: netAmount,
      merchantOfRecord: config.merchantOfRecord,
      breakdown: {
        percentageFee: percentageFee,
        fixedFee: fixedFee
      }
    };
  }

  /**
   * DATEV Export generieren
   */
  async generateDATEVExport(startDate, endDate) {
    const revenues = await this.getRevenuesFromDB(startDate, endDate);
    const expenses = await this.getExpensesFromDB(startDate, endDate);

    const csvLines = ['Datum,Belegnummer,Beschreibung,Einnahme,Ausgabe,Kategorie,Plattform,USt-Satz'];

    // Einnahmen
    revenues.forEach(rev => {
      csvLines.push([
        rev.date,
        rev.invoiceNumber,
        rev.description,
        this.formatNumberForCSV(rev.amount),
        '0',
        rev.category,
        rev.platform,
        '0%' // Kleinunternehmer!
      ].join(','));
    });

    // Ausgaben
    expenses.forEach(exp => {
      csvLines.push([
        exp.date,
        exp.documentNumber,
        exp.description,
        '0',
        this.formatNumberForCSV(exp.amount),
        exp.category,
        exp.supplier,
        exp.vatRate + '%'
      ].join(','));
    });

    return csvLines.join('\n');
  }

  /**
   * Formatiere Nummer für CSV
   */
  formatNumberForCSV(number) {
    return number.toFixed(2).replace('.', ',');
  }

  /**
   * Compliance-Warnungen
   */
  async getComplianceWarnings() {
    const warnings = [];

    // 1. Umsatzgrenze prüfen
    const limitCheck = await this.checkKleinunternehmerLimit();
    if (limitCheck.warning) {
      warnings.push({
        type: 'REVENUE_LIMIT',
        severity: limitCheck.critical ? 'CRITICAL' : 'WARNING',
        message: `Sie haben bereits ${limitCheck.totalRevenue}€ Umsatz erreicht (${limitCheck.percentage}% der Kleinunternehmer-Grenze)`,
        recommendation: limitCheck.critical
          ? 'DRINGEND: Umsatz begrenzen oder ab nächstem Jahr Regelbesteuerung!'
          : 'Überwachen Sie Ihren Umsatz genau. Bei Überschreitung müssen Sie ab nächstem Jahr MwSt ausweisen.'
      });
    }

    // 2. Fehlende §19 Hinweise
    const invoicesWithoutHint = await this.checkMissingVatHints();
    if (invoicesWithoutHint.length > 0) {
      warnings.push({
        type: 'MISSING_VAT_HINT',
        severity: 'ERROR',
        message: `${invoicesWithoutHint.length} Rechnungen ohne §19 UStG Hinweis gefunden!`,
        invoices: invoicesWithoutHint,
        recommendation: 'Rechnungen korrigieren und neu versenden!'
      });
    }

    // 3. Ungültige USt-IDs
    const invalidVatIds = await this.checkInvalidVatIds();
    if (invalidVatIds.length > 0) {
      warnings.push({
        type: 'INVALID_VAT_ID',
        severity: 'WARNING',
        message: `${invalidVatIds.length} Rechnungen mit ungültigen USt-IDs!`,
        invoices: invalidVatIds,
        recommendation: 'USt-IDs beim Bundesamt prüfen lassen!'
      });
    }

    return warnings;
  }

  /**
   * Placeholder-Methoden (mit echter DB verbinden)
   */
  async getRevenuesFromDB(startDate, endDate) {
    // TODO: Echte DB-Abfrage
    return [];
  }

  async getExpensesFromDB(startDate, endDate) {
    // TODO: Echte DB-Abfrage
    return [];
  }

  async checkMissingVatHints() {
    // TODO: Echte DB-Abfrage
    return [];
  }

  async checkInvalidVatIds() {
    // TODO: Echte DB-Abfrage
    return [];
  }
}

module.exports = new ComplianceAgent();
