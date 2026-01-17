# Bug e Problemi Potenziali nei Flussi di Autenticazione

Questo documento elenca i possibili bug e problemi identificati nei flussi di autenticazione Google e Apple.

## 🔴 Bug Critici

### 1. **Race Condition: Login Simultanei**
**Problema**: Se l'utente clicca rapidamente più volte sui bottoni di login, possono partire più flussi di autenticazione simultaneamente.

**Dove**: `login.tsx` - `handleGoogleLogin` e `handleAppleLogin`

**Impatto**: 
- Possibili errori di stato inconsistente
- Navigazione multipla
- Chiamate API duplicate

**Fix suggerito**:
```typescript
const [isAuthenticating, setIsAuthenticating] = useState(false)

const handleGoogleLogin = async () => {
  if (isAuthenticating || isGoogleLoading) return // Prevenire doppi click
  setIsAuthenticating(true)
  // ... resto del codice
  finally {
    setIsAuthenticating(false)
  }
}
```

### 2. **Google: Parsing URL non sicuro**
**Problema**: `new URL(result.url)` può lanciare un errore se `result.url` non è una URL valida.

**Dove**: `AuthProvider.tsx:113`

**Impatto**: Crash dell'app se Google ritorna una URL malformata

**Fix suggerito**:
```typescript
if (result.type === "success" && result.url) {
  try {
    const url = new URL(result.url)
    // ... resto del codice
  } catch (urlError) {
    throw new Error("Invalid callback URL received from OAuth provider")
  }
}
```

### 3. **Apple: Full Name non salvato**
**Problema**: Apple fornisce il full name solo al primo login, ma non viene salvato nei metadata dell'utente.

**Dove**: `AuthProvider.tsx:168-190`

**Impatto**: Perdita del nome dell'utente dopo il primo login

**Fix suggerito**:
```typescript
const credential = await AppleAuthentication.signInAsync({...})

// Salva il nome se disponibile (solo al primo login)
if (credential.fullName) {
  const fullName = [
    credential.fullName.givenName,
    credential.fullName.familyName
  ].filter(Boolean).join(' ')
  
  // Salva dopo l'autenticazione
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      given_name: credential.fullName.givenName,
      family_name: credential.fullName.familyName,
    }
  })
}
```

### 4. **OneSignal: Errori non gestiti possono bloccare il flusso**
**Problema**: Se OneSignal fallisce durante `onAuthStateChange`, potrebbe bloccare l'intero flusso di autenticazione.

**Dove**: `AuthProvider.tsx:60-70`

**Impatto**: L'utente potrebbe non essere loggato anche se l'autenticazione è riuscita

**Fix suggerito**:
```typescript
if (session?.user) {
  try {
    await oneSignalService.setExternalUserId(session.user.id)
    await oneSignalService.setUserTags({
      email: session.user.email || "",
      created_at: session.user.created_at,
    })
  } catch (oneSignalError) {
    console.error("OneSignal error (non-blocking):", oneSignalError)
    // Non bloccare il flusso se OneSignal fallisce
  }
}
```

## 🟡 Bug Moderati

### 5. **Google: Fallback logic maschera errori reali**
**Problema**: Il fallback che prova a ottenere la sessione direttamente se non c'è codice potrebbe mascherare errori reali del flusso OAuth.

**Dove**: `AuthProvider.tsx:132-142`

**Impatto**: Difficile debuggare problemi OAuth

**Fix suggerito**: Rimuovere il fallback o loggare meglio l'errore:
```typescript
if (code) {
  // Scambia il codice con la sessione
  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) throw exchangeError
  if (!sessionData.session) {
    throw new Error("No session returned after code exchange")
  }
} else {
  // Questo non dovrebbe mai accadere in un flusso OAuth corretto
  console.error("OAuth flow completed but no authorization code was returned")
  throw new Error("OAuth flow error: No authorization code returned")
}
```

### 6. **Apple: Error code check incompleto**
**Problema**: Il check per `ERR_REQUEST_CANCELED` potrebbe non coprire tutti i codici di errore di Apple.

**Dove**: `AuthProvider.tsx:193`

**Impatto**: Errori di cancellazione potrebbero essere mostrati come errori generici

**Fix suggerito**:
```typescript
catch (error: any) {
  if (error.code === "ERR_REQUEST_CANCELED" || 
      error.code === "ERR_CANCELED" ||
      error.message?.includes("cancel")) {
    throw new Error("Authentication cancelled by user")
  }
  console.error("Apple login error:", error)
  throw error
}
```

### 7. **Loading state non gestito durante autenticazione**
**Problema**: Il `loading` state in AuthProvider non viene aggiornato durante i login OAuth, solo durante il logout.

**Dove**: `AuthProvider.tsx` - `loginWithGoogle` e `loginWithApple`

**Impatto**: L'UI potrebbe non mostrare lo stato di caricamento correttamente

**Fix suggerito**:
```typescript
const loginWithGoogle = async () => {
  setLoading(true) // Aggiungi questo
  try {
    // ... resto del codice
  } finally {
    setLoading(false) // Aggiungi questo
  }
}
```

### 8. **Google: Deep linking fallback non gestito**
**Problema**: Se l'app non si apre correttamente dopo l'autenticazione Google (problema di deep linking), il flusso si blocca senza feedback.

