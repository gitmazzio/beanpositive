# Guida alla Configurazione del Login con Apple per Expo iOS

Questa guida ti accompagnerà passo passo nella configurazione del login con Apple (Sign in with Apple) per la tua app **Expo iOS** utilizzando Supabase.

## Indice

1. [Prerequisiti](#prerequisiti)
2. [Configurazione Apple Developer Console](#1-configurazione-apple-developer-console)
3. [Configurazione Supabase](#2-configurazione-supabase)
4. [Configurazione Expo per iOS](#3-configurazione-expo-per-ios)
5. [Verifica della Configurazione](#4-verifica-della-configurazione)
6. [Risoluzione Problemi Specifici iOS](#5-risoluzione-problemi-specifici-ios)

---

## Prerequisiti

Prima di iniziare, assicurati di avere:

- Un account **Apple Developer** attivo (programma gratuito o a pagamento)
- Un progetto Supabase creato e accessibile
- Accesso a [Apple Developer Console](https://developer.apple.com/account/)
- Le variabili d'ambiente del progetto configurate (`EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_KEY`)
- **Xcode installato** (per test su simulatore/dispositivo iOS)
- **Expo CLI** installato globalmente: `npm install -g expo-cli`

### Informazioni Richieste dalla Tua App

Prima di iniziare, raccogli queste informazioni dal tuo progetto:

- **Bundle Identifier iOS**: `com.beanpositive.app` (dal tuo `app.json`)
- **Team ID**: Il tuo Team ID Apple Developer (lo trovi in Apple Developer Console)
- **Supabase Project URL**: `https://[TUO-PROGETTO-SUPABASE].supabase.co`

### Tempo Stimato

- Configurazione base: ~25-30 minuti
- Configurazione completa: ~35-45 minuti

⚠️ **Nota Importante**: Sign in with Apple è disponibile **solo su iOS** (e macOS). Non funziona su Android o Web tramite Expo.

---

## 1. Configurazione Apple Developer Console

### Passo 1.1: Accedi a Apple Developer Console

1. Vai su [Apple Developer Console](https://developer.apple.com/account/)
2. Accedi con il tuo account Apple Developer
3. Se non hai ancora un account, puoi crearlo gratuitamente (per sviluppo) o iscriverti al programma Developer ($99/anno per pubblicare su App Store)

### Passo 1.2: Crea o Verifica il tuo App ID

1. Nel menu laterale, vai su **"Certificates, Identifiers & Profiles"**
2. Clicca su **"Identifiers"** nel menu laterale
3. Cerca o crea un **App ID** con il Bundle Identifier: `com.beanpositive.app`

**Se devi creare un nuovo App ID**:

1. Clicca sul pulsante **"+"** in alto a destra
2. Seleziona **"App IDs"** e clicca su **"Continue"**
3. Seleziona **"App"** e clicca su **"Continue"**
4. Compila i campi:
   - **Description**: Bean Positive (o un nome descrittivo)
   - **Bundle ID**: Seleziona **"Explicit"** e inserisci `com.beanpositive.app`
5. Scorri verso il basso e seleziona **"Sign In with Apple"** nelle capabilities
6. Clicca su **"Continue"** e poi su **"Register"**

**Se l'App ID esiste già**:

1. Clicca sull'App ID esistente
2. Verifica che **"Sign In with Apple"** sia selezionato nelle capabilities
3. Se non lo è, clicca su **"Edit"**, seleziona **"Sign In with Apple"**, e salva

### Passo 1.3: Crea un Services ID

Il Services ID è necessario per configurare il callback OAuth con Supabase.

1. In **"Identifiers"**, clicca sul pulsante **"+"** in alto a destra
2. Seleziona **"Services IDs"** e clicca su **"Continue"**
3. Compila i campi:
   - **Description**: Bean Positive Web Auth (o un nome descrittivo)
   - **Identifier**: Crea un identificatore univoco, ad esempio: `com.beanpositive.app.web`
4. Clicca su **"Continue"** e poi su **"Register"**

### Passo 1.4: Configura il Services ID per Sign in with Apple

1. Clicca sul Services ID che hai appena creato
2. Seleziona la checkbox **"Sign In with Apple"**
3. Clicca su **"Configure"** accanto a "Sign In with Apple"

4. Nella finestra di configurazione:
   - **Primary App ID**: Seleziona il tuo App ID (`com.beanpositive.app`)
   - **Website URLs**:
     - **Domains**: Aggiungi il dominio di Supabase: `[TUO-PROGETTO-SUPABASE].supabase.co`
       - Esempio: `abcdefghijklmnop.supabase.co`
     - **Return URLs**: Aggiungi l'URL di callback di Supabase:
       ```
       https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback
       ```
       - Sostituisci `[TUO-PROGETTO-SUPABASE]` con il tuo progetto Supabase
       - Esempio: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`

5. Clicca su **"Next"** e poi su **"Done"**
6. Clicca su **"Continue"** e poi su **"Save"**

### Passo 1.5: Crea una Key per JWT (JSON Web Token)

Supabase richiede una Key per verificare i token JWT di Apple.

1. In **"Certificates, Identifiers & Profiles"**, vai su **"Keys"**
2. Clicca sul pulsante **"+"** in alto a destra
3. Compila i campi:
   - **Key Name**: Bean Positive Apple Auth Key (o un nome descrittivo)
   - Seleziona la checkbox **"Sign In with Apple"**
4. Clicca su **"Configure"** accanto a "Sign In with Apple"
5. Seleziona il tuo **Primary App ID**: `com.beanpositive.app`
6. Clicca su **"Save"** e poi su **"Continue"**
7. Clicca su **"Register"**

⚠️ **IMPORTANTE**: Dopo aver creato la Key, Apple ti mostrerà la **Key ID** e ti permetterà di scaricare il file `.p8` **UNA SOLA VOLTA**.

8. **Salva immediatamente**:
   - **Key ID**: Copia e salva questo valore (es: `ABC123DEF4`)
   - **File .p8**: Scarica e salva il file in un posto sicuro (non committarlo nel repository Git!)

### Passo 1.6: Ottieni il tuo Team ID

1. In Apple Developer Console, vai su **"Membership"** nel menu laterale
2. Trova il tuo **Team ID** (è una stringa di 10 caratteri, es: `ABC123DEF4`)
3. Copia e salva questo valore

---

## 2. Configurazione Supabase

### Passo 2.1: Accedi al Dashboard Supabase

1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Accedi al tuo progetto (o creane uno nuovo se necessario)

### Passo 2.2: Configura il Provider Apple

1. Nel menu laterale, vai su **"Authentication"** > **"Providers"**
2. Trova **"Apple"** nella lista dei provider
3. Clicca per aprire le impostazioni di Apple
4. Attiva il toggle **"Enable Apple provider"**

### Passo 2.3: Genera il Secret Key (JWT)

⚠️ **IMPORTANTE**: Supabase richiede un **JWT (JSON Web Token)** generato dalla chiave privata `.p8`, non la chiave privata stessa.

#### Opzione A: Usa il Tool di Supabase (Consigliato - Più Semplice)

Supabase fornisce un tool integrato per generare il JWT direttamente nel browser:

1. Vai alla [documentazione Supabase per Apple Sign In](https://supabase.com/docs/guides/auth/social-login/auth-apple#generate-a-client_secret)
2. Scorri fino alla sezione **"Generate a client secret"**
3. Troverai un tool interattivo dove puoi:
   - Caricare il file `.p8` che hai scaricato da Apple Developer Console
   - Inserire il tuo **Team ID**
   - Inserire il tuo **Key ID**
   - Inserire il tuo **Services ID**
4. Clicca su **"Generate Secret"**
5. Il tool genererà automaticamente il JWT
6. **Copia il JWT generato** (una stringa lunga che inizia con `eyJ...`)

⚠️ **Nota**: Il tool funziona solo in Firefox o Chrome-based browser (non funziona in Safari).

#### Opzione B: Usa lo Script Node.js

Se preferisci generare il JWT localmente, puoi usare lo script Node.js fornito:

1. **Installa la dipendenza** `jsonwebtoken`:

```bash
npm install jsonwebtoken
```

2. **Modifica lo script** `scripts/generate-apple-jwt.js`:
   - Apri il file `apps/mobile-app/scripts/generate-apple-jwt.js`
   - Sostituisci i valori con le tue credenziali:
     - `TEAM_ID`: Il tuo Team ID (10 caratteri)
     - `KEY_ID`: La tua Key ID (10 caratteri)
     - `SERVICES_ID`: Il tuo Services ID (es: `com.beanpositive.app.web`)
     - `PRIVATE_KEY_PATH`: Il percorso al file `.p8` (es: `./AuthKey_ABC123DEF4.p8`)

3. **Posiziona il file .p8**:
   - Metti il file `.p8` scaricato da Apple Developer Console nella stessa directory dello script (`apps/mobile-app/scripts/`)
   - Oppure aggiorna `PRIVATE_KEY_PATH` con il percorso corretto

4. **Esegui lo script**:

```bash
node apps/mobile-app/scripts/generate-apple-jwt.js
```

5. **Copia il JWT generato**

6. **⚠️ ELIMINA lo script e il file .p8** dopo aver generato il JWT (per sicurezza)

### Passo 2.4: Inserisci le Credenziali Apple in Supabase

Compila i campi con le informazioni raccolte:

1. **Services ID**: Inserisci il Services ID che hai creato (es: `com.beanpositive.app.web`)

2. **Secret Key**: Incolla il **JWT generato** (non il contenuto del file .p8!)
   - Il JWT è una stringa lunga che inizia con `eyJ...`
   - Esempio: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Usa il JWT generato dal tool di Supabase o dallo script Node.js

3. **Key ID**: Inserisci la Key ID che hai salvato (es: `ABC123DEF4`)

4. **Team ID**: Inserisci il tuo Team ID (es: `ABC123DEF4`)

5. Clicca su **"Save"**

⚠️ **IMPORTANTE**: Il JWT generato è valido per 6 mesi. Dovrai rigenerarlo periodicamente. Imposta un promemoria nel calendario per ricordarti di rigenerarlo ogni 6 mesi.

### Passo 2.5: Verifica gli URL di Reindirizzamento

Supabase genererà automaticamente un URL di callback. Verifica che corrisponda a quello configurato in Apple Developer Console:

1. In Supabase, vai su **"Authentication"** > **"URL Configuration"**
2. Trova l'URL nella sezione **"Redirect URLs"**
3. Assicurati che questo URL sia presente nel Services ID in Apple Developer Console:
   ```
   https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback
   ```

**Nota**: Puoi anche accedere all'URL di callback direttamente dalla pagina del provider Apple nel Dashboard di Supabase.

---

## 3. Configurazione Expo per iOS

### Passo 3.1: Installa la Dipendenza

Installa il pacchetto `expo-apple-authentication`:

```bash
npm install expo-apple-authentication
```

Oppure con yarn:

```bash
yarn add expo-apple-authentication
```

### Passo 3.2: Verifica la Configurazione di app.json

Verifica che il tuo `app.json` sia configurato correttamente per iOS:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.beanpositive.app",
      "entitlements": {
        "aps-environment": "production",
        "com.apple.developer.applesignin": ["Default"]
      }
    },
    "plugins": [
      "expo-apple-authentication"
    ]
  }
}
```

**Verifica**:

- ✅ `bundleIdentifier` è `"com.beanpositive.app"` (deve corrispondere all'App ID in Apple Developer Console)
- ✅ `entitlements` contiene `"com.apple.developer.applesignin": ["Default"]`
- ✅ `expo-apple-authentication` è presente nella lista dei `plugins`

### Passo 3.3: Verifica le Variabili d'Ambiente

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

### Passo 3.4: Build dell'App per iOS

⚠️ **IMPORTANTE**: Per testare il login con Apple su iOS, devi creare un build nativo. Non funzionerà con Expo Go.

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

### Passo 3.5: Verifica Info.plist (Se Necessario)

Se stai usando `expo prebuild`, verifica che l'Info.plist contenga la configurazione corretta. Expo dovrebbe gestirlo automaticamente, ma puoi verificare:

1. Apri `ios/[PROJECT-NAME]/Info.plist` in Xcode
2. Verifica che non ci siano errori di configurazione

**Nota**: Se usi solo `expo run:ios` senza `prebuild`, Expo gestirà automaticamente questa configurazione.

---

## 4. Verifica della Configurazione

### Passo 4.1: Test su iOS Simulator

⚠️ **IMPORTANTE**: Sign in with Apple **NON funziona sul simulatore iOS**. Devi testare su un **dispositivo fisico**.

### Passo 4.2: Test su Dispositivo iOS Fisico

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
5. Nella app, vai alla schermata di login
6. Clicca su **"Continua con Apple"**
7. Dovresti vedere la schermata di autenticazione Apple nativa
8. Seleziona un account Apple o crea un nuovo account
9. Autorizza l'applicazione
10. Dovresti essere loggato automaticamente nell'app

### Passo 4.3: Verifica del Flusso di Autenticazione

Per verificare che tutto funzioni correttamente:

1. Dopo aver cliccato "Continua con Apple" e completato l'autenticazione
2. L'app dovrebbe loggarti automaticamente
3. Verifica che l'utente sia presente nella tabella `auth.users` in Supabase
4. Verifica che il provider sia `apple`

---

## 5. Risoluzione Problemi Specifici iOS

### Problema: "Sign in with Apple is not available"

**Causa**: L'App ID non ha "Sign In with Apple" abilitato o l'entitlement non è configurato correttamente.

**Soluzione**:

1. Verifica che l'App ID in Apple Developer Console abbia **"Sign In with Apple"** selezionato
2. Verifica che `app.json` contenga:
   ```json
   {
     "expo": {
       "ios": {
         "entitlements": {
           "com.apple.developer.applesignin": ["Default"]
         }
       },
       "plugins": ["expo-apple-authentication"]
     }
   }
   ```
3. Riavvia completamente l'app dopo aver modificato `app.json`:
   ```bash
   npx expo prebuild --clean
   npx expo run:ios
   ```

### Problema: "Secret key should be a JWT" o "Invalid credentials"

**Causa**: Hai inserito il contenuto del file `.p8` invece del JWT generato.

**Soluzione**:

1. **NON inserire** il contenuto del file `.p8` direttamente in Supabase
2. Devi **generare un JWT** dalla chiave privata usando:
   - Il tool di Supabase (consigliato): https://supabase.com/docs/guides/auth/social-login/auth-apple#generate-a-client_secret
   - Oppure lo script Node.js fornito (vedi Passo 2.3, Opzione B)
3. Il JWT è una stringa lunga che inizia con `eyJ...`
4. Inserisci solo il JWT nel campo "Secret Key" in Supabase

### Problema: "Invalid client" o "Invalid credentials" (dopo aver inserito il JWT)

**Causa**: Services ID, Key ID, Team ID o JWT errati in Supabase.

**Soluzione**:

1. Verifica che il Services ID in Supabase corrisponda esattamente a quello in Apple Developer Console
2. Verifica che la Key ID sia corretta (senza spazi)
3. Verifica che il Team ID sia corretto
4. Verifica che il JWT sia valido e non scaduto (i JWT hanno una scadenza di 6 mesi)
5. Rigenera il JWT se necessario usando il tool di Supabase o lo script Node.js

### Problema: "redirect_uri_mismatch"

**Causa**: L'URL di callback configurato in Apple Developer Console non corrisponde a quello di Supabase.

**Soluzione**:

1. In Apple Developer Console, vai al Services ID
2. Verifica che il Return URL sia esattamente: `https://[TUO-PROGETTO-SUPABASE].supabase.co/auth/v1/callback`
3. Assicurati che non ci siano spazi o caratteri extra
4. Verifica che il dominio corrisponda: `[TUO-PROGETTO-SUPABASE].supabase.co`

### Problema: Il login funziona ma l'utente non viene loggato

**Causa**: Problema con la gestione della sessione o con il token.

**Soluzione**:

1. Verifica che `expo-apple-authentication` sia installato:
   ```bash
   npm install expo-apple-authentication
   ```
2. Controlla i log della console in Xcode per eventuali errori
3. Verifica che il metodo `loginWithApple` in `AuthProvider.tsx` gestisca correttamente il token
4. Assicurati che `onAuthStateChange` sia configurato correttamente

### Problema: "The operation couldn't be completed" su iOS

**Causa**: Problema con la configurazione dell'App ID o con i permessi.

**Soluzione**:

1. Verifica che l'App ID in Apple Developer Console abbia "Sign In with Apple" abilitato
2. Verifica che il Bundle ID in `app.json` corrisponda esattamente all'App ID
3. Assicurati di testare su un dispositivo fisico (non sul simulatore)
4. Verifica che l'app sia firmata correttamente con il tuo certificato di sviluppo

### Problema: Non vedo il bottone "Continua con Apple"

**Causa**: Il bottone è configurato per apparire solo su iOS.

**Soluzione**:

1. Verifica che stai testando su iOS (non su Android o Web)
2. Verifica che il codice in `login.tsx` contenga:
   ```typescript
   {Platform.OS === "ios" ? (
     <Button ... title="Continua con Apple" />
   ) : null}
   ```

### Problema: "Apple Sign In is only available on iOS"

**Causa**: Stai cercando di usare Apple Sign In su una piattaforma diversa da iOS.

**Soluzione**:

- Apple Sign In è disponibile solo su iOS (e macOS)
- Su Android o Web, il bottone non dovrebbe apparire (è già gestito nel codice con `Platform.OS === "ios"`)

---

## Note Aggiuntive

### Sicurezza

- **Non committare mai** il file `.p8` (Secret Key) nel repository Git
- Aggiungi `*.p8` al tuo `.gitignore`
- Usa variabili d'ambiente per tutte le credenziali sensibili quando possibile
- Mantieni aggiornate le dipendenze del progetto

### Best Practices per iOS

1. **Test su Dispositivi Reali**: Sign in with Apple **NON funziona sul simulatore**. Devi sempre testare su dispositivi fisici.

2. **Bundle ID Unico**: Assicurati che il Bundle ID sia unico e corrisponda esattamente tra `app.json` e Apple Developer Console.

3. **Services ID Separato**: Usa un Services ID separato per l'autenticazione web (Supabase callback).

4. **Gestione Errori**: Implementa una gestione degli errori robusta per migliorare l'esperienza utente.

5. **Loading States**: Mostra indicatori di caricamento durante il processo di autenticazione.

### Differenze tra Apple e Google Sign In

- **Apple**: Usa autenticazione nativa iOS, più veloce e integrata
- **Apple**: Disponibile solo su iOS/macOS
- **Apple**: Richiede configurazione più complessa (Services ID, Key, Team ID)
- **Google**: Funziona su tutte le piattaforme
- **Google**: Usa OAuth web-based

### Privacy e Email

⚠️ **IMPORTANTE**: Con Sign in with Apple, l'utente può scegliere di nascondere la sua email reale. Apple fornirà un'email proxy (es: `abc123@privaterelay.appleid.com`). 

Supabase gestirà automaticamente questa email proxy. Se hai bisogno dell'email reale dell'utente, dovrai richiederla esplicitamente o usare altri metodi di autenticazione.

### Link Utili

- [Documentazione Ufficiale Supabase - Login con Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple)
- [Documentazione Expo - Apple Authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Apple Developer - Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
- [Apple Developer Console](https://developer.apple.com/account/)
- [Documentazione Apple - Configurazione Services ID](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user)

---

## Checklist Finale

Prima di considerare la configurazione completata, verifica:

### Apple Developer Console

- [ ] Account Apple Developer attivo
- [ ] App ID creato con Bundle ID: `com.beanpositive.app`
- [ ] "Sign In with Apple" abilitato nell'App ID
- [ ] Services ID creato (es: `com.beanpositive.app.web`)
- [ ] Services ID configurato con:
  - [ ] Primary App ID selezionato
  - [ ] Domain configurato: `[PROJECT].supabase.co`
  - [ ] Return URL configurato: `https://[PROJECT].supabase.co/auth/v1/callback`
- [ ] Key creata per JWT
- [ ] Key ID salvato
- [ ] File .p8 scaricato e salvato in modo sicuro
- [ ] Team ID copiato e salvato

### Supabase

- [ ] Provider Apple abilitato
- [ ] Services ID inserito correttamente
- [ ] Secret Key (contenuto .p8) inserito correttamente
- [ ] Key ID inserito correttamente
- [ ] Team ID inserito correttamente
- [ ] URL di callback verificato nella configurazione

### Applicazione Expo iOS

- [ ] Dipendenza installata: `expo-apple-authentication`
- [ ] Variabili d'ambiente configurate (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`)
- [ ] Bundle Identifier corrisponde: `com.beanpositive.app`
- [ ] Entitlement configurato: `"com.apple.developer.applesignin": ["Default"]`
- [ ] Plugin configurato: `"expo-apple-authentication"` in `app.json`
- [ ] Build nativo creato (non Expo Go)
- [ ] Login con Apple testato su dispositivo iOS fisico
- [ ] Logout funzionante dopo login Apple
- [ ] Gestione errori implementata
- [ ] Stati di loading implementati

---

**Buona fortuna con l'implementazione! 🚀**
