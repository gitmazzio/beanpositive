# Documentazione: Creare Forme Personalizzate in SwiftUI

Questa guida spiega come creare forme geometriche personalizzate in SwiftUI, con focus sulla forma "pocket" (tasca) usata nel widget.

## 📚 Concetti Base

### Shape Protocol

In SwiftUI, qualsiasi forma personalizzata è una `struct` che conforma al protocol `Shape`:

```swift
struct MyCustomShape: Shape {
    func path(in rect: CGRect) -> Path {
        // Disegna la forma qui
    }
}
```

### Path

`Path` è il tipo che rappresenta un percorso di disegno. Puoi costruirlo usando vari metodi:

- `move(to:)` - Sposta il punto corrente senza disegnare
- `addLine(to:)` - Disegna una linea retta
- `addArc(...)` - Disegna un arco
- `addQuadCurve(...)` - Disegna una curva quadratica (bezier)
- `addCurve(...)` - Disegna una curva cubica (bezier)
- `closeSubpath()` - Chiude il percorso tornando al punto iniziale

### CGRect

Il parametro `rect` rappresenta il rettangolo di delimitazione della forma. Usa sempre valori relativi:

- `rect.width` / `rect.height` - Dimensioni
- `rect.minX` / `rect.minY` - Punto in alto a sinistra
- `rect.maxX` / `rect.maxY` - Punto in basso a destra
- `rect.midX` / `rect.midY` - Centro

**⚠️ IMPORTANTE**: Non usare mai valori hardcoded! Usa sempre valori relativi a `rect` per rendere la forma adattiva.

---

## 🎨 Forma Pocket (Tasca)

La forma pocket nel widget è definita in `PocketShape`. Ecco come funziona:

### Struttura Base

```swift
struct PocketShape: Shape {
    var topCornerRadius: CGFloat = 12
    var bottomCurveDepth: CGFloat = 0.25
    var sideCurve: CGFloat = 0.05
    
    func path(in rect: CGRect) -> Path {
        // Disegna la forma
    }
}
```

### Spiegazione dei Parametri

1. **`topCornerRadius`**: Arrotondamento degli angoli superiori
2. **`bottomCurveDepth`**: Profondità della curva inferiore (0.0 = piatto, 1.0 = molto profondo)
3. **`sideCurve`**: Quanto i lati si curvano verso l'interno

### Come Funziona il Path

```
1. Inizia dal top-left (dopo l'arrotondamento)
   ↓
2. Disegna arco superiore sinistro
   ↓
3. Top edge piatto (con leggera curvatura)
   ↓
4. Arco superiore destro
   ↓
5. Lato destro che curva verso l'interno
   ↓
6. Curva inferiore a V rovesciata (centro)
   ↓
7. Lato sinistro che torna su
   ↓
8. Chiude il percorso
```

### Codice Completo

```swift
struct PocketShape: Shape {
    var topCornerRadius: CGFloat = 12
    var bottomCurveDepth: CGFloat = 0.25
    var sideCurve: CGFloat = 0.05
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.width
        let height = rect.height
        
        // Calcola i punti chiave
        let bottomCenterY = rect.minY + height * (1.0 - bottomCurveDepth)
        let bottomCenter = CGPoint(x: rect.midX, y: bottomCenterY)
        let sideCurveOffset = width * sideCurve
        
        // Inizia dal top-left
        path.move(to: CGPoint(x: rect.minX + topCornerRadius, y: rect.minY))
        
        // Arco superiore sinistro
        path.addArc(
            center: CGPoint(x: rect.minX + topCornerRadius, y: rect.minY + topCornerRadius),
            radius: topCornerRadius,
            startAngle: .degrees(180),
            endAngle: .degrees(270),
            clockwise: false
        )
        
        // Top edge piatto con curvatura
        path.addQuadCurve(
            to: CGPoint(x: rect.maxX - topCornerRadius, y: rect.minY),
            control: CGPoint(x: rect.midX, y: rect.minY - sideCurveOffset)
        )
        
        // Arco superiore destro
        path.addArc(
            center: CGPoint(x: rect.maxX - topCornerRadius, y: rect.minY + topCornerRadius),
            radius: topCornerRadius,
            startAngle: .degrees(270),
            endAngle: .degrees(0),
            clockwise: false
        )
        
        // Lato destro
        path.addQuadCurve(
            to: CGPoint(x: rect.maxX - sideCurveOffset, y: bottomCenterY - 10),
            control: CGPoint(x: rect.maxX + sideCurveOffset * 0.5, y: rect.midY)
        )
        
        // Curva inferiore a V
        path.addQuadCurve(
            to: CGPoint(x: rect.minX + sideCurveOffset, y: bottomCenterY - 10),
            control: bottomCenter
        )
        
        // Lato sinistro
        path.addQuadCurve(
            to: CGPoint(x: rect.minX + topCornerRadius, y: rect.minY + topCornerRadius),
            control: CGPoint(x: rect.minX - sideCurveOffset * 0.5, y: rect.midY)
        )
        
        path.closeSubpath()
        return path
    }
}
```

