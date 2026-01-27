# Guida Completa: Configurazione App Groups per iOS Widget

Questa guida ti accompagna passo-passo nella configurazione degli **App Groups** necessari per far comunicare la tua app principale con il widget extension.

## Perché servono gli App Groups?

Gli App Groups permettono all'app principale (`com.beanpositive.app`) e al widget extension (`com.beanpositive.app.widget`) di condividere dati tramite:
- `UserDefaults` condivisi
- File system condiviso
- Container condivisi

Senza questa configurazione, app e widget non possono comunicare tra loro.

---

## Passo 1: Accedi a Apple Developer Console

1. Vai su [Apple Developer Console](https://developer.apple.com/account/)
2. Accedi con il tuo account Apple Developer
3. Assicurati di avere i permessi necessari (Admin o Account Holder)

---

## Passo 2: Crea l'App Group

### 2.1 Naviga alla sezione Identifiers

1. Nel menu laterale, clicca su **"Certificates, Identifiers & Profiles"**
2. Clicca su **"Identifiers"** nel menu a sinistra
3. Clicca sul pulsante **"+"** in alto a sinistra (accanto a "Identifiers")

### 2.2 Seleziona il tipo App Groups

1. Nella schermata che si apre, seleziona **"App Groups"**
2. Clicca su **"Continue"**

### 2.3 Inserisci i dettagli dell'App Group

1. **Description**: Inserisci una descrizione, ad esempio:
   ```
   Bean Positive Shared Data
   ```

2. **Identifier**: Inserisci esattamente questo identifier:
   ```
   group.com.beanpositive.app
   ```
   
   ⚠️ **IMPORTANTE**: 
   - Deve iniziare con `group.`
   - Deve corrispondere esattamente a quello nel tuo `app.json`
   - Non può contenere spazi o caratteri speciali

3. Clicca su **"Continue"**

### 2.4 Registra l'App Group

1. Rivedi le informazioni
2. Clicca su **"Register"**
3. Dovresti vedere un messaggio di conferma: "Your App Group has been registered"

---

## Passo 3: Abilita App Groups per l'App ID principale

### 3.1 Trova il tuo App ID principale

1. Nella sezione **"Identifiers"**, cerca e clicca su:
   ```
   com.beanpositive.app
   ```
   (Questo è il Bundle Identifier della tua app principale)

2. Clicca su **"Edit"** (in alto a destra)

### 3.2 Abilita App Groups capability

1. Scorri fino alla sezione **"App Services"** o **"Capabilities"**
2. Trova la checkbox **"App Groups"**
3. **Spunta la checkbox** per abilitarla
4. Clicca su **"Configure"** (apparirà accanto alla checkbox)

### 3.3 Seleziona l'App Group

1. Nella finestra che si apre, vedrai una lista di App Groups disponibili
2. **Spunta la checkbox** accanto a:
   ```
   group.com.beanpositive.app
   ```
3. Clicca su **"Save"** o **"Done"**

### 3.4 Salva le modifiche all'App ID

1. Torna alla schermata principale dell'App ID
2. Clicca su **"Save"** in alto a destra
3. Dovresti vedere un messaggio di conferma

---

## Passo 4: Crea l'App ID per il Widget Extension

### 4.1 Crea un nuovo App ID per il widget

1. Torna alla lista **"Identifiers"**
2. Clicca sul pulsante **"+"** in alto a sinistra
3. Seleziona **"App IDs"**
4. Clicca su **"Continue"**

### 4.2 Configura il nuovo App ID

1. **Description**: Inserisci:
   ```
   Bean Positive Widget Extension
   ```

2. **Bundle ID**: Inserisci esattamente:
   ```
   com.beanpositive.app.widget
   ```
   
   ⚠️ **IMPORTANTE**: Questo deve corrispondere al `bundleIdentifier` nel file `targets/widget/expo-target.config.js`

3. Clicca su **"Continue"**

### 4.3 Seleziona le capabilities

1. Nella sezione **"App Services"**, spunta:
   - ✅ **App Groups** (obbligatorio)
   - ✅ **WidgetKit** (se disponibile, per i widget)

2. Clicca su **"Continue"**

### 4.4 Registra l'App ID

1. Rivedi le informazioni
2. Clicca su **"Register"**
3. Dovresti vedere un messaggio di conferma

---

## Passo 5: Abilita App Groups per il Widget Extension App ID

### 5.1 Modifica il Widget Extension App ID

1. Nella lista **"Identifiers"**, cerca e clicca su:
   ```
   com.beanpositive.app.widget
   ```

2. Clicca su **"Edit"**

### 5.2 Configura App Groups

1. Assicurati che **"App Groups"** sia spuntato
2. Clicca su **"Configure"** accanto a App Groups
3. **Spunta la checkbox** accanto a:
   ```
   group.com.beanpositive.app
   ```
   (Lo stesso App Group usato per l'app principale)
4. Clicca su **"Save"** o **"Done"**

### 5.3 Salva le modifiche

1. Clicca su **"Save"** in alto a destra
2. Dovresti vedere un messaggio di conferma

---

## Passo 6: Rigenera i Provisioning Profiles

⚠️ **IMPORTANTE**: Dopo aver modificato gli App IDs, devi rigenerare i Provisioning Profiles.

### 6.1 Per l'App principale

1. Vai su **"Profiles"** nel menu laterale
2. Trova il provisioning profile per `com.beanpositive.app`
3. Clicca su **"Edit"**
4. Verifica che **"App Groups"** sia selezionato
5. Clicca su **"Generate"** o **"Save"**
6. **Scarica** il nuovo provisioning profile

### 6.2 Per il Widget Extension

1. Se esiste già un provisioning profile per `com.beanpositive.app.widget`, modificalo
2. Altrimenti, creane uno nuovo:
   - Clicca su **"+"**
   - Seleziona **"iOS App Development"** o **"App Store"** (a seconda delle tue esigenze)
   - Seleziona l'App ID: `com.beanpositive.app.widget`
   - Seleziona i certificati e dispositivi necessari
   - Clicca su **"Generate"**
   - **Scarica** il provisioning profile

### 6.3 Installa i Provisioning Profiles in Xcode

1. Apri Xcode
2. Vai su **Xcode > Settings > Accounts**
3. Seleziona il tuo account Apple Developer
4. Clicca su **"Download Manual Profiles"**
5. Oppure trascina i file `.mobileprovision` scaricati in Xcode

---

## Passo 7: Verifica la configurazione in Xcode

Dopo aver eseguito `npx expo prebuild -p ios --clean`:

### 7.1 Verifica l'App principale

1. Apri il progetto in Xcode: `xed ios`
2. Seleziona il target **"Bean Positive"** (l'app principale)
3. Vai su **"Signing & Capabilities"**
4. Verifica che:
   - ✅ **App Groups** sia presente nella lista delle capabilities
   - ✅ `group.com.beanpositive.app` sia spuntato

### 7.2 Verifica il Widget Extension

1. Seleziona il target **"BeanPositiveWidget"** (il widget)
2. Vai su **"Signing & Capabilities"**
3. Verifica che:
   - ✅ **App Groups** sia presente nella lista delle capabilities
   - ✅ `group.com.beanpositive.app` sia spuntato (lo stesso dell'app principale)

---

## Passo 8: Verifica i file di configurazione

### 8.1 Verifica app.json

Assicurati che nel tuo `app.json` ci sia:

```json
{
  "expo": {
    "ios": {
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.beanpositive.app"
        ]
      },
      "appleTeamId": "B2UMD85VN6"
    }
  }
}
```

✅ **Già configurato correttamente!**

### 8.2 Verifica expo-target.config.js

Assicurati che nel file `targets/widget/expo-target.config.js` ci sia:

```javascript
module.exports = config => ({
  type: "widget",
  bundleIdentifier: "com.beanpositive.app.widget",
  entitlements: {
    "com.apple.security.application-groups": ["group.com.beanpositive.app"]
  },
});
```

✅ **Già configurato correttamente!**

---

## Checklist Finale

Prima di testare, verifica:

- [ ] App Group `group.com.beanpositive.app` creato in Apple Developer Console
- [ ] App ID `com.beanpositive.app` ha App Groups abilitato
- [ ] App ID `com.beanpositive.app.widget` creato e ha App Groups abilitato
- [ ] Entrambi gli App IDs usano lo stesso App Group: `group.com.beanpositive.app`
- [ ] Provisioning Profiles rigenerati e scaricati
- [ ] `app.json` contiene l'App Group nei entitlements
- [ ] `expo-target.config.js` contiene l'App Group nei entitlements
- [ ] Team ID configurato correttamente: `B2UMD85VN6`
- [ ] Eseguito `npx expo prebuild -p ios --clean`
- [ ] In Xcode, entrambi i target hanno App Groups configurato correttamente

---

## Risoluzione Problemi

### Errore: "App Group not found"

**Causa**: L'App Group non è stato creato o l'identifier non corrisponde.

**Soluzione**:
1. Verifica che l'App Group esista in Apple Developer Console
2. Verifica che l'identifier sia esattamente `group.com.beanpositive.app` (case-sensitive)
3. Assicurati che sia associato a entrambi gli App IDs

### Errore: "Code signing failed"

**Causa**: Provisioning Profile non aggiornato o App Groups non configurato.

**Soluzione**:
1. Rigenera i Provisioning Profiles dopo aver abilitato App Groups
2. Scarica e installa i nuovi provisioning profiles
3. In Xcode, verifica che i target abbiano App Groups nelle capabilities

### Errore: "No App Groups capability"

**Causa**: App Groups non abilitato per uno dei due App IDs.

**Soluzione**:
1. Verifica in Apple Developer Console che entrambi gli App IDs abbiano App Groups abilitato
2. Verifica che lo stesso App Group sia selezionato per entrambi

### Widget non condivide dati con l'app

**Causa**: Identifier dell'App Group non corrisponde o provisioning profile non aggiornato.

**Soluzione**:
1. Verifica che l'identifier sia identico in:
   - Apple Developer Console (per entrambi gli App IDs)
   - `app.json`
   - `expo-target.config.js`
   - Xcode (entitlements files)
2. Rigenera i provisioning profiles
3. Esegui `npx expo prebuild -p ios --clean` di nuovo

---

## Test

Dopo aver completato tutti i passaggi:

1. Esegui `npx expo prebuild -p ios --clean`
2. Apri il progetto in Xcode: `xed ios`
3. Compila e esegui l'app su un dispositivo fisico (i widget funzionano meglio su dispositivi reali)
4. Aggiungi il widget alla home screen
5. Testa che il click sul widget apra l'app e aggiunga un fagiolo

---

**Buona fortuna! 🚀**

Se hai problemi, verifica che tutti gli identifier corrispondano esattamente e che i provisioning profiles siano stati rigenerati dopo aver abilitato App Groups.
