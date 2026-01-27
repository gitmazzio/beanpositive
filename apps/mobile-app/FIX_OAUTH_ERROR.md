# Fix: Errore "missing destination name oauth_client_id in *models.Session"

Questo errore indica che il provider OAuth (Google) non è configurato correttamente nel Dashboard di Supabase.

## 🔍 Diagnosi

L'errore `missing destination name oauth_client_id in *models.Session` significa che Supabase non riesce a trovare il `oauth_client_id` necessario per completare il flusso OAuth.

## ✅ Soluzioni

### 1. Verifica la Configurazione del Provider Google in Supabase

1. Vai su [Supabase Dashboard](https://app.supabase.com/)
2. Seleziona il tuo progetto
3. Vai su **Authentication** > **Providers**
4. Clicca su **Google**

### 2. Verifica i Campi Obbligatori

Assicurati che questi campi siano compilati correttamente:

#### Client ID (for OAuth)
- Deve contenere **entrambi** i Client ID separati da virgola:
  ```
  [WEB-CLIENT-ID],[IOS-CLIENT-ID]
  ```
- Esempio: `123456789-abcdefgh.apps.googleusercontent.com,987654321-xyz.apps.googleusercontent.com`
- ⚠️ **IMPORTANTE**: Entrambi i Client ID devono essere presenti, separati da una virgola

#### Client Secret (for OAuth)
- Deve essere il **Client Secret Web** (non quello iOS, che non esiste)
- Esempio: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

#### Redirect URL
- Deve essere configurato come:
  ```
  beanpositive://auth/callback
  ```
- Oppure:
  ```
  mobileapp://auth/callback
  ```
- (Dipende dallo scheme configurato nel tuo `app.json`)

### 3. Verifica che il Provider sia Abilitato

Assicurati che il toggle **"Enable Google provider"** sia **attivo** (ON).

### 4. Verifica le Variabili d'Ambiente

Controlla che nel tuo progetto ci siano:

```env
EXPO_PUBLIC_SUPABASE_URL=https://[TUO-PROGETTO].supabase.co
EXPO_PUBLIC_SUPABASE_KEY=[LA_TUA_ANON_KEY]
```

### 5. Verifica lo Scheme nell'app.json

Nel file `app.json`, verifica che lo scheme corrisponda al Redirect URL configurato in Supabase:

```json
{
  "expo": {
    "scheme": "beanpositive"
    // oppure "mobileapp" se hai usato quello
  }
}
```

### 6. Rigenera i Client ID se Necessario

Se i Client ID non sono configurati correttamente:

1. **In Google Cloud Console**:
   - Verifica che entrambi i Client ID esistano
   - Client ID Web: per Supabase callback
   - Client ID iOS: per l'app mobile

2. **In Supabase Dashboard**:
   - Copia entrambi i Client ID
   - Incollali nel campo "Client ID (for OAuth)" separati da virgola: `[WEB],[IOS]`
   - Salva

### 7. Verifica l'URL di Callback in Google Cloud Console

Nel **Client ID Web** in Google Cloud Console, assicurati che ci sia:

```
https://[TUO-PROGETTO].supabase.co/auth/v1/callback
```

**NON** aggiungere `beanpositive://auth/callback` qui - quello va solo in Supabase.

## 🔄 Dopo le Modifiche

1. **Salva** le modifiche in Supabase Dashboard
2. **Riavvia l'app** completamente
3. **Prova di nuovo** il login con Google

## 🐛 Se l'Errore Persiste

### Verifica i Log

Controlla i log della console quando provi a fare login:

```typescript
console.log("🔗 Redirect URL generato:", redirectTo)
console.log("🔗 Callback URL ricevuta:", result.url)
```

### Verifica la Configurazione Completa

Assicurati che:

- ✅ Provider Google sia **abilitato** in Supabase
- ✅ Client ID contenga **entrambi** i valori (Web e iOS) separati da virgola
- ✅ Client Secret sia quello **Web** (non iOS)
- ✅ Redirect URL in Supabase corrisponda allo scheme in `app.json`
- ✅ URL callback in Google Cloud Console sia quello di Supabase
- ✅ Variabili d'ambiente siano configurate correttamente

### Controlla la Versione di Supabase

Assicurati di usare una versione recente di `@supabase/supabase-js`:

```bash
npm list @supabase/supabase-js
```

Se è vecchia, aggiorna:

```bash
npm update @supabase/supabase-js
```

## 📝 Checklist Completa

- [ ] Provider Google abilitato in Supabase Dashboard
- [ ] Client ID contiene entrambi i valori: `[WEB-CLIENT-ID],[IOS-CLIENT-ID]`
- [ ] Client Secret è quello Web
- [ ] Redirect URL in Supabase: `beanpositive://auth/callback` (o `mobileapp://auth/callback`)
- [ ] Scheme in `app.json` corrisponde al Redirect URL
- [ ] URL callback in Google Cloud Console: `https://[PROJECT].supabase.co/auth/v1/callback`
- [ ] Variabili d'ambiente configurate (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`)
- [ ] App riavviata dopo le modifiche

## 💡 Suggerimento

Se hai fatto modifiche alla configurazione OAuth, potrebbe essere necessario:
1. Fare logout completo dall'app
2. Cancellare la cache di AsyncStorage
3. Riavviare l'app
4. Provare di nuovo il login

---

Se dopo aver seguito tutti questi passaggi l'errore persiste, potrebbe essere un problema temporaneo di Supabase o una configurazione più complessa. In quel caso, controlla i log dettagliati e considera di contattare il supporto Supabase.