---

## 🔧 Metodi Path Disponibili

### 1. move(to:)
Sposta il punto corrente senza disegnare.

```swift
path.move(to: CGPoint(x: 10, y: 10))
```

### 2. addLine(to:)
Disegna una linea retta dal punto corrente al punto specificato.

```swift
path.addLine(to: CGPoint(x: 100, y: 100))
```

### 3. addArc()
Disegna un arco circolare.

```swift
path.addArc(
    center: CGPoint(x: 50, y: 50),  // Centro del cerchio
    radius: 25,                      // Raggio
    startAngle: .degrees(0),          // Angolo iniziale
    endAngle: .degrees(90),          // Angolo finale
    clockwise: false                  // Direzione
)
```

**Angoli**: Usa `.degrees()` o `.radians()`
- `0°` = destra
- `90°` = basso
- `180°` = sinistra
- `270°` = alto

### 4. addQuadCurve()
Disegna una curva quadratica (Bezier) con un punto di controllo.

```swift
path.addQuadCurve(
    to: CGPoint(x: 100, y: 100),           // Punto finale
    control: CGPoint(x: 50, y: 150)        // Punto di controllo
)
```

Il punto di controllo "attira" la curva verso di sé.

### 5. addCurve()
Disegna una curva cubica con due punti di controllo.

```swift
path.addCurve(
    to: CGPoint(x: 100, y: 100),           // Punto finale
    control1: CGPoint(x: 50, y: 50),       // Primo controllo
    control2: CGPoint(x: 75, y: 150)       // Secondo controllo
)
```

### 6. closeSubpath()
Chiude il percorso tornando al punto iniziale.

```swift
path.closeSubpath()
```

---

## 🎯 Esempi di Forme Comuni

### Rettangolo Arrotondato

```swift
struct RoundedRectangleShape: Shape {
    var cornerRadius: CGFloat = 10
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        
        path.move(to: CGPoint(x: rect.minX + cornerRadius, y: rect.minY))
        path.addLine(to: CGPoint(x: rect.maxX - cornerRadius, y: rect.minY))
        path.addArc(
            center: CGPoint(x: rect.maxX - cornerRadius, y: rect.minY + cornerRadius),
            radius: cornerRadius,
            startAngle: .degrees(270),
            endAngle: .degrees(0),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - cornerRadius))
        path.addArc(
            center: CGPoint(x: rect.maxX - cornerRadius, y: rect.maxY - cornerRadius),
            radius: cornerRadius,
            startAngle: .degrees(0),
            endAngle: .degrees(90),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: rect.minX + cornerRadius, y: rect.maxY))
        path.addArc(
            center: CGPoint(x: rect.minX + cornerRadius, y: rect.maxY - cornerRadius),
            radius: cornerRadius,
            startAngle: .degrees(90),
            endAngle: .degrees(180),
            clockwise: false
        )
        path.addLine(to: CGPoint(x: rect.minX, y: rect.minY + cornerRadius))
        path.addArc(
            center: CGPoint(x: rect.minX + cornerRadius, y: rect.minY + cornerRadius),
            radius: cornerRadius,
            startAngle: .degrees(180),
            endAngle: .degrees(270),
            clockwise: false
        )
        path.closeSubpath()
        
        return path
    }
}
```

### Stella

```swift
struct StarShape: Shape {
    var points: Int = 5
    var innerRadius: CGFloat = 0.4
    
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let center = CGPoint(x: rect.midX, y: rect.midY)
        let outerRadius = min(rect.width, rect.height) / 2
        let innerRadius = outerRadius * self.innerRadius
        
        for i in 0..<points * 2 {
            let angle = Double(i) * .pi / Double(points)
            let radius = i % 2 == 0 ? outerRadius : innerRadius
            let x = center.x + CGFloat(cos(angle)) * radius
            let y = center.y + CGFloat(sin(angle)) * radius
            
            if i == 0 {
                path.move(to: CGPoint(x: x, y: y))
            } else {
                path.addLine(to: CGPoint(x: x, y: y))
            }
        }
        
        path.closeSubpath()
        return path
    }
}
```

### Cuore

