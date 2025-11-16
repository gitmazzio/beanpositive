export type SupabaseErrorCode =
  | "anonymous_provider_disabled"
  | "bad_code_verifier"
  | "bad_json"
  | "bad_jwt"
  | "bad_oauth_callback"
  | "bad_oauth_state"
  | "captcha_failed"
  | "conflict"
  | "email_address_invalid"
  | "email_address_not_authorized"
  | "email_conflict_identity_not_deletable"
  | "email_exists"
  | "email_not_confirmed"
  | "email_provider_disabled"
  | "flow_state_expired"
  | "flow_state_not_found"
  | "identity_already_exists"
  | "identity_not_found"
  | "insufficient_aal"
  | "invite_not_found"
  | "invalid_credentials";

export type SupabaseErrorMap = Record<SupabaseErrorCode, string>;

export const EN_ERROR_CODES: SupabaseErrorMap = {
  anonymous_provider_disabled: "Anonymous sign‑ins are disabled.",
  bad_code_verifier:
    "Returned from the PKCE flow where the provided code verifier does not match the expected one. Indicates a bug in the implementation of the client library.",
  bad_json: "Usually used when the HTTP body of the request is not valid JSON.",
  bad_jwt: "JWT sent in the `Authorization` header is not valid.",
  bad_oauth_callback:
    "OAuth callback from provider to Auth does not have all the required attributes (state). Indicates an issue with the OAuth provider or client library implementation.",
  bad_oauth_state:
    "OAuth state (data echoed back by the OAuth provider to Supabase Auth) is not in the correct format. Indicates an issue with the OAuth provider integration.",
  captcha_failed:
    "Captcha challenge could not be verified with the captcha provider. Check your captcha integration.",
  conflict:
    "General database conflict, such as concurrent requests on resources that should not be modified concurrently. Can often occur when you have too many session refresh requests firing off at the same time for a user. Check your app for concurrency issues, and if detected back off exponentially.",
  email_address_invalid:
    "Example and test domains are currently not supported. Please use a different email address.",
  email_address_not_authorized:
    "Email sending is not allowed for this address as your project is using the default SMTP service. Emails can only be sent to members in your Supabase organization. If you want to send emails to others, please set up a custom SMTP provider.",
  email_conflict_identity_not_deletable:
    "Unlinking this identity causes the user's account to change to an email address which is already used by another user account. Indicates an issue where the user has two different accounts using different primary email addresses. You may need to migrate user data to one of their accounts in this case.",
  email_exists: "Email address already exists in the system.",
  email_not_confirmed:
    "Signing in is not allowed for this user as the email address is not confirmed.",
  email_provider_disabled: "Signups are disabled for email and password.",
  flow_state_expired:
    "PKCE flow state to which the API request relates has expired. Ask the user to sign in again.",
  flow_state_not_found:
    "PKCE flow state to which the API request relates no longer exists. Flow states expire after a while and are progressively cleaned up, which can cause this error. Retried requests can cause this error. Ask the user to sign in again.",
  identity_already_exists:
    "The identity to which the API relates is already linked to a user.",
  identity_not_found:
    "Identity to which the API call relates does not exist, such as when an identity is unlinked or deleted.",
  insufficient_aal:
    "To call this API, the user must have a higher Authenticator Assurance Level. To resolve, ask the user to solve an MFA challenge.",
  invite_not_found: "Invite is expired or already used.",
  invalid_credentials:
    "The credentials provided are incorrect. Please check your email and password and try again.",
};

export const IT_ERROR_CODES: SupabaseErrorMap = {
  anonymous_provider_disabled: "Gli accessi anonimi sono disabilitati.",
  bad_code_verifier:
    "Il codice di verifica fornito nel flusso PKCE non corrisponde a quello atteso. Indica un bug nell'implementazione della libreria client.",
  bad_json: "Il corpo della richiesta HTTP non è un JSON valido.",
  bad_jwt: "Il JWT inviato nell'intestazione `Authorization` non è valido.",
  bad_oauth_callback:
    "Il callback OAuth dal provider a Supabase Auth non contiene tutti gli attributi richiesti (es. lo stato). Indica un problema con il provider OAuth o l'implementazione del client.",
  bad_oauth_state:
    "Lo stato OAuth restituito dal provider non ha il formato corretto. Indica un problema con l'integrazione del provider OAuth.",
  captcha_failed:
    "La verifica del captcha non è riuscita con il provider. Controlla l'integrazione del captcha.",
  conflict:
    "Conflitto generico nel database, ad esempio richieste concorrenti su risorse che non dovrebbero essere modificate contemporaneamente. Può accadere con troppi tentativi di refresh della sessione. Controlla la concorrenza nell'app e applica un backoff esponenziale se necessario.",
  email_address_invalid:
    "Attualmente i domini di esempio e di test non sono supportati. Usa un altro indirizzo email.",
  email_address_not_authorized:
    "L'invio di email non è consentito per questo indirizzo perché il tuo progetto usa il servizio SMTP predefinito. Puoi inviare email solo ai membri della tua organizzazione Supabase. Per altri indirizzi, configura un provider SMTP personalizzato.",
  email_conflict_identity_not_deletable:
    "Scollegare questa identità comporterebbe l'uso di un'email già in uso da un altro account. Indica che l'utente ha più account con email principali diverse. Potrebbe essere necessario unire i dati in un solo account.",
  email_exists: "L'indirizzo email è già registrato.",
  email_not_confirmed:
    "L'accesso non è consentito perché l'indirizzo email non è stato confermato.",
  email_provider_disabled:
    "Le registrazioni con email e password sono disabilitate.",
  flow_state_expired:
    "Lo stato del flusso PKCE è scaduto. Chiedi all'utente di effettuare nuovamente l'accesso.",
  flow_state_not_found:
    "Lo stato del flusso PKCE non esiste più (es. è stato pulito). Potrebbe essere causato da tentativi ripetuti. Chiedi all'utente di accedere di nuovo.",
  identity_already_exists:
    "L'identità a cui si riferisce la richiesta è già collegata a un utente.",
  identity_not_found:
    "L'identità specificata non esiste (es. è stata scollegata o eliminata).",
  insufficient_aal:
    "Per eseguire questa azione l'utente deve avere un livello di garanzia più alto (AAL). Chiedi all'utente di completare l'autenticazione a più fattori.",
  invite_not_found: "L'invito è scaduto o è già stato utilizzato.",
  invalid_credentials:
    "Le credenziali fornite non sono corrette. Verifica email e password e riprova.",
};
