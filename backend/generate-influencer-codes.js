/**
 * Generate Influencer Promo Codes
 * Run this script to generate and insert influencer codes into database
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { hashCode, generatePromoCode } = require('./promo-codes');

const dbPath = path.join(__dirname, '../database/app.db');
const db = new sqlite3.Database(dbPath);

/**
 * Insert promo code into database
 */
function insertCode(code, config) {
  return new Promise((resolve, reject) => {
    const codeHash = hashCode(code);

    db.run(
      `INSERT INTO promo_codes
       (code_hash, code_type, name, description, workflows_bonus, tokens_bonus, duration_days, valid_until, max_uses, created_by, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        codeHash,
        config.type,
        config.name,
        config.description,
        config.workflows,
        config.tokens,
        config.durationDays,
        config.validUntil,
        config.maxUses,
        config.createdBy
      ],
      function(err) {
        if (err) {
          // Ignore duplicate errors
          if (err.message.includes('UNIQUE')) {
            console.log(`⚠️  Code bereits vorhanden: ${code}`);
            resolve({ id: null, code, exists: true });
          } else {
            reject(err);
          }
        } else {
          resolve({ id: this.lastID, code, exists: false });
        }
      }
    );
  });
}

/**
 * Generate influencer codes
 */
async function generateInfluencerCodes() {
  console.log('\n🎨 Von der Idee zum Prototyp - Influencer Code Generator\n');

  const codes = [];

  // 1. HAUPT-INFLUENCER CODE (empfohlen)
  const mainInfluencerCode = 'INFLUENCER-2025-FREE';
  const mainConfig = {
    type: 'influencer',
    name: 'Influencer 2-Wochen Test',
    description: '2 Wochen kostenlos mit 30 Workflows oder 120 Tokens für Influencer',
    workflows: 30,
    tokens: 120,
    durationDays: 14,
    validUntil: '2025-12-31 23:59:59',
    maxUses: 500, // Maximal 500 Influencer
    createdBy: 'admin'
  };

  try {
    const result = await insertCode(mainInfluencerCode, mainConfig);
    if (!result.exists) {
      console.log('✅ HAUPT-INFLUENCER CODE generiert:');
      console.log(`   Code: ${mainInfluencerCode}`);
      console.log(`   Hash: ${hashCode(mainInfluencerCode)}`);
      console.log(`   Workflows: ${mainConfig.workflows}`);
      console.log(`   Tokens: ${mainConfig.tokens}`);
      console.log(`   Dauer: ${mainConfig.durationDays} Tage`);
      console.log(`   Max Uses: ${mainConfig.maxUses}`);
      console.log(`   Gültig bis: ${mainConfig.validUntil}\n`);
    }
    codes.push({ code: mainInfluencerCode, config: mainConfig });
  } catch (err) {
    console.error('❌ Fehler beim Einfügen des Haupt-Codes:', err);
  }

  // 2. BACKUP-CODES (falls Haupt-Code kompromittiert wird)
  const backupCodes = [
    'CREATOR-2025-TRIAL',
    'YOUTUBE-SPECIAL-2025',
    'TIKTOK-CREATOR-FREE'
  ];

  for (const backupCode of backupCodes) {
    const backupConfig = {
      type: 'influencer',
      name: 'Influencer Backup Code',
      description: '2 Wochen kostenlos mit 30 Workflows oder 120 Tokens',
      workflows: 30,
      tokens: 120,
      durationDays: 14,
      validUntil: '2025-12-31 23:59:59',
      maxUses: 100,
      createdBy: 'admin'
    };

    try {
      const result = await insertCode(backupCode, backupConfig);
      if (!result.exists) {
        console.log(`✅ Backup Code generiert: ${backupCode}`);
      }
      codes.push({ code: backupCode, config: backupConfig });
    } catch (err) {
      console.error(`❌ Fehler bei ${backupCode}:`, err);
    }
  }

  // 3. PARTNER-CODES (individuell für große Influencer)
  const partnerCodes = [];
  for (let i = 1; i <= 5; i++) {
    const partnerCode = generatePromoCode('PARTNER', 8);
    const partnerConfig = {
      type: 'partner',
      name: `Partner Code #${i}`,
      description: '4 Wochen VIP Test mit 60 Workflows',
      workflows: 60,
      tokens: 240,
      durationDays: 28,
      validUntil: '2025-12-31 23:59:59',
      maxUses: 1, // Nur für einen spezifischen Partner
      createdBy: 'admin'
    };

    try {
      const result = await insertCode(partnerCode, partnerConfig);
      if (!result.exists) {
        console.log(`✅ Partner Code generiert: ${partnerCode}`);
        partnerCodes.push(partnerCode);
      }
      codes.push({ code: partnerCode, config: partnerConfig });
    } catch (err) {
      console.error(`❌ Fehler bei Partner Code #${i}:`, err);
    }
  }

  console.log('\n📊 ZUSAMMENFASSUNG\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎯 HAUPT-CODE (öffentlich für alle Influencer):');
  console.log(`   ${mainInfluencerCode}`);
  console.log('   → 30 Workflows oder 120 Tokens');
  console.log('   → 14 Tage Testphase (beginnt bei erster Generierung)');
  console.log('   → Maximal 500 Einlösungen\n');

  console.log('🔄 BACKUP-CODES (falls Haupt-Code kompromittiert):');
  backupCodes.forEach(code => console.log(`   ${code}`));
  console.log('');

  console.log('👑 PARTNER-CODES (individuell für VIPs):');
  partnerCodes.forEach(code => console.log(`   ${code}`));
  console.log('   → 60 Workflows oder 240 Tokens');
  console.log('   → 28 Tage VIP-Testphase');
  console.log('   → Jeweils nur 1x einlösbar\n');

  console.log('═══════════════════════════════════════════════════════');
  console.log('\n✅ Alle Codes wurden erfolgreich generiert!\n');

  db.close();
}

// Run generator
generateInfluencerCodes().catch(err => {
  console.error('Fatal error:', err);
  db.close();
  process.exit(1);
});
