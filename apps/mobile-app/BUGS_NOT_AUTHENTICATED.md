# Bug e Problemi Potenziali nella Sezione Not Authenticated

Questo documento elenca i possibili bug e problemi identificati nei flussi di autenticazione non autenticati (registrazione, login, recupero password, ecc.).

## 🔴 Bug Critici

### 1. **Recover Password: Non controlla errori Supabase**
**Problema**: `resetPasswordForEmail` ritorna `{ data, error }` ma il codice non controlla se c'è un errore.

**Dove**: `recover-password.tsx:33`

**Impatto**: 
- L'utente viene reindirizzato a email-verification anche se l'email non esiste o c'è un errore
- Nessun feedback all'utente se qualcosa va storto

**Fix suggerito**:
```typescript
const onSubmit = async (data: { email: string }) => {
  setError(null);
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    router.push("/(not_authenticated)/check-email");
  } catch (err: any) {
    setError(err.message || "Errore nell'invio dell'email di recupero");
  }
};
```

### 2. **Recover Password: Errore non mostrato nell'UI**
**Problema**: L'errore viene salvato in `error` state ma non viene visualizzato nel componente.

**Dove**: `recover-password.tsx:17, 36`

**Impatto**: L'utente non vede mai i messaggi di errore

**Fix suggerito**: Aggiungere visualizzazione dell'errore:
```typescript
{error && (
  <StyledText kind="caption" style={{ color: "red" }}>
    {error}
  </StyledText>
)}
```

### 3. **Register: Terms non validati**
**Problema**: Il checkbox `acceptTerms` non ha validazione, quindi l'utente può registrarsi senza accettare i termini.

**Dove**: `register.tsx:118-154, 161-164`

**Impatto**: Violazione legale - utenti possono registrarsi senza accettare termini

**Fix suggerito**:
```typescript
<Checkbox
  name="acceptTerms"
  rules={{
    required: "Devi accettare i termini e condizioni per continuare",
  }}
  // ... resto
/>

// E nel disabled del button:
disabled={
  isSubmitting || 
  loading || 
  Object.keys(errors)?.length > 0 ||
  !methods.watch("acceptTerms")
}
```

### 4. **Register: Errore root non visualizzato**
**Problema**: `setError("root", ...)` viene usato ma non c'è un componente che mostra gli errori root.

**Dove**: `register.tsx:45`

**Impatto**: Gli errori di registrazione non vengono mostrati all'utente

**Fix suggerito**: Aggiungere visualizzazione errori root:
```typescript
{errors.root && (
  <StyledText kind="caption" style={{ color: "red" }}>
    {errors.root.message}
  </StyledText>
)}
```

### 5. **Register: Navigazione anche in caso di errore**
**Problema**: Se la registrazione fallisce, il codice naviga comunque a email-verification (anche se c'è un catch, il router.push potrebbe essere eseguito).

**Dove**: `register.tsx:43`

**Impatto**: L'utente viene portato alla schermata sbagliata anche se la registrazione fallisce

**Nota**: Il codice attuale ha un catch, ma dovrebbe essere verificato che non navighi in caso di errore.

### 6. **SignIn: Password non validata**
**Problema**: Il campo password non ha regole di validazione.

**Dove**: `signin.tsx:89-94`

**Impatto**: L'utente può inviare una password vuota

**Fix suggerito**:
```typescript
<PasswordInput
  name="password"
  label="La tua password"
  placeholder="Inserisci qui la tua password..."
  secureTextEntry
  rules={{
    required: "Password obbligatoria",
  }}
/>
```

## 🟡 Bug Moderati

### 7. **Recover Password: Navigazione a route sbagliata**
**Problema**: Naviga a `/email-verification` invece di `/(not_authenticated)/check-email` o `/(not_authenticated)/email-verification`.

**Dove**: `recover-password.tsx:34`

**Impatto**: Potrebbe navigare a una route inesistente o sbagliata

**Fix suggerito**:
```typescript
router.push("/(not_authenticated)/check-email");
```

### 8. **Check Email / Email Verification: router.replace impedisce navigazione indietro**
**Problema**: Usa `router.replace` invece di `router.push`, quindi l'utente non può tornare indietro.

**Dove**: `check-email.tsx:42`, `email-verification.tsx:43`

**Impatto**: UX peggiore - l'utente è bloccato nella schermata

**Fix suggerito**: Usare `router.push` o aggiungere un bottone "Indietro":
```typescript
router.push("/(not_authenticated)/login");
```

### 9. **Register: Error codes non tradotti**
**Problema**: C'è un TODO che indica che dovrebbero essere usati `IT_ERROR_CODES` ma non è implementato.

**Dove**: `register.tsx:46-50`

**Impatto**: Messaggi di errore in inglese invece che in italiano

**Fix suggerito**: Implementare la traduzione degli errori:
```typescript
import { IT_ERROR_CODES, SupabaseErrorCode } from "@/utils/supabase_error_codes";

catch (err: any) {
  setError("root", {
    message: IT_ERROR_CODES[err.code as SupabaseErrorCode] ?? 
             IT_ERROR_CODES["conflict"] ??
             err.message ??
             "Errore durante la registrazione"
  });
}
```

### 10. **SignIn: Errore default inconsistente**
**Problema**: Se l'errore non ha un codice valido, usa `IT_ERROR_CODES["conflict"]` come default, che potrebbe non essere appropriato.

**Dove**: `signin.tsx:47-48`

**Impatto**: Messaggio di errore confuso per l'utente

**Fix suggerito**:
```typescript
setError(
  IT_ERROR_CODES[err.code as SupabaseErrorCode] ??
    err.message ??
    "Errore durante l'accesso. Riprova."
);
```

### 11. **Tutti i form: Nessuna protezione contro submit multipli**
**Problema**: Se l'utente clicca rapidamente più volte sul bottone, possono partire più submit simultanei.

**Dove**: Tutti i form (register, signin, recover-password)

**Impatto**: 
- Chiamate API duplicate
- Possibili errori di stato
- Spese API inutili

**Fix suggerito**: Il `disabled` state aiuta, ma potrebbe essere migliorato con un flag dedicato.

### 12. **Recover Password: Manca redirectTo URL**
**Problema**: `resetPasswordForEmail` non specifica un `redirectTo`, quindi Supabase userà quello di default che potrebbe non essere configurato correttamente.

**Dove**: `recover-password.tsx:33`

**Impatto**: L'utente potrebbe non essere reindirizzato correttamente dopo il reset

**Fix suggerito**:
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
  redirectTo: `${process.env.EXPO_PUBLIC_APP_URL || 'beanpositiveapp://reset-password'}`,
});
```

## 🟢 Problemi Minori / Miglioramenti

### 13. **Tutti i form: Validazione email inconsistente**
**Problema**: Il pattern regex `/^\S+@\S+$/i` è molto permissivo e potrebbe accettare email non valide.

**Dove**: `register.tsx:95`, `signin.tsx:86`, `recover-password.tsx:67`

**Impatto**: Email malformate potrebbero essere accettate

**Fix suggerito**: Usare un pattern più rigoroso:
```typescript
pattern: {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
  message: "Email non valida"
}
```

### 14. **Register: Password hint non corrisponde alle regole**
**Problema**: L'hint dice "1 minuscola" ma la regex richiede anche un carattere speciale.

**Dove**: `register.tsx:115`

**Impatto**: Confusione per l'utente

**Fix suggerito**:
```typescript
hintText="Almeno 8 caratteri, 1 maiuscola, 1 minuscola, 1 carattere speciale"
```

### 15. **SignIn: Link a recover-password usa path relativo**
**Problema**: Usa `/recover-password` invece di `/(not_authenticated)/recover-password`.

**Dove**: `signin.tsx:95`

**Impatto**: Potrebbe non funzionare correttamente con la struttura di routing

**Fix suggerito**:
```typescript
<Link to="/(not_authenticated)/recover-password">
  Hai dimenticato la password?
