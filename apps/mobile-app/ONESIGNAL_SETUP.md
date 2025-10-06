# Configurazione OneSignal per Notifiche Push

## 1. OneSignal Dashboard Setup

### Passo 1: Crea un account OneSignal
1. Vai su [OneSignal Dashboard](https://app.onesignal.com/)
2. Crea un nuovo account o accedi al tuo account esistente
3. Crea una nuova app per "Bean Positive"

### Passo 2: Configura l'app per Android
1. Seleziona "Google Android (FCM)" come piattaforma
2. Inserisci:
   - **App Name**: Bean Positive
   - **Android Package Name**: `com.beanpositive.app`
   - **Google Server API Key**: (dalla Google Cloud Console)
   - **Google Project Number**: (dalla Google Cloud Console)

### Passo 3: Configura l'app per iOS
1. Aggiungi iOS come piattaforma
2. Inserisci:
   - **App Name**: Bean Positive
   - **iOS Bundle ID**: `com.beanpositive.app`
   - **APNs Auth Key**: (carica il file .p8 da Apple Developer)
   - **APNs Key ID**: (dalla Apple Developer Console)
   - **Team ID**: (dalla Apple Developer Console)

### Passo 4: Ottieni l'App ID
Dopo aver configurato entrambe le piattaforme, copia l'**App ID** di OneSignal.

## 2. Google Cloud Console (per Android)

### Passo 1: Crea un progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuovo progetto o seleziona un progetto esistente
3. Aggiungi un'app Android con package name `com.beanpositive.app`

### Passo 2: Configura Firebase Cloud Messaging
1. Vai su "Project Settings" > "Cloud Messaging"
2. Copia il **Server Key** e **Sender ID**
3. Scarica il file `google-services.json` e posizionalo in `apps/mobile-app/services/`

### Passo 3: Abilita le API necessarie
1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Abilita le seguenti API:
   - Firebase Cloud Messaging API
   - Google Cloud Messaging API

## 3. Apple Developer Console (per iOS)

### Passo 1: Configura Push Notifications
1. Vai su [Apple Developer Console](https://developer.apple.com/)
2. Seleziona il tuo App ID (`com.beanpositive.app`)
3. Abilita "Push Notifications" capability

### Passo 2: Crea una APNs Auth Key
1. Vai su "Keys" > "All"
2. Crea una nuova key con "Apple Push Notifications service (APNs)"
3. Scarica il file `.p8` e prendi nota del Key ID
4. Il Team ID è visibile nella sezione "Membership"

## 4. Configurazione delle variabili d'ambiente

Crea un file `.env` nella cartella `apps/mobile-app/` con:

```env
# OneSignal Configuration
EXPO_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id_here

# Supabase Configuration (già esistente)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_key_here
```

## 5. Aggiorna la configurazione app.json

Sostituisci i placeholder nel file `app.json`:

```json
[
  "react-native-onesignal",
  {
    "mode": "development",
    "devTeam": "YOUR_ACTUAL_APPLE_DEVELOPER_TEAM_ID",
    "iPhoneAppId": "YOUR_ACTUAL_ONESIGNAL_APP_ID",
    "androidAppId": "YOUR_ACTUAL_ONESIGNAL_APP_ID"
  }
]
```

## 6. File di configurazione necessari

### Google Services (Android)
- `apps/mobile-app/services/google-services.json` ✅ (già presente)

### Google Services (iOS)
- `apps/mobile-app/services/GoogleService-Info.plist` ✅ (già presente)

## 7. Test delle notifiche

### Test su Android:
```bash
cd apps/mobile-app
npm run android
```

### Test su iOS:
```bash
cd apps/mobile-app
npm run ios
```

### Test dal dashboard OneSignal:
1. Vai su OneSignal Dashboard > "Messages" > "New Push"
2. Scrivi un messaggio di test
3. Seleziona "Send to All Users" o un segmento specifico
4. Invia la notifica

## 8. Tipi di notifiche supportate

### Navigazione semplice:
```json
{
  "type": "navigate",
  "screen": "/(authenticated)/(tabs)"
}
```

### Navigazione al profilo:
```json
{
  "type": "profile"
}
```

### Navigazione a una pocket specifica:
```json
{
  "type": "pocket",
  "id": "pocket_id_here"
}
```

### Navigazione alle impostazioni:
```json
{
  "type": "settings"
}
```

## 9. Funzionalità implementate

### ✅ Richiesta permessi notifiche
- Controllo automatico dopo il login
- Pagina dedicata per richiedere i permessi
- Gestione del rifiuto dei permessi
- Apertura delle impostazioni del dispositivo
- Reset dei permessi al logout

### ✅ Gestione notifiche ricevute
- Listener per notifiche in foreground
- Listener per click su notifiche
- Gestione automatica dei deeplink

### ✅ Integrazione con Supabase
- Collegamento utente OneSignal con Supabase
- Tag personalizzati per segmentazione
- Logout automatico da OneSignal

### ✅ Deeplink intelligenti
- Navigazione basata sui dati della notifica
- Fallback alla schermata principale
- Gestione errori robusta

### ✅ Flusso di autenticazione
- Controllo permessi dopo login
- Navigazione condizionale basata sui permessi
- Persistenza dello stato dei permessi
- Reset automatico al logout

## 10. Troubleshooting

### Errori comuni:

1. **"OneSignal not initialized"**
   - Verifica che l'App ID sia corretto
   - Controlla che le variabili d'ambiente siano impostate

2. **"Permission denied"**
   - Verifica che l'utente abbia concesso i permessi
   - Controlla le impostazioni del dispositivo

3. **"Notification not received"**
   - Verifica la configurazione FCM/APNs
   - Controlla che l'app sia in foreground/background

4. **"Deeplink not working"**
   - Verifica il formato dei dati della notifica
   - Controlla che le route esistano nell'app

### Debug:
- Controlla i log di Expo: `expo start --clear`
- Verifica la configurazione in OneSignal Dashboard
- Controlla i log di Firebase/APNs

## 11. Prossimi passi

1. **Configura OneSignal Dashboard** con le credenziali corrette
2. **Aggiorna le variabili d'ambiente** con l'App ID reale
3. **Aggiorna app.json** con i valori corretti
4. **Esegui `npx expo prebuild --clean`** per rigenerare i file nativi
5. **Testa le notifiche** su dispositivi reali
6. **Configura segmenti** per targeting avanzato