```swift
struct HeartShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.width
        let height = rect.height
        
        // Punto superiore sinistro
        path.move(to: CGPoint(x: width * 0.5, y: height * 0.25))
        
        // Curva sinistra
        path.addCurve(
            to: CGPoint(x: width * 0.1, y: height * 0.5),
            control1: CGPoint(x: width * 0.2, y: height * 0.1),
            control2: CGPoint(x: width * 0.05, y: height * 0.3)
        )
        
        // Curva inferiore sinistra
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: height * 0.9),
            control1: CGPoint(x: width * 0.05, y: height * 0.7),
            control2: CGPoint(x: width * 0.2, y: height * 0.85)
        )
        
        // Curva inferiore destra
        path.addCurve(
            to: CGPoint(x: width * 0.9, y: height * 0.5),
            control1: CGPoint(x: width * 0.8, y: height * 0.85),
            control2: CGPoint(x: width * 0.95, y: height * 0.7)
        )
        
        // Curva destra
        path.addCurve(
            to: CGPoint(x: width * 0.5, y: height * 0.25),
            control1: CGPoint(x: width * 0.95, y: height * 0.3),
            control2: CGPoint(x: width * 0.8, y: height * 0.1)
        )
        
        path.closeSubpath()
        return path
    }
}
```

---

## 🎨 Usare le Forme

### Fill (Riempimento)

```swift
PocketShape()
    .fill(Color.green)
```

### Stroke (Bordo)

```swift
PocketShape()
    .stroke(Color.blue, lineWidth: 2)
```

### Stroke con Stile (Tratteggiato)

```swift
PocketShape()
    .stroke(
        style: StrokeStyle(
            lineWidth: 3,
            dash: [6, 4]  // [linea, spazio]
        )
    )
    .foregroundColor(.blue)
```

### Combinare Fill e Stroke

```swift
PocketShape()
    .fill(Color.green.opacity(0.3))
    .overlay(
        PocketShape()
            .stroke(style: StrokeStyle(lineWidth: 2, dash: [8, 4]))
            .foregroundColor(.blue)
    )
```

### Clip Content

```swift
Image("myImage")
    .resizable()
    .clipShape(PocketShape())
```

---

## 🔄 Rendere le Forme Animabili

Per animare parametri della forma, usa `animatableData`:

```swift
struct AnimatedPocketShape: Shape {
    var bottomCurveDepth: CGFloat = 0.25
    
    var animatableData: CGFloat {
        get { bottomCurveDepth }
        set { bottomCurveDepth = newValue }
    }
    
    func path(in rect: CGRect) -> Path {
        // Usa bottomCurveDepth nel path
    }
}
```

Poi anima:

```swift
@State private var depth: CGFloat = 0.25

AnimatedPocketShape(bottomCurveDepth: depth)
    .animation(.spring(), value: depth)

// Cambia depth per animare
Button("Anima") {
    depth = depth == 0.25 ? 0.5 : 0.25
}
```

---

## 📚 Risorse Utili

### Documentazione Apple
- [Shape Protocol](https://developer.apple.com/documentation/swiftui/shape)
- [Path](https://developer.apple.com/documentation/swiftui/path)
- [CGRect](https://developer.apple.com/documentation/coregraphics/cgrect)

### Tutorial
- [Kodeco - Custom Shapes](https://www.kodeco.com/books/swiftui-cookbook/v1.0/chapters/9-add-a-custom-shape-to-a-view-in-swiftui)
- [SwiftUI Field Guide - Shapes](https://www.swiftuifieldguide.com/layout/shape/)

### Tools Utili
- **PaintCode**: Genera codice SwiftUI da disegni
- **Figma/Sketch**: Disegna la forma e calcola i punti manualmente

---

## 💡 Suggerimenti

1. **Usa sempre valori relativi**: `rect.width * 0.5` invece di `100`
2. **Testa su diverse dimensioni**: La forma deve adattarsi a qualsiasi dimensione
3. **Usa Preview**: Xcode Preview ti permette di vedere le modifiche in tempo reale
4. **Inizia semplice**: Crea prima una versione base, poi aggiungi dettagli
5. **Usa punti di controllo**: Sperimenta con `addQuadCurve` per curve morbide

---

## 🐛 Debugging

### La forma non appare
- Verifica che `path.closeSubpath()` sia chiamato
- Controlla che tutti i punti siano dentro `rect`
- Assicurati che la forma abbia un'area > 0

### La forma è distorta
- Usa sempre valori relativi a `rect`
- Evita valori hardcoded
- Considera l'aspect ratio

### Le curve non sono lisce
- Aggiusta i punti di controllo
- Usa `addCurve` invece di `addQuadCurve` per più controllo
- Sperimenta con diversi valori

---

Buona creazione di forme! 🎨