**Dove**: `AuthProvider.tsx:109`

**Impatto**: L'utente potrebbe rimanere bloccato nella schermata di login

**Fix suggerito**: Aggiungere timeout e retry logic:
```typescript
const result = await Promise.race([
  WebBrowser.openAuthSessionAsync(data.url, redirectTo),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Authentication timeout")), 60000)
  )
])
```

## 🟢 Problemi Minori / Miglioramenti

### 9. **useMemo dependencies: Funzioni ricreate ad ogni render**
**Problema**: Le funzioni nel `useMemo` vengono ricreate ad ogni render, causando re-render non necessari.

**Dove**: `AuthProvider.tsx:239-251`

**Impatto**: Performance non ottimali

**Fix suggerito**: Usare `useCallback` per le funzioni:
```typescript
const login = useCallback(async (email: string, password: string) => {
  // ... codice
}, [])

const loginWithGoogle = useCallback(async () => {
  // ... codice
}, [])

// Poi nel useMemo:
const value = useMemo(
  () => ({
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithApple,
    logout,
    register,
    setAuthIsLoading: setLoading,
  }),
  [user, loading, login, loginWithGoogle, loginWithApple, logout, register]
)
```

### 10. **Google: Nessun controllo su `result.type` prima di accedere a `result.url`**
**Problema**: Si accede a `result.url` solo se `result.type === "success"`, ma TypeScript potrebbe non garantirlo.

**Dove**: `AuthProvider.tsx:111`

**Impatto**: Potenziale errore TypeScript/runtime

**Fix suggerito**: Aggiungere type guard:
```typescript
if (result.type === "success") {
  if (!result.url) {
    throw new Error("OAuth callback URL is missing")
  }
  const url = new URL(result.url)
  // ... resto
}
```

### 11. **Apple: Verifica disponibilità ridondante**
**Problema**: Si verifica `Platform.OS !== "ios"` ma poi si chiama anche `isAvailableAsync()` che già verifica la piattaforma.

**Dove**: `AuthProvider.tsx:158-165`

**Impatto**: Codice ridondante (minore)

**Fix suggerito**: Rimuovere il check di Platform se `isAvailableAsync()` è sufficiente:
```typescript
const isAvailable = await AppleAuthentication.isAvailableAsync()
if (!isAvailable) {
  throw new Error("Apple Sign In is not available on this device")
}
```

### 12. **Nessuna gestione del caso "utente già loggato"**
**Problema**: Se l'utente è già loggato e clicca su login, il flusso procede comunque.

**Dove**: `login.tsx` - handlers

**Impatto**: Navigazione inutile e possibile confusione

**Fix suggerito**:
```typescript
const { user } = useAuth()

const handleGoogleLogin = async () => {
  if (user) {
    // Utente già loggato, naviga direttamente
    await checkAndNavigateAfterLogin()
    return
  }
  // ... resto del codice
}
```

### 13. **Google: Nessun controllo sulla validità del codice OAuth**
**Problema**: Il codice OAuth potrebbe essere vuoto o malformato.

**Dove**: `AuthProvider.tsx:114`

**Impatto**: Errori poco chiari

**Fix suggerito**:
```typescript
const code = url.searchParams.get("code")
if (!code || code.trim() === "") {
  throw new Error("Invalid or empty authorization code")
}
```

### 14. **Apple: Non gestisce il caso in cui l'email è nascosta**
**Problema**: Se l'utente sceglie di nascondere l'email, Apple fornisce un'email proxy, ma non viene gestita esplicitamente.

**Dove**: `AuthProvider.tsx:180-183`

**Impatto**: Potenziale confusione se l'email proxy non viene riconosciuta

**Nota**: Supabase gestisce automaticamente le email proxy, ma potrebbe essere utile loggare questo caso.

## 📋 Checklist di Fix Prioritari

### Priorità Alta (Fix Immediati)
- [ ] Bug #1: Race condition login simultanei
- [ ] Bug #2: Parsing URL non sicuro (Google)
- [ ] Bug #3: Full name non salvato (Apple)
- [ ] Bug #4: Errori OneSignal non gestiti

### Priorità Media
- [ ] Bug #5: Fallback logic Google
- [ ] Bug #6: Error code check Apple
- [ ] Bug #7: Loading state durante autenticazione
- [ ] Bug #8: Deep linking fallback Google

### Priorità Bassa (Miglioramenti)
- [ ] Bug #9: useMemo dependencies
- [ ] Bug #10: Type guard result.url
- [ ] Bug #11: Verifica disponibilità ridondante
- [ ] Bug #12: Gestione utente già loggato
- [ ] Bug #13: Validità codice OAuth
- [ ] Bug #14: Email proxy Apple

## 🔍 Testing Consigliato

1. **Test Race Condition**: Clicca rapidamente più volte sui bottoni di login
2. **Test URL Malformata**: Simula una URL di callback non valida
3. **Test Cancellazione**: Cancella l'autenticazione Google/Apple e verifica i messaggi di errore
4. **Test OneSignal Offline**: Disabilita OneSignal e verifica che il login funzioni comunque
5. **Test Deep Linking**: Verifica che l'app si apra correttamente dopo l'autenticazione Google
6. **Test Full Name Apple**: Verifica che il nome venga salvato al primo login con Apple
