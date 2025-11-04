/**
 * Create Influencer Code Script
 * Generates a promo code that gives 20 free workflows
 */

const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, '../database/app.db');
const db = new sqlite3.Database(dbPath);

/**
 * Hash a promo code using SHA256
 */
function hashCode(code) {
  return crypto.createHash('sha256').update(code.toUpperCase().trim()).digest('hex');
}

/**
 * Generate a random influencer code
 */
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing characters (I, 1, O, 0)
  let code = 'INFLUENCER';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Create influencer code in database
 */
async function createInfluencerCode(options = {}) {
  const {
    code = generateCode(),
    workflowsBonus = 20,
    tokensBonus = 80, // 20 workflows × 4 tokens each
    maxUses = 100, // Limit to 100 influencer followers
    durationDays = 0, // 0 = unlimited duration
    description = 'Influencer Code - 20 kostenlose Workflows'
  } = options;

  const codeHash = hashCode(code);

  return new Promise((resolve, reject) => {
    // Check if promo_codes table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='promo_codes'", (err, table) => {
      if (err) {
        reject(err);
        return;
      }

      if (!table) {
        console.log('❌ Promo codes table does not exist. Please run database schema first.');
        reject(new Error('Promo codes table missing'));
        return;
      }

      // Insert the code
      db.run(
        `INSERT INTO promo_codes (code_hash, workflows_bonus, tokens_bonus, max_uses, duration_days, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [codeHash, workflowsBonus, tokensBonus, maxUses, durationDays, description],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint')) {
              reject(new Error('Code bereits vorhanden. Verwende einen anderen Code.'));
            } else {
              reject(err);
            }
          } else {
            resolve({
              id: this.lastID,
              code,
              codeHash,
              workflowsBonus,
              tokensBonus,
              maxUses,
              durationDays,
              description
            });
          }
        }
      );
    });
  });
}

/**
 * List all active codes
 */
async function listActiveCodes() {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM active_promo_codes ORDER BY created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      }
    );
  });
}

// Main execution
async function main() {
  console.log('🎁 Influencer Code Generator\n');

  // Check for command line arguments
  const args = process.argv.slice(2);
  let customCode = null;
  let workflows = 20;

  if (args.includes('--code')) {
    const codeIndex = args.indexOf('--code');
    customCode = args[codeIndex + 1];
  }

  if (args.includes('--workflows')) {
    const workflowsIndex = args.indexOf('--workflows');
    workflows = parseInt(args[workflowsIndex + 1]) || 20;
  }

  try {
    // Create influencer code
    console.log('📝 Erstelle Influencer Code...\n');

    const result = await createInfluencerCode({
      code: customCode,
      workflowsBonus: workflows,
      tokensBonus: workflows * 4, // 4 tokens per workflow
      maxUses: 100,
      description: `Influencer Code - ${workflows} kostenlose Workflows`
    });

    console.log('✅ Code erfolgreich erstellt!\n');
    console.log('═'.repeat(60));
    console.log(`   CODE: ${result.code}`);
    console.log('═'.repeat(60));
    console.log(`   Workflows: ${result.workflowsBonus}`);
    console.log(`   Tokens: ${result.tokensBonus}`);
    console.log(`   Max Uses: ${result.maxUses}`);
    console.log(`   Duration: ${result.durationDays === 0 ? 'Unbegrenzt' : result.durationDays + ' Tage'}`);
    console.log(`   Description: ${result.description}`);
    console.log('═'.repeat(60));
    console.log('\n💡 Hinweise:');
    console.log('   - Teile diesen Code mit deinen Influencern');
    console.log('   - Der Code kann bis zu 100 mal eingelöst werden');
    console.log('   - User bekommen 20 Workflows + 80 Tokens');
    console.log('   - Code ist case-insensitive\n');

    // List all active codes
    console.log('📋 Alle aktiven Codes:\n');
    const activeCodes = await listActiveCodes();

    if (activeCodes.length === 0) {
      console.log('   Keine aktiven Codes gefunden.\n');
    } else {
      activeCodes.forEach(code => {
        console.log(`   - Workflows: ${code.workflows_bonus} | Tokens: ${code.tokens_bonus} | Uses: ${code.current_uses}/${code.max_uses || '∞'}`);
        console.log(`     ${code.description || 'Kein Beschreibung'}`);
        console.log(`     Erstellt: ${code.created_at}\n`);
      });
    }

    db.close();
  } catch (error) {
    console.error('❌ Fehler:', error.message);
    db.close();
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createInfluencerCode,
  generateCode,
  listActiveCodes
};
