# Guida alla Personalizzazione del Widget

Il widget si trova in `targets/widget/widgets.swift`. Ecco come personalizzarlo.

## 📍 File da modificare

```
apps/mobile-app/targets/widget/widgets.swift
```

Dopo ogni modifica, devi:
1. Compilare il progetto in Xcode
2. O eseguire `npx expo prebuild -p ios --clean` se modifichi la configurazione

---

## 🎨 Personalizzazione Colori

I colori sono definiti nella struct `widgetEntryView` (righe 32-36):

```swift
// Colori dal design
let beigeBackground = Color(red: 0.96, green: 0.96, blue: 0.93) // #F5F5DC
let shieldGreen = Color(red: 0.49, green: 0.52, blue: 0.34) // #7D8557
let darkText = Color(red: 0.2, green: 0.2, blue: 0.2) // Testo scuro
let beanPattern = Color(red: 0.9, green: 0.9, blue: 0.88) // Pattern fagioli
```

### Come modificare i colori:

**Opzione 1: Usa valori RGB (0.0 - 1.0)**
```swift
let beigeBackground = Color(red: 0.96, green: 0.96, blue: 0.93)
```

**Opzione 2: Usa valori esadecimali**
```swift
let shieldGreen = Color(hex: "#7D8557")
// Nota: devi aggiungere un'estensione per Color(hex:)
```

**Opzione 3: Usa colori di sistema**
```swift
let darkText = Color.primary
let shieldGreen = Color.green
```

**Opzione 4: Usa colori personalizzati con nome**
```swift
let beigeBackground = Color("BeigeBackground") // Richiede un asset color
```

### Esempio: Cambiare il colore dello scudo

```swift
// Da verde a blu
let shieldGreen = Color(red: 0.2, green: 0.4, blue: 0.8)
```

---

## ✏️ Personalizzazione Testo

Il testo è nella sezione `VStack` (righe 48-60):

```swift
VStack(spacing: 8) {
    // Icona +
    Text("+")
        .font(.system(size: 48, weight: .bold))
        .foregroundColor(darkText)
    
    // Testo "Aggiungi un fagiolo"
    Text("Aggiungi\nun fagiolo")
        .font(.system(size: 16, weight: .medium))
        .foregroundColor(darkText)
        .multilineTextAlignment(.center)
        .lineLimit(2)
}
```

### Modifiche possibili:

**Cambiare il testo:**
```swift
Text("Aggiungi\nun fagiolo")
// Diventa:
Text("Clicca qui!")
```

**Cambiare la dimensione del font:**
```swift
.font(.system(size: 48, weight: .bold))
// Diventa:
.font(.system(size: 60, weight: .bold)) // Più grande
```

**Cambiare il peso del font:**
```swift
.font(.system(size: 48, weight: .bold))
// Opzioni: .ultraLight, .thin, .light, .regular, .medium, .semibold, .bold, .heavy, .black
```

**Cambiare il font:**
```swift
.font(.system(size: 48, weight: .bold))
// Diventa:
.font(.custom("DynaPuff", size: 48)) // Richiede che il font sia incluso nel widget
```

**Cambiare il colore del testo:**
```swift
.foregroundColor(darkText)
// Diventa:
.foregroundColor(.white)
.foregroundColor(shieldGreen)
```

**Rimuovere il testo:**
```swift
// Commenta o rimuovi la sezione Text
// Text("Aggiungi\nun fagiolo")
```

---

## 🎯 Personalizzazione Icona

L'icona "+" è alla riga 50:

```swift
Text("+")
    .font(.system(size: 48, weight: .bold))
    .foregroundColor(darkText)
```

### Modifiche possibili:

**Cambiare l'icona con un emoji:**
```swift
Text("🌱") // Fagiolo
Text("⭐") // Stella
Text("💚") // Cuore verde
```

**Cambiare l'icona con SF Symbols:**
```swift
Image(systemName: "plus.circle.fill")
    .font(.system(size: 48))
    .foregroundColor(darkText)
```

**Usare un'immagine personalizzata:**
```swift
Image("widget-icon") // Richiede un asset image nel widget bundle
    .resizable()
    .scaledToFit()
    .frame(width: 48, height: 48)
```

**Rimuovere l'icona:**
```swift
// Commenta o rimuovi
// Text("+")
```

---

## 🛡️ Personalizzazione Scudo

Lo scudo è definito in `ShieldShape` (righe 78-108) e applicato alle righe 62-70.

### Modifiche possibili:

