/**
 * Script per generare JWT per Apple Sign In con Supabase
 * 
 * ISTRUZIONI:
 * 1. Installa jsonwebtoken: npm install jsonwebtoken
 * 2. Modifica i valori qui sotto con le tue credenziali
 * 3. Esegui: node scripts/generate-apple-jwt.js
 * 4. Copia il JWT generato e incollalo in Supabase > Authentication > Providers > Apple > Secret Key
 * 5. ELIMINA questo script e il file .p8 dopo l'uso (per sicurezza)
 */

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// ============================================
// MODIFICA QUESTI VALORI CON LE TUE CREDENZIALI
// ============================================

const TEAM_ID = 'ABC123DEF4'; // Il tuo Team ID (10 caratteri)
const KEY_ID = 'ABC123DEF4'; // La tua Key ID (10 caratteri)
const SERVICES_ID = 'com.beanpositive.app.web'; // Il tuo Services ID
const PRIVATE_KEY_PATH = './AuthKey_ABC123DEF4.p8'; // Percorso al file .p8 (relativo a questo script)

// ============================================
// NON MODIFICARE OLTRE QUESTA RIGA
// ============================================

try {
  // Verifica che il file .p8 esista
  const keyPath = path.resolve(__dirname, PRIVATE_KEY_PATH);
  if (!fs.existsSync(keyPath)) {
    console.error('❌ ERRORE: File .p8 non trovato!');
    console.error(`Percorso cercato: ${keyPath}`);
    console.error('\nAssicurati di:');
    console.error('1. Aver scaricato il file .p8 da Apple Developer Console');
    console.error('2. Averlo salvato nella stessa directory di questo script');
    console.error('3. Aver aggiornato PRIVATE_KEY_PATH con il nome corretto del file');
    process.exit(1);
  }

  // Leggi la chiave privata
  const privateKey = fs.readFileSync(keyPath, 'utf8');

  // Verifica che sia una chiave valida
  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    console.error('❌ ERRORE: Il file .p8 non sembra essere una chiave privata valida');
    process.exit(1);
  }

  // Calcola i timestamp
  const now = Math.floor(Date.now() / 1000);
  const expiration = now + 15777000; // 6 mesi (15777000 secondi)

  // Crea il JWT
  const token = jwt.sign(
    {
      iss: TEAM_ID,
      iat: now,
      exp: expiration,
      aud: 'https://appleid.apple.com',
      sub: SERVICES_ID,
    },
    privateKey,
    {
      algorithm: 'ES256',
      header: {
        alg: 'ES256',
        kid: KEY_ID,
      },
    }
  );

  console.log('\n✅ JWT generato con successo!\n');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('COPIA QUESTO JWT E INCOLLALO IN SUPABASE:');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(token);
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('\n📋 Informazioni JWT:');
  console.log(`   Team ID: ${TEAM_ID}`);
  console.log(`   Key ID: ${KEY_ID}`);
  console.log(`   Services ID: ${SERVICES_ID}`);
  console.log(`   Scadenza: ${new Date(expiration * 1000).toLocaleString()}`);
  console.log('\n⚠️  IMPORTANTE:');
  console.log('   1. Copia il JWT sopra e incollalo in Supabase > Authentication > Providers > Apple > Secret Key');
  console.log('   2. ELIMINA questo script e il file .p8 dopo l\'uso (per sicurezza)');
  console.log('   3. NON committare mai il file .p8 nel repository Git\n');
} catch (error) {
  console.error('\n❌ ERRORE durante la generazione del JWT:');
  console.error(error.message);
  console.error('\nVerifica che:');
  console.error('1. jsonwebtoken sia installato: npm install jsonwebtoken');
  console.error('2. I valori TEAM_ID, KEY_ID, SERVICES_ID siano corretti');
  console.error('3. Il percorso al file .p8 sia corretto');
  process.exit(1);
}