</Link>
```

### 16. **Tutti i form: router.canGoBack() potrebbe non funzionare come previsto**
**Problema**: `router.canGoBack()` potrebbe restituire `true` anche quando non c'è una schermata precedente valida.

**Dove**: Tutti i file con Header `withBack`

**Impatto**: Il bottone back potrebbe non funzionare correttamente

**Fix suggerito**: Gestire meglio il caso:
```typescript
onPressBack={() => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/(not_authenticated)/login");
  }
}}
```

### 17. **Register: setAuthIsLoading potrebbe interferire con altri stati**
**Problema**: `setAuthIsLoading` modifica lo stato globale di loading, che potrebbe interferire con altri componenti.

**Dove**: `register.tsx:38, 52`

**Impatto**: Altri componenti potrebbero mostrare loading quando non dovrebbero

**Nota**: Questo potrebbe essere intenzionale, ma dovrebbe essere documentato.

### 18. **Recover Password: Messaggio non corrisponde al comportamento**
**Problema**: Il messaggio dice "password temporanea" ma Supabase invia un link per resettare la password, non una password temporanea.

**Dove**: `recover-password.tsx:54-56`

**Impatto**: Messaggio fuorviante per l'utente

**Fix suggerito**:
```typescript
<StyledText kind="body">
  Invieremo un'email con un link per reimpostare la tua password. 
  Clicca sul link nell'email per creare una nuova password.
</StyledText>
```

## 📋 Checklist di Fix Prioritari

### Priorità Alta (Fix Immediati)
- [ ] Bug #1: Recover Password non controlla errori Supabase
- [ ] Bug #2: Errore non mostrato in recover-password
- [ ] Bug #3: Terms non validati in register
- [ ] Bug #4: Errore root non visualizzato in register
- [ ] Bug #6: Password non validata in signin

### Priorità Media
- [ ] Bug #5: Navigazione anche in caso di errore (register)
- [ ] Bug #7: Navigazione a route sbagliata (recover-password)
- [ ] Bug #8: router.replace impedisce navigazione indietro
- [ ] Bug #9: Error codes non tradotti (register)
- [ ] Bug #10: Errore default inconsistente (signin)
- [ ] Bug #12: Manca redirectTo URL (recover-password)

### Priorità Bassa (Miglioramenti)
- [ ] Bug #11: Protezione submit multipli
- [ ] Bug #13: Validazione email più rigorosa
- [ ] Bug #14: Password hint aggiornato
- [ ] Bug #15: Link path corretti
- [ ] Bug #16: Gestione router.canGoBack()
- [ ] Bug #17: Documentazione setAuthIsLoading
- [ ] Bug #18: Messaggio recover-password aggiornato

## 🔍 Testing Consigliato

1. **Test Recover Password**:
   - Invia email con email non esistente
   - Invia email con email valida
   - Verifica che l'errore venga mostrato
   - Verifica che la navigazione avvenga solo in caso di successo

2. **Test Register**:
   - Prova a registrarsi senza accettare i termini
   - Prova con email già esistente
   - Verifica che gli errori vengano mostrati
   - Verifica che non navighi in caso di errore

3. **Test SignIn**:
   - Prova con password vuota
   - Prova con credenziali errate
   - Verifica che gli errori vengano mostrati correttamente

4. **Test Navigazione**:
   - Verifica che tutti i link funzionino correttamente
   - Verifica che il bottone back funzioni
   - Verifica che non ci siano loop di navigazione