**Cambiare lo spessore del bordo:**
```swift
.stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 4]))
// Diventa:
.stroke(style: StrokeStyle(lineWidth: 4, dash: [8, 4])) // Più spesso
```

**Cambiare lo stile del bordo:**
```swift
// Bordo continuo (non tratteggiato)
.stroke(style: StrokeStyle(lineWidth: 2))
// O
.stroke(shieldGreen, lineWidth: 2)
```

**Cambiare l'opacità dello sfondo:**
```swift
.fill(shieldGreen.opacity(0.15))
// Diventa:
.fill(shieldGreen.opacity(0.3)) // Più opaco
```

**Rimuovere lo scudo:**
```swift
// Rimuovi tutto il .background() e usa solo:
VStack(spacing: 8) {
    // ... contenuto
}
.padding(16)
```

**Usare una forma diversa (es. cerchio):**
```swift
.background(
    Circle()
        .stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 4]))
        .foregroundColor(shieldGreen)
        .background(
            Circle()
                .fill(shieldGreen.opacity(0.15))
        )
)
```

**Usare un rettangolo arrotondato:**
```swift
.background(
    RoundedRectangle(cornerRadius: 20)
        .stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 4]))
        .foregroundColor(shieldGreen)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(shieldGreen.opacity(0.15))
        )
)
```

---

## 🫘 Personalizzazione Pattern Fagioli

Il pattern è definito in `BeanPatternView` (righe 111-136).

### Modifiche possibili:

**Cambiare il numero di fagioli:**
```swift
private let beanPositions: [(x: CGFloat, y: CGFloat)] = [
    (30, 25), (80, 45), (130, 30), (180, 50),
    // Aggiungi più posizioni:
    (50, 70), (120, 85), (200, 100),
]
```

**Cambiare la dimensione dei fagioli:**
```swift
let beanSize: CGFloat = 20
// Diventa:
let beanSize: CGFloat = 30 // Più grandi
```

**Cambiare l'opacità:**
```swift
.fill(color.opacity(0.3))
// Diventa:
.fill(color.opacity(0.5)) // Più visibili
```

**Rimuovere il pattern:**
```swift
// Commenta o rimuovi questa riga nel body:
// BeanPatternView(color: beanPattern)
```

**Cambiare la forma dei fagioli:**
```swift
// Da Ellipse a Rectangle:
Rectangle()
    .fill(color.opacity(0.3))
    .frame(width: beanSize, height: beanSize * 0.6)
```

---

## 📐 Personalizzazione Layout

Il layout principale è nella struct `widgetEntryView` (righe 29-75).

### Modifiche possibili:

**Cambiare lo spacing tra elementi:**
```swift
VStack(spacing: 8)
// Diventa:
VStack(spacing: 16) // Più spazio
```

**Cambiare l'allineamento:**
```swift
VStack(spacing: 8) {
    // ...
}
// Diventa:
HStack(spacing: 8) { // Orizzontale invece di verticale
    // ...
}
```

**Cambiare il padding:**
```swift
.padding(16)
// Diventa:
.padding(20) // Più padding
// O padding specifico:
.padding(.horizontal, 20)
.padding(.vertical, 10)
```

**Centrare diversamente:**
```swift
.frame(maxWidth: .infinity, maxHeight: .infinity)
// Diventa:
.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
```

---

## 🎭 Personalizzazione Background

Il background è definito alle righe 39-42:

```swift
ZStack {
    // Background beige
    beigeBackground
        .ignoresSafeArea()
    
    // Pattern decorativo di fagioli sullo sfondo
    BeanPatternView(color: beanPattern)
    // ...
}
```

### Modifiche possibili:

**Cambiare il colore di sfondo:**
```swift
beigeBackground
// Diventa:
Color.white
Color.black
Color(red: 0.9, green: 0.9, blue: 0.9)
```

**Usare un gradiente:**
```swift
LinearGradient(
    colors: [beigeBackground, shieldGreen.opacity(0.3)],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)
.ignoresSafeArea()
```

**Usare un'immagine di sfondo:**
```swift
Image("widget-background")
    .resizable()
    .scaledToFill()
    .ignoresSafeArea()
```

---

## 📱 Personalizzazione Dimensioni Widget

Le dimensioni supportate sono definite alla riga 148:

```swift
.supportedFamilies([.systemSmall, .systemMedium])
```

### Opzioni disponibili:

```swift
.supportedFamilies([.systemSmall]) // Solo piccolo
.supportedFamilies([.systemMedium]) // Solo medio
.supportedFamilies([.systemLarge]) // Solo grande
.supportedFamilies([.systemSmall, .systemMedium, .systemLarge]) // Tutti
```

