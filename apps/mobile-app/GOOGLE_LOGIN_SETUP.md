# Guida alla Configurazione del Login con Google per Expo iOS

Questa guida ti accompagnerà passo passo nella configurazione del login con Google per la tua app **Expo iOS** utilizzando Supabase.

## Indice

1. [Prerequisiti](#prerequisiti)
2. [Configurazione Google Cloud Console per iOS](#1-configurazione-google-cloud-console-per-ios)
3. [Configurazione Supabase](#2-configurazione-supabase)
4. [Configurazione Expo per iOS](#3-configurazione-expo-per-ios)
5. [Verifica della Configurazione](#4-verifica-della-configurazione)
6. [Risoluzione Problemi Specifici iOS](#5-risoluzione-problemi-specifici-ios)

---

## Prerequisiti

Prima di iniziare, assicurati di avere:

- Un account Google attivo
- Un progetto Supabase creato e accessibile
- Accesso al [Google Cloud Console](https://console.cloud.google.com/)
- Accesso al [Google Auth Platform Console](https://console.cloud.google.com/apis/credentials/consent)
- Le variabili d'ambiente del progetto configurate (`EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_KEY`)
- **Xcode installato** (per test su simulatore/dispositivo iOS)
- **Expo CLI** installato globalmente: `npm install -g expo-cli`

### Informazioni Richieste dalla Tua App

Prima di iniziare, raccogli queste informazioni dal tuo progetto:

- **Bundle Identifier iOS**: `com.beanpositive.app` (dal tuo `app.json`)
- **URL Scheme**: `mobileapp` (dal tuo `app.json`)
- **Supabase Project URL**: `https://[TUO-PROGETTO-SUPABASE].supabase.co`

### Tempo Stimato

- Configurazione base: ~20-25 minuti
- Configurazione completa con branding: ~35-50 minuti

⚠️ **Nota Importante**: Per iOS, è necessario creare un **Client ID OAuth separato** di tipo "iOS". Non puoi usare lo stesso Client ID del Web.

---

## 1. Configurazione Google Cloud Console per iOS

### Passo 1.1: Accedi a Google Cloud Console

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Accedi con il tuo account Google
3. Se non hai ancora un progetto, creane uno nuovo:
   - Clicca sul menu a tendina dei progetti in alto
   - Clicca su "Nuovo progetto"
   - Inserisci un nome (es: "Bean Positive")
   - Clicca su "Crea"

### Passo 1.2: Accedi a Google Auth Platform Console

1. Vai su [Google Auth Platform Console](https://console.cloud.google.com/apis/credentials/consent)
2. Seleziona il progetto che hai creato

### Passo 1.3: Configura la Schermata di Consenso OAuth

La schermata di consenso OAuth è ciò che gli utenti vedranno quando si autenticano con Google. È importante configurarla correttamente per aumentare la fiducia degli utenti.

1. Nel menu laterale, vai su **"API e servizi"** > **"Schermata di consenso OAuth"**
2. Seleziona **"Esterno"** (per app pubbliche) o **"Interno"** (solo per account Google Workspace)
3. Clicca su **"Crea"**
4. Compila i campi obbligatori:
   - **Nome app**: Bean Positive (o il nome della tua app)
   - **Email di supporto utente**: La tua email
   - **Logo dell'app**: (opzionale ma consigliato) Carica un logo se disponibile
   - **Dominio autorizzato**: (opzionale) Il dominio del tuo sito web
5. Clicca su **"Salva e continua"**

### Passo 1.4: Configura gli Scopes Richiesti

Supabase Auth richiede alcuni scope specifici per accedere ai dati del profilo degli utenti:

1. Nella sezione **"Scopes"**, verifica che siano presenti:
   - `openid` (devi aggiungerlo manualmente se non è presente)
   - `.../auth/userinfo.email` (aggiunto di default)
   - `.../auth/userinfo.profile` (aggiunto di default)

2. **IMPORTANTE**: Se aggiungi scope aggiuntivi, specialmente quelli nella lista "sensitive" o "restricted", la tua applicazione potrebbe essere soggetta a verifica da parte di Google, che può richiedere molto tempo.

3. Clicca su **"Salva e continua"**

### Passo 1.5: Configura il Branding (Consigliato)

⚠️ **Nota**: La verifica del brand non è automatica e può richiedere alcuni giorni lavorativi.

Configurare il branding migliora significativamente la percezione di fiducia da parte degli utenti:

1. Nella sezione **"Branding"**:
   - Configura il logo e il nome dell'applicazione
   - Questo farà apparire il tuo logo e nome invece dell'ID del progetto Supabase nella schermata di consenso

2. **Setup di un Dominio Personalizzato** (Opzionale ma Fortemente Consigliato):
   - Configura un dominio personalizzato per il tuo progetto Supabase (es: `auth.example.com` o `api.example.com`)
   - Questo mostra agli utenti una chiara relazione con il sito web su cui hanno cliccato "Accedi con Google"
   - Se non configuri questo, gli utenti vedranno `<project-id>.supabase.co`, che non ispira fiducia

3. Clicca su **"Salva e continua"**

### Passo 1.6: Configura gli Utenti di Test

1. Nella sezione **"Utenti di test"**, aggiungi eventuali email di test se necessario
   - Questo è importante durante lo sviluppo se l'app è in modalità test
2. Clicca su **"Salva e continua"** e poi su **"Torna alla dashboard"**

### Passo 1.7: Crea le Credenziali OAuth 2.0 per iOS

⚠️ **IMPORTANTE per iOS**: Devi creare un Client ID separato di tipo **"iOS"**. Non puoi usare lo stesso Client ID del Web.

1. Nel menu laterale, vai su **"API e servizi"** > **"Credenziali"**
2. Clicca su **"+ Crea credenziali"** > **"ID client OAuth"**
3. Seleziona **"iOS"** come tipo di applicazione
4. Compila i campi:
   - **Nome**: Bean Positive iOS Client (o un nome descrittivo)
   - **Bundle ID**: `com.beanpositive.app`
     - Questo deve corrispondere esattamente al `bundleIdentifier` nel tuo `app.json`
5. Clicca su **"Crea"**
6. **IMPORTANTE**: Copia e salva il **Client ID iOS**
   - ⚠️ **Nota**: Per iOS, Google non fornisce un Client Secret. Solo il Client ID è necessario.

### Passo 1.8: Crea le Credenziali OAuth 2.0 per Web (Richiesto per Supabase)

Supabase richiede anche un Client ID Web per gestire il callback OAuth:

1. Clicca su **"+ Crea credenziali"** > **"ID client OAuth"** di nuovo
2. Seleziona **"Applicazione Web"** come tipo di applicazione
3. Compila i campi:
   - **Nome**: Bean Positive Web Client (o un nome descrittivo)
   - **Origini JavaScript autorizzate**: (opzionale per iOS, ma utile se hai anche un'app web)
   - **URI di reindirizzamento autorizzati**:
     ```
     https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback
     ```
     Sostituisci `[TUO-PROGETTO-SUPABASE]` con il tuo progetto Supabase (es: `abcdefghijklmnop`)

4. Clicca su **"Crea"**
5. **IMPORTANTE**: Copia e salva:
   - **ID client** (Client ID Web)
   - **Segreto client** (Client Secret Web)
   - ⚠️ **Nota**: Il Client Secret verrà mostrato solo una volta. Assicurati di salvarlo in un posto sicuro!

### Passo 1.9: Configurazione URI di Reindirizzamento (Nota Importante)

⚠️ **IMPORTANTE**: Google Cloud Console **NON accetta** URL scheme personalizzati (come `mobileapp://`) nel Client ID Web. Questo è normale e corretto!

Il flusso OAuth per Expo iOS funziona così:

1. L'app chiama Supabase con `redirectTo: mobileapp://auth/callback`
2. Supabase gestisce il callback OAuth con Google usando solo l'URL `https://[PROJECT].supabase.co/auth/v1/callback`
3. Google reindirizza a Supabase (questo URL deve essere nel Client ID Web)
4. Supabase poi reindirizza all'app usando `mobileapp://auth/callback` (configurato in Supabase, non in Google)

**Quindi nel Client ID Web devi avere SOLO**:

- ✅ `https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback`

**NON aggiungere**:

- ❌ `mobileapp://auth/callback` (non è necessario e Google potrebbe rifiutarlo)

L'URI `mobileapp://auth/callback` verrà configurato solo in Supabase (vedi Passo 2.4).

---

## 2. Configurazione Supabase

### Passo 2.1: Accedi al Dashboard Supabase

1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Accedi al tuo progetto (o creane uno nuovo se necessario)

### Passo 2.2: Configura il Provider Google

1. Nel menu laterale, vai su **"Authentication"** > **"Providers"**
2. Trova **"Google"** nella lista dei provider
3. Clicca per aprire le impostazioni di Google
4. Attiva il toggle **"Enable Google provider"**

### Passo 2.3: Inserisci le Credenziali Google

⚠️ **IMPORTANTE per iOS**: Devi concatenare i Client ID separati da virgola, con il Client ID Web per primo.

1. Nel campo **"Client ID (for OAuth)"**, inserisci:

   ```
   [WEB-CLIENT-ID],[IOS-CLIENT-ID]
   ```

   Esempio: `123456789-abcdefghijklmnop.apps.googleusercontent.com,987654321-zyxwvutsrqponml.apps.googleusercontent.com`
   - Il **Client ID Web** deve essere il primo
   - Il **Client ID iOS** deve essere il secondo
   - Separati da una virgola senza spazi

2. Nel campo **"Client Secret (for OAuth)"**, incolla il **Client Secret Web** copiato da Google Cloud Console
   - ⚠️ **Nota**: Solo il Client Secret Web è necessario. iOS non usa Client Secret.

3. Clicca su **"Save"**

### Passo 2.4: Configura gli URL di Reindirizzamento

Supabase gestisce due tipi di redirect URLs:

1. **URL di callback per Google** (deve essere in Google Cloud Console):
   - In Supabase, vai su **"Authentication"** > **"URL Configuration"**
   - Trova l'URL nella sezione **"Redirect URLs"**
   - Assicurati che questo URL sia presente in Google Cloud Console (nel Client ID Web):
     ```
     https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback
     ```

2. **URL scheme per deep linking iOS** (configurato automaticamente):
   - L'URL `mobileapp://auth/callback` viene passato dall'app a Supabase tramite il parametro `redirectTo`
   - Supabase lo usa per reindirizzare l'app dopo l'autenticazione
   - **NON** deve essere aggiunto in Google Cloud Console
   - Viene gestito automaticamente da Expo e Supabase

**Nota**: Puoi anche accedere all'URL di callback direttamente dalla pagina del provider Google nel Dashboard di Supabase.

---

## 3. Configurazione Expo per iOS

### Passo 3.1: Verifica la Configurazione di app.json

Verifica che il tuo `app.json` sia configurato correttamente per iOS:

```json
{
  "expo": {
    "scheme": "mobileapp",
    "ios": {
      "bundleIdentifier": "com.beanpositive.app",
      "googleServicesFile": "./services/GoogleService-Info.plist"
    }
  }
}
```

**Verifica**:

- ✅ `scheme` è impostato su `"mobileapp"` (deve corrispondere all'URI di reindirizzamento)
- ✅ `bundleIdentifier` è `"com.beanpositive.app"` (deve corrispondere al Bundle ID in Google Cloud Console)
- ✅ `googleServicesFile` punta al file GoogleService-Info.plist (se lo usi per altri servizi Google)

### Passo 3.1.1: GoogleService-Info.plist - Quando è Necessario?

⚠️ **IMPORTANTE**: Il file `GoogleService-Info.plist` **NON è necessario** per il login OAuth con Google tramite Supabase.

Tuttavia, se stai usando altri servizi Google (come Firebase per notifiche push, Analytics, ecc.), potresti aver bisogno di questo file.

#### Se NON usi Firebase o altri servizi Google SDK:

Puoi rimuovere o commentare la riga `googleServicesFile` dal tuo `app.json`:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.beanpositive.app"
      // "googleServicesFile": "./services/GoogleService-Info.plist"  // Non necessario per OAuth
    }
  }
}
```

#### Se usi Firebase o altri servizi Google SDK:

Devi scaricare il file `GoogleService-Info.plist` da Firebase Console:

1. **Vai su Firebase Console**:
   - Accedi a [Firebase Console](https://console.firebase.google.com/)
   - Seleziona il tuo progetto (o creane uno nuovo)

2. **Aggiungi un'app iOS**:
   - Clicca sull'icona iOS (+) per aggiungere un'app iOS
   - Inserisci il Bundle ID: `com.beanpositive.app`
   - Inserisci un nome app (es: "Bean Positive")
   - Clicca su "Registra app"

3. **Scarica GoogleService-Info.plist**:
   - Dopo la registrazione, Firebase ti mostrerà un pulsante per scaricare `GoogleService-Info.plist`
   - Clicca su "Scarica GoogleService-Info.plist"
   - Salva il file in `apps/mobile-app/services/GoogleService-Info.plist`

4. **Verifica il file**:
   - Il file dovrebbe contenere informazioni come:
     - `CLIENT_ID`
     - `REVERSED_CLIENT_ID`
     - `BUNDLE_ID`
     - Altri parametri Firebase se necessario

5. **Aggiorna il file se necessario**:
   - Se hai già un file `GoogleService-Info.plist` ma vuoi aggiornarlo:
     - Vai su Firebase Console > Project Settings > Your apps > iOS app
     - Clicca su "Scarica GoogleService-Info.plist" di nuovo
     - Sostituisci il file esistente

**Nota**: Il `CLIENT_ID` nel `GoogleService-Info.plist` potrebbe essere diverso dal Client ID OAuth che hai creato per il login. Questo è normale - sono per scopi diversi.

### Passo 3.2: Verifica le Variabili d'Ambiente

Assicurati che nel tuo progetto siano configurate le variabili d'ambiente. Crea o verifica il file `.env` nella root del progetto:

```env
EXPO_PUBLIC_SUPABASE_URL=https://[TUO-PROGETTO-SUPABASE].supabase.co
EXPO_PUBLIC_SUPABASE_KEY=[LA-TUA-ANON-KEY]
```

Dove:

- `EXPO_PUBLIC_SUPABASE_URL`: La URL del tuo progetto Supabase
- `EXPO_PUBLIC_SUPABASE_KEY`: La chiave anonima (anon key) del tuo progetto Supabase

Puoi trovare queste informazioni in Supabase:

- Dashboard > **"Settings"** > **"API"**
- **"Project URL"** = `EXPO_PUBLIC_SUPABASE_URL`
- **"anon public"** key = `EXPO_PUBLIC_SUPABASE_KEY`

### Passo 3.3: Verifica le Dipendenze Installate

Assicurati che le dipendenze necessarie siano installate:

```bash
npm install expo-auth-session expo-web-browser
```

Verifica nel tuo `package.json` che siano presenti:

- `expo-auth-session`: ^7.0.8
- `expo-web-browser`: ^14.2.0

### Passo 3.4: Build dell'App per iOS

⚠️ **IMPORTANTE**: Per testare il login con Google su iOS, devi creare un build nativo. Non funzionerà con Expo Go.

#### Opzione A: Build Locale con EAS Build

1. Installa EAS CLI se non l'hai già fatto:

   ```bash
   npm install -g eas-cli
   ```

2. Accedi a Expo:

   ```bash
   eas login
   ```

3. Configura il progetto:

   ```bash
   eas build:configure
   ```

4. Crea un build iOS per sviluppo:
   ```bash
   eas build --platform ios --profile development
   ```

#### Opzione B: Build Locale con Expo Development Build

1. Installa le dipendenze native:

   ```bash
   npx expo prebuild --clean
   ```

2. Apri il progetto in Xcode:
   ```bash
   npx expo run:ios
   ```

### Passo 3.5: Configurazione Info.plist (Se Necessario)

Se stai usando `expo prebuild`, potresti dover configurare manualmente l'Info.plist per il deep linking:

1. Apri `ios/[PROJECT-NAME]/Info.plist` in Xcode
2. Verifica che sia presente la configurazione per URL Schemes:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>mobileapp</string>
       </array>
     </dict>
   </array>
   ```

**Nota**: Se usi solo `expo run:ios` senza `prebuild`, Expo gestirà automaticamente questa configurazione.

---

## 4. Verifica della Configurazione

### Passo 4.1: Test su iOS Simulator

1. Avvia il simulatore iOS:

   ```bash
   npx expo run:ios
   ```

2. Oppure se hai già fatto il build:

   ```bash
   npx expo start --ios
   ```

3. Nella app, vai alla schermata di login
4. Clicca su **"Continua con Google"**
5. Dovresti vedere la schermata di autenticazione Google nel browser del simulatore
6. Seleziona un account Google
7. Autorizza l'applicazione
8. Dovresti essere reindirizzato automaticamente all'app e loggato

### Passo 4.2: Test su Dispositivo iOS Fisico

⚠️ **IMPORTANTE**: Il test su dispositivo fisico è fortemente consigliato per verificare il deep linking.

1. Collega il tuo iPhone/iPad al Mac
2. Assicurati che il dispositivo sia fidato e abilitato per lo sviluppo
3. Crea un build per dispositivo fisico:

   ```bash
   eas build --platform ios --profile development
   ```

   Oppure:

   ```bash
   npx expo run:ios --device
   ```

4. Installa l'app sul dispositivo
5. Testa il login con Google come descritto sopra

### Passo 4.3: Verifica del Deep Linking

Per verificare che il deep linking funzioni correttamente:

1. Dopo aver cliccato "Continua con Google" e completato l'autenticazione
2. L'app dovrebbe aprirsi automaticamente quando Google reindirizza a `mobileapp://auth/callback`
3. Se l'app non si apre automaticamente, controlla:
   - Che lo scheme `mobileapp` sia configurato correttamente in `app.json`
   - Che l'URI `mobileapp://auth/callback` sia presente in Google Cloud Console
   - I log della console per eventuali errori

---

## 5. Risoluzione Problemi Specifici iOS

### Problema: "redirect_uri_mismatch" su iOS

**Causa**: L'URI di reindirizzamento configurato in Google Cloud Console non corrisponde a quello utilizzato da Supabase.

**Soluzione**:

1. Verifica che l'URL di callback di Supabase sia presente negli "URI di reindirizzamento autorizzati" nel **Client ID Web** in Google Cloud Console
2. L'URL deve essere esattamente: `https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback`
3. Assicurati che non ci siano spazi o caratteri extra
4. ⚠️ **NON aggiungere** `mobileapp://auth/callback` in Google Cloud Console - questo non è necessario e Google potrebbe rifiutarlo
5. L'URL scheme `mobileapp://auth/callback` viene gestito automaticamente da Expo e Supabase

### Problema: "invalid_client" su iOS

**Causa**: Client ID o Client Secret errati in Supabase, o Bundle ID non corrispondente.

**Soluzione**:

1. Verifica che il Bundle ID in Google Cloud Console (`com.beanpositive.app`) corrisponda esattamente a quello in `app.json`
2. Verifica che i Client ID siano concatenati correttamente in Supabase: `[WEB-CLIENT-ID],[IOS-CLIENT-ID]`
3. Verifica che il Client Secret Web sia inserito correttamente (non quello iOS, che non esiste)
4. Controlla che non ci siano spazi prima o dopo le credenziali

### Problema: L'app non si apre dopo l'autenticazione su iOS

**Causa**: Lo scheme dell'app non è configurato correttamente o il deep linking non funziona.

**Soluzione**:

1. Verifica che nel file `app.json` sia presente:

   ```json
   {
     "expo": {
       "scheme": "mobileapp"
     }
   }
   ```

2. Verifica che lo scheme `mobileapp` sia configurato correttamente in `app.json` - questo viene gestito automaticamente da Expo e Supabase, non serve aggiungerlo in Google Cloud Console

3. Se hai fatto `expo prebuild`, verifica che l'Info.plist contenga la configurazione degli URL Schemes (vedi Passo 3.5)

4. Riavvia completamente l'app dopo aver modificato `app.json`:

   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   ```

5. Su dispositivo fisico, verifica che l'app sia installata e che iOS permetta il deep linking

### Problema: "Access blocked: This app's request is invalid" su iOS

**Causa**: La schermata di consenso OAuth non è configurata correttamente o l'app è in modalità test.

**Soluzione**:

1. Vai su Google Cloud Console > **"Schermata di consenso OAuth"**
2. Assicurati che tutti i campi obbligatori siano compilati
3. Se l'app è in modalità test, aggiungi l'email dell'utente nella sezione **"Utenti di test"**
4. Per app pubbliche, invia la richiesta di verifica se necessario

### Problema: Il login funziona su Web ma non su iOS

**Causa**: Probabilmente stai usando solo il Client ID Web e non hai creato/configurato il Client ID iOS.

**Soluzione**:

1. Crea un Client ID separato di tipo **"iOS"** in Google Cloud Console (vedi Passo 1.7)
2. Configura il Bundle ID corretto (`com.beanpositive.app`)
3. In Supabase, concatena i Client ID: `[WEB-CLIENT-ID],[IOS-CLIENT-ID]`
4. Riavvia l'app e riprova

### Problema: "Network request failed" su iOS Simulator

**Causa**: Problema con la configurazione del simulatore iOS o con la connessione.

**Soluzione**:

1. Prova su un dispositivo fisico invece del simulatore (consigliato)
2. Verifica la connessione internet del simulatore
3. Riavvia il simulatore
4. Verifica che l'app abbia i permessi di rete necessari

### Problema: L'autenticazione funziona ma l'utente non viene loggato

**Causa**: Problema con il flusso di callback o con la gestione della sessione.

**Soluzione**:

1. Verifica che `expo-auth-session` e `expo-web-browser` siano installati:

   ```bash
   npm install expo-auth-session expo-web-browser
   ```

2. Controlla i log della console in Xcode per eventuali errori:
   - Apri Xcode
   - Vai su Window > Devices and Simulators
   - Seleziona il dispositivo/simulatore
   - Clicca su "Open Console"

3. Verifica che il metodo `loginWithGoogle` in `AuthProvider.tsx` gestisca correttamente il callback

4. Assicurati che `WebBrowser.maybeCompleteAuthSession()` sia chiamato all'inizio del file (già presente nel codice)

### Problema: "The operation couldn't be completed" su iOS

**Causa**: Problema con il deep linking o con la configurazione dell'URL scheme.

**Soluzione**:

1. Verifica che lo scheme `mobileapp` sia unico e non conflitti con altre app
2. Prova a cambiare lo scheme in `app.json` a qualcosa di più specifico (es: `beanpositive`)
3. Aggiorna l'URI di reindirizzamento in Google Cloud Console di conseguenza
4. Riavvia completamente l'app

---

## Note Aggiuntive

### Sicurezza

- **Non committare mai** il Client Secret nel repository Git
- Usa variabili d'ambiente per tutte le credenziali sensibili
- Mantieni aggiornate le dipendenze del progetto
- Configura un dominio personalizzato per migliorare la sicurezza e la fiducia degli utenti

### Best Practices per iOS

1. **Test su Dispositivi Reali**: Testa sempre su dispositivi reali iOS, non solo su simulatori. Il deep linking può comportarsi diversamente.

2. **Bundle ID Unico**: Assicurati che il Bundle ID sia unico e corrisponda esattamente tra `app.json` e Google Cloud Console.

3. **Client ID Separati**: Usa sempre Client ID separati per Web e iOS. Non condividere lo stesso Client ID.

4. **Deep Linking**: Verifica sempre che il deep linking funzioni correttamente dopo l'autenticazione.

5. **Gestione Errori**: Implementa una gestione degli errori robusta per migliorare l'esperienza utente.

6. **Loading States**: Mostra indicatori di caricamento durante il processo di autenticazione.

### Differenze tra iOS e Web

- **iOS non richiede Client Secret**: Solo il Client ID è necessario per iOS
- **Deep Linking obbligatorio**: iOS richiede il deep linking per tornare all'app dopo l'autenticazione
- **Bundle ID**: Deve corrispondere esattamente tra Google Cloud Console e `app.json`
- **Build Nativa**: Non funziona con Expo Go, serve un build nativo

### Link Utili

- [Documentazione Ufficiale Supabase - Login con Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Documentazione Expo - Authentication](https://docs.expo.dev/guides/authentication/#google)
- [Documentazione Expo - Deep Linking](https://docs.expo.dev/guides/linking/)
- [Documentazione Google OAuth 2.0 per iOS](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Google Auth Platform Console](https://console.cloud.google.com/apis/credentials/consent)
- [Documentazione Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Documentazione Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/)

---

## Checklist Finale

Prima di considerare la configurazione completata, verifica:

### Google Cloud Console

- [ ] Progetto creato
- [ ] Google Auth Platform Console accessibile
- [ ] Schermata di consenso OAuth configurata
- [ ] Scopes configurati correttamente (`openid`, `userinfo.email`, `userinfo.profile`)
- [ ] Branding configurato (logo e nome app) - opzionale ma consigliato
- [ ] **Client ID iOS creato** con Bundle ID: `com.beanpositive.app`
- [ ] **Client ID Web creato** per Supabase callback
- [ ] Client Secret Web salvato in modo sicuro
- [ ] URI di reindirizzamento configurato correttamente nel Client ID Web:
  - [ ] URL callback Supabase: `https://[PROJECT].supabase.co/auth/v1/callback`
  - [ ] **NON** aggiungere `mobileapp://auth/callback` in Google Cloud Console (viene gestito automaticamente)

### Supabase

- [ ] Provider Google abilitato
- [ ] Client ID concatenati correttamente: `[WEB-CLIENT-ID],[IOS-CLIENT-ID]`
- [ ] Client Secret Web inserito correttamente
- [ ] URL di callback verificato nella configurazione

### Applicazione Expo iOS

- [ ] Variabili d'ambiente configurate (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`)
- [ ] Dipendenze installate (`expo-auth-session`, `expo-web-browser`)
- [ ] Scheme configurato in `app.json` (`"scheme": "mobileapp"`)
- [ ] Bundle Identifier corrisponde: `com.beanpositive.app`
- [ ] Build nativo creato (non Expo Go)
- [ ] Info.plist configurato correttamente (se usi `expo prebuild`)
- [ ] Login con Google testato su iOS Simulator
- [ ] Login con Google testato su dispositivo iOS fisico
- [ ] Deep linking funzionante (l'app si apre dopo l'autenticazione)
- [ ] Logout funzionante dopo login OAuth
- [ ] Gestione errori implementata
- [ ] Stati di loading implementati

---

**Buona fortuna con l'implementazione! 🚀**
