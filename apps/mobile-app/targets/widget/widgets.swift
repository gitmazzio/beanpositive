import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date())
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let entry = SimpleEntry(date: Date())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [SimpleEntry] = []
        let currentDate = Date()
        let entry = SimpleEntry(date: currentDate)
        entries.append(entry)
        
        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
}

// Colori condivisi per tutto il widget
extension Color {
    static let widgetPinkBackground = Color(red: 254 / 255, green: 252 / 255, blue: 242 / 255) // Rosa pastello chiaro
}

struct widgetEntryView : View {
    var entry: Provider.Entry
    
    // Colori dal design - aggiornati per matchare l'immagine
    let pocketGreen = Color(red: 201 / 255, green: 206 / 255, blue: 179 / 255) // Verde salvia chiaro
    let darkText = Color(red: 0.3, green: 0.35, blue: 0.3) // Testo verde scuro
    let beanPattern = Color(red: 0.95, green: 0.95, blue: 0.95) // Pattern fagioli molto chiaro
    let borderColor = Color(red: 0.4, green: 0.45, blue: 0.4) // Bordo verde scuro

    var body: some View {
        ZStack {
            // Pattern decorativo di fagioli sullo sfondo
            BeanPatternView(color: beanPattern)
            
            // Pocket centrale
            VStack(spacing: 0) {
                // Icona +
                Text("+")
                    .font(.system(size: 48, weight: .bold))
                    .foregroundColor(darkText)
        
                Text("Aggiungi\nun fagiolo")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(darkText)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)

            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(
                PocketShape()
                    .fill(pocketGreen)
                    .overlay(
                        // Linea interna tratteggiata
                        GeometryReader { geometry in
                            PocketShape()
                                .stroke(
                                    Color.black.opacity(0.3),
                                    style: StrokeStyle(lineWidth: 1, dash: [8, 5])
                                )
                                .scaleEffect(0.8) // Scala al 85% per renderla interna
                                // .offset(
                                //     x: geometry.size.width * 0.05, // Centra la forma scalata
                                //     y: geometry.size.height * 0.05
                                // )
                        }
                    )
            )
            .padding(8)
        }
        .ignoresSafeArea()
        .widgetURL(URL(string: "beanpositive://addHit"))
    }
}

struct PocketShape: Shape {
    func path(in rect: CGRect) -> Path {
        let w = rect.width
        let h = rect.height + 15
        
        let topRadius: CGFloat = w * 0.08
        let bottomRadius: CGFloat = w * 0.12
        let tipHeight: CGFloat = h * 0.25
        
        let tipY = h
        let sideBottomY = h - tipHeight
        
        var path = Path()
        
        // MARK: Top
        path.move(to: CGPoint(x: topRadius, y: 0))
        path.addLine(to: CGPoint(x: w - topRadius, y: 0))
        path.addQuadCurve(
            to: CGPoint(x: w, y: topRadius),
            control: CGPoint(x: w, y: 0)
        )
        
        // MARK: Right side
        path.addLine(to: CGPoint(x: w, y: sideBottomY - bottomRadius))
        
        // MARK: Bottom right curve (più morbida)
        path.addQuadCurve(
            to: CGPoint(x: w / 2 + bottomRadius * 0.4, y: tipY - bottomRadius * 0.4),
            control: CGPoint(x: w * 0.85, y: sideBottomY * 0.9)  // Punto di controllo più morbido
        )
        
        // MARK: Tip (punta appuntita - senza rigonfiamento)
        // Usa una linea diretta verso il punto più basso per una punta più appuntita
        path.addLine(to: CGPoint(x: w / 2, y: tipY))
        
        // MARK: Bottom left curve (più morbida)
        path.addQuadCurve(
            to: CGPoint(x: 0, y: sideBottomY - bottomRadius),
            control: CGPoint(x: w * 0.15, y: sideBottomY * 0.9)  // Punto di controllo più morbido
        )
        
        // MARK: Left side
        path.addLine(to: CGPoint(x: 0, y: topRadius))
        path.addQuadCurve(
            to: CGPoint(x: topRadius, y: 0),
            control: CGPoint(x: 0, y: 0)
        )
        
        path.closeSubpath()
        return path
    }
}


// Pattern decorativo di fagioli
struct BeanPatternView: View {
    let color: Color
    
    // 15 posizioni fisse per i fagioli distribuite sul widget con rotazioni
    // Pattern: 3 prima fila, 2 ai lati, 1 in fondo, 2 ai lati, 3 in fila
    private let beanData: [(x: CGFloat, y: CGFloat, angle: Double)] = [
        // 3 prima fila (in alto)
        (-10, 0, 15), (65, 5, -75), (130, 5, 30),
        // 2 ai lati (sinistra e destra, parte alta)
        (10, 45, -35), (135, 45, 40),
        // 1 in fondo (centro)
        (5, 70, 20),
        // 2 ai lati (sinistra e destra, parte bassa)
        (0, 95, 25), (135, 95, -30),
        // 3 in fila (in basso)
        (30, 200, 15), (60, 205, 76), (115, 200, 10),
    ]
    
    // Colore verde per il bordo
    private let greenBorder = Color(red: 0.4, green: 0.5, blue: 0.4)
    
    // Colore interno del fagiolo
    private let beanFillColor = Color(red: 254 / 255, green: 252 / 255, blue: 242 / 255)
    
    var body: some View {
        GeometryReader { geometry in
            let beanSize: CGFloat = 20
            
            ForEach(Array(beanData.enumerated()), id: \.offset) { index, bean in
                Ellipse()
                    .fill(beanFillColor)
                    .overlay(
                        Ellipse()
                            .stroke(greenBorder, lineWidth: 0.5)
                    )
                    .frame(width: beanSize, height: beanSize * 0.3)
                    .rotationEffect(.degrees(bean.angle))
                    .position(
                        x: min(bean.x, geometry.size.width),
                        y: min(bean.y, geometry.size.height)
                    )
            }
        }
    }
}

struct widget: Widget {
    let kind: String = "BeanPositiveWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            widgetEntryView(entry: entry)
                .containerBackground(Color.widgetPinkBackground, for: .widget)
        }
        .configurationDisplayName("Bean Positive")
        .description("Aggiungi un fagiolo velocemente dal widget")
        .supportedFamilies([.systemSmall])
    }
}

#Preview(as: .systemSmall) {
    widget()
} timeline: {
    SimpleEntry(date: .now)
}