### Adattare il layout per dimensione:

Puoi usare `@Environment(\.widgetFamily)` per adattare il layout:

```swift
struct widgetEntryView : View {
    @Environment(\.widgetFamily) var family
    var entry: Provider.Entry
    
    var body: some View {
        switch family {
        case .systemSmall:
            // Layout per widget piccolo
            SmallWidgetView()
        case .systemMedium:
            // Layout per widget medio
            MediumWidgetView()
        case .systemLarge:
            // Layout per widget grande
            LargeWidgetView()
        default:
            SmallWidgetView()
        }
    }
}
```

---

## 🔗 Personalizzazione Deep Link

Il deep link è configurato alla riga 73:

```swift
.widgetURL(URL(string: "beanpositive://addHit"))
```

### Modifiche possibili:

**Cambiare l'URL:**
```swift
.widgetURL(URL(string: "beanpositive://addHit"))
// Diventa:
.widgetURL(URL(string: "beanpositive://home"))
```

**URL con parametri:**
```swift
.widgetURL(URL(string: "beanpositive://addHit?source=widget"))
```

**Rimuovere il deep link (non consigliato):**
```swift
// Rimuovi la riga .widgetURL(...)
```

---

## 📝 Personalizzazione Nome e Descrizione

Nome e descrizione sono alle righe 146-147:

```swift
.configurationDisplayName("Bean Positive")
.description("Aggiungi un fagiolo velocemente dal widget")
```

Questi testi appaiono quando l'utente aggiunge il widget alla home screen.

---

## 🎨 Esempi di Personalizzazioni Complete

### Esempio 1: Widget Minimalista

```swift
struct widgetEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            Color.white
            
            VStack {
                Image(systemName: "plus.circle.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.green)
                
                Text("Aggiungi")
                    .font(.headline)
                    .foregroundColor(.black)
            }
        }
        .widgetURL(URL(string: "beanpositive://addHit"))
    }
}
```

### Esempio 2: Widget con Gradiente

```swift
struct widgetEntryView : View {
    var entry: Provider.Entry
    
    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color.green.opacity(0.3), Color.blue.opacity(0.3)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            
            VStack {
                Text("🌱")
                    .font(.system(size: 50))
                Text("Aggiungi\nun fagiolo")
                    .font(.headline)
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
            }
        }
        .widgetURL(URL(string: "beanpositive://addHit"))
    }
}
```

### Esempio 3: Widget con Contatore

Per mostrare dati dinamici, devi modificare `SimpleEntry` e `Provider`:

```swift
struct SimpleEntry: TimelineEntry {
    let date: Date
    let hitCount: Int // Aggiungi questo
}

// Nel Provider, aggiorna i dati:
func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
    // Leggi i dati da UserDefaults condiviso
    let defaults = UserDefaults(suiteName: "group.com.beanpositive.app")
    let hitCount = defaults?.integer(forKey: "hitCount") ?? 0
    
    let entry = SimpleEntry(date: Date(), hitCount: hitCount)
    let timeline = Timeline(entries: [entry], policy: .atEnd)
    completion(timeline)
}

// Nel widgetEntryView:
Text("\(entry.hitCount)")
    .font(.system(size: 48, weight: .bold))
```

---

## 🔄 Come Testare le Modifiche

1. **Modifica il file** `targets/widget/widgets.swift`
2. **Apri Xcode**: `xed ios`
3. **Seleziona lo schema** "BeanPositiveWidget"
4. **Compila** (⌘B)
5. **Esegui** su simulatore o dispositivo (⌘R)
6. **Aggiungi il widget** alla home screen per vedere le modifiche

---

## 💡 Suggerimenti

- Usa i **Preview** (righe 152-156) per vedere le modifiche in tempo reale in Xcode
- I widget hanno **limiti di memoria** - mantieni il codice semplice
- Testa su **dispositivi reali** - i widget possono comportarsi diversamente dal simulatore
- I colori possono apparire diversi su **dark mode** - considera di supportare entrambi i temi

---

## 🆘 Problemi Comuni

**Il widget non si aggiorna dopo le modifiche:**
- Rimuovi il widget dalla home screen e aggiungilo di nuovo
- Riavvia il simulatore/dispositivo

**I colori non corrispondono:**
- Verifica che i valori RGB siano tra 0.0 e 1.0
- Considera l'opacità e il blending mode

**Il testo è tagliato:**
- Riduci la dimensione del font
- Aumenta il padding
- Usa `.lineLimit(nil)` per permettere più righe

---

Buona personalizzazione! 🎨
