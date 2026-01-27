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
            VStack(spacing: 4) {
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
                        PocketShape()
                            .stroke(
                                Color.black.opacity(0.25),
                                style: StrokeStyle(lineWidth: 2, dash: [6, 4])
                            )
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
        let h = rect.height
        
        let topRadius: CGFloat = w * 0.08
        let bottomRadius: CGFloat = w * 0.12
        let tipHeight: CGFloat = h * 0.18
        
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
        
        // MARK: Bottom right curve
        path.addQuadCurve(
            to: CGPoint(x: w / 2 + bottomRadius, y: tipY - bottomRadius),
            control: CGPoint(x: w, y: sideBottomY)
        )
        
        // MARK: Tip (punta centrale morbida)
        path.addQuadCurve(
            to: CGPoint(x: w / 2 - bottomRadius, y: tipY - bottomRadius),
            control: CGPoint(x: w / 2, y: tipY)
        )
        
        // MARK: Bottom left curve
        path.addQuadCurve(
            to: CGPoint(x: 0, y: sideBottomY - bottomRadius),
            control: CGPoint(x: 0, y: sideBottomY)
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
        (40, 25, 15), (77.5, 20, -25), (115, 25, 30),
        // 2 ai lati (sinistra e destra, parte alta)
        (15, 50, -35), (140, 50, 40),
        // 1 in fondo (centro)
        (77.5, 77.5, 20),
        // 2 ai lati (sinistra e destra, parte bassa)
        (15, 105, 25), (140, 105, -30),
        // 3 in fila (in basso)
        (40, 130, -15), (77.5, 135, 35), (115, 130, -20),
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
