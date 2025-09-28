import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  hints: number;
};

const BeanSvgComponent = ({ width = 30, height = 32, color = "#B1B79A" }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 30 32" fill="none">
      <Path
        d="M18.4331 0.250918C13.2176 0.980873 9.56828 5.81797 10.2982 11.0335C10.4158 11.8734 9.82802 12.6526 8.98795 12.7702C3.77247 13.5002 0.123131 18.3373 0.853086 23.5527C1.58306 28.7683 6.42014 32.4176 11.6356 31.6876C22.9068 30.1101 30.7931 19.6569 29.2156 8.38579C28.4857 3.17031 23.6486 -0.479038 18.4331 0.250918Z"
        fill={color}
      />
    </Svg>
  );
};

type AnimatedBeanProps = {
  duration: number;
  startTop: number;
  endBottom: number;
  color: string;
};

const AnimatedBean = ({
  duration = 1500,
  startTop = 0,
  endBottom = 0,
  color,
}: AnimatedBeanProps) => {
  const translateY = useRef(new Animated.Value(startTop)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: endBottom,
      duration,
      useNativeDriver: true,
    }).start();
  }, [endBottom, duration, translateY]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <BeanSvgComponent color={color} />
    </Animated.View>
  );
};

const COLORS = [
  "#B1B79A",
  "#A8AF8E",
  "#9FA782",
  "#969F76",
  "#8D976A",
  "#848F5E",
  "#7B8752",
  "#727F46",
  "#69773A",
  "#3F4430",
];

// const PYRAMID_CONFIG = {
//   // Spaziature (facilmente modificabili)
//   HORIZONTAL_SPACING: 25, // Era 40, ora 25 (più stretto)
//   VERTICAL_SPACING: 35, // Era 50, ora 35 (più stretto)

//   // Struttura delle righe (completamente personalizzabile)
//   ROWS: [
//     { count: 1, basePositionIndex: 0 }, // Riga 1: 1 elemento
//     { count: 5, basePositionIndex: 1 }, // Riga 2: 3 elementi
//     { count: 8, basePositionIndex: 2 }, // Riga 3: 5 elementi
//   ],

//   // Per le righe successive
//   DEFAULT_ROW_COUNT: 5,
//   DEFAULT_BASE_POSITION_INDEX: 2,
// };

// const positionsMap = [
//   {
//     bottom: 0,
//     left: -10,
//     right: 0,
//   },
//   {
//     bottom: 15,
//     left: 20,
//     right: 0,
//   },
//   {
//     bottom: 12,
//     left: -30,
//     right: 15,
//   },
// ];

// interface Position {
//   bottom: number;
//   left: number;
//   right: number;
// }

// // Funzione per generare un seed pseudo-casuale deterministico
// function simpleHash(str: string): number {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash = (hash << 5) - hash + char;
//     hash = hash & hash; // Converti a 32-bit integer
//   }
//   return Math.abs(hash);
// }

// // Funzione per randomizzare la posizione all'interno di una riga
// function getRandomizedPositionInRow(
//   elementIndex: number,
//   row: any,
//   customSeed?: number
// ): number {
//   // Crea tutti gli elementi della riga
//   const rowElements = [];
//   for (let i = row.startIndex; i < row.startIndex + row.count; i++) {
//     rowElements.push(i);
//   }

//   // Usa un seed deterministico basato sulla riga + seed personalizzato
//   const seedString = `row_${row.startIndex}_${customSeed || 42}`;
//   const seed = simpleHash(seedString);

//   // Implementa un semplice algoritmo di shuffle deterministico (Fisher-Yates modificato)
//   const shuffled = [...rowElements];
//   let currentSeed = seed;

//   for (let i = shuffled.length - 1; i > 0; i--) {
//     // Genera un numero pseudo-casuale deterministico
//     currentSeed = (currentSeed * 1103515245 + 12345) % 2 ** 31;
//     const randomIndex = Math.abs(currentSeed) % (i + 1);

//     // Scambia gli elementi
//     [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
//   }

//   // Trova la posizione dell'elemento corrente nell'array shuffled
//   const shuffledPosition = shuffled.indexOf(elementIndex);
//   return shuffledPosition;
// }

// function calculateBeanPosition(
//   elementIndex: number,
//   randomSeed?: number
// ): Position {
//   // Usa la configurazione centralizzata
//   const rowConfigs = PYRAMID_CONFIG.ROWS.map((config, index) => ({
//     startIndex: PYRAMID_CONFIG.ROWS.slice(0, index).reduce(
//       (sum, r) => sum + r.count,
//       0
//     ),
//     count: config.count,
//     basePositionIndex: config.basePositionIndex,
//   }));

//   // Trova in quale riga si trova l'elemento
//   let currentRow = null;
//   let positionInRow = -1;
//   let rowNumber = -1;

//   // Prima controlla le righe configurate esplicitamente
//   for (let i = 0; i < rowConfigs.length; i++) {
//     const row = rowConfigs[i];
//     if (
//       elementIndex >= row.startIndex &&
//       elementIndex < row.startIndex + row.count
//     ) {
//       currentRow = row;
//       positionInRow = elementIndex - row.startIndex;
//       rowNumber = i;
//       break;
//     }
//   }

//   // Se l'elemento è oltre le righe configurate, calcola dinamicamente
//   if (!currentRow) {
//     const totalElementsInConfiguredRows = PYRAMID_CONFIG.ROWS.reduce(
//       (sum, r) => sum + r.count,
//       0
//     );
//     const elementsAfterConfigured =
//       elementIndex - totalElementsInConfiguredRows;

//     if (elementsAfterConfigured >= 0) {
//       const additionalRowIndex = Math.floor(
//         elementsAfterConfigured / PYRAMID_CONFIG.DEFAULT_ROW_COUNT
//       );
//       const startIndexForThisRow =
//         totalElementsInConfiguredRows +
//         additionalRowIndex * PYRAMID_CONFIG.DEFAULT_ROW_COUNT;

//       currentRow = {
//         startIndex: startIndexForThisRow,
//         count: PYRAMID_CONFIG.DEFAULT_ROW_COUNT,
//         basePositionIndex: PYRAMID_CONFIG.DEFAULT_BASE_POSITION_INDEX,
//       };

//       positionInRow =
//         elementsAfterConfigured % PYRAMID_CONFIG.DEFAULT_ROW_COUNT;
//       rowNumber = PYRAMID_CONFIG.ROWS.length + additionalRowIndex;
//     }
//   }

//   if (!currentRow) {
//     throw new Error(
//       `Impossibile calcolare la posizione per l'elemento ${elementIndex}`
//     );
//   }

//   // Applica randomizzazione se necessario (tranne per elemento 0)
//   if (elementIndex !== 0 && currentRow.count > 1) {
//     positionInRow = getRandomizedPositionInRow(
//       elementIndex,
//       currentRow,
//       randomSeed
//     );
//   }

//   // Ottieni la posizione base dalla mappa
//   const basePosition = positionsMap[currentRow.basePositionIndex];

//   // Se è l'elemento 0 (base della piramide), restituisci la posizione fissa
//   if (elementIndex === 0) {
//     return { ...basePosition };
//   }

//   // Calcola la spaziatura orizzontale usando la configurazione
//   const totalWidth = (currentRow.count - 1) * PYRAMID_CONFIG.HORIZONTAL_SPACING;
//   const startOffset = -totalWidth / 2; // Centra gli elementi rispetto alla base

//   // Calcola la posizione finale
//   const horizontalOffset =
//     startOffset + positionInRow * PYRAMID_CONFIG.HORIZONTAL_SPACING;

//   // Calcola l'altezza della riga usando la configurazione
//   const bottomOffset = rowNumber * PYRAMID_CONFIG.VERTICAL_SPACING;

//   return {
//     bottom: basePosition.bottom + bottomOffset,
//     left: basePosition.left + horizontalOffset,
//     right: basePosition.right, // Mantieni il valore right originale
//   };
// }

// // Funzione helper per ottenere l'ordine randomizzato di una riga specifica
// function getRowOrder(
//   rowStartIndex: number,
//   rowCount: number,
//   randomSeed?: number
// ): number[] {
//   if (rowCount === 1) return [rowStartIndex]; // Riga con un solo elemento

//   const elements = [];
//   for (let i = rowStartIndex; i < rowStartIndex + rowCount; i++) {
//     elements.push(i);
//   }

//   const seedString = `row_${rowStartIndex}_${randomSeed || 42}`;
//   const seed = simpleHash(seedString);
//   let currentSeed = seed;

//   const shuffled = [...elements];
//   for (let i = shuffled.length - 1; i > 0; i--) {
//     currentSeed = (currentSeed * 1103515245 + 12345) % 2 ** 31;
//     const randomIndex = Math.abs(currentSeed) % (i + 1);
//     [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
//   }

//   return shuffled;
// }

// // Funzione helper per visualizzare la struttura della piramide con randomizzazione
// function printPyramidStructure(
//   totalElements: number,
//   randomSeed?: number
// ): void {
//   console.log("Struttura della piramide (con randomizzazione):");

//   const rowConfig = [
//     { startIndex: 0, count: 1 },
//     { startIndex: 1, count: 3 },
//     { startIndex: 4, count: 5 },
//   ];

//   // Stampa le prime 3 righe (dal top al bottom per visualizzazione)
//   const allRows = [];

//   // Aggiungi le righe configurate
//   for (const row of rowConfig) {
//     const elements = [];
//     for (
//       let i = row.startIndex;
//       i < row.startIndex + row.count && i < totalElements;
//       i++
//     ) {
//       elements.push(i);
//     }
//     allRows.push({ elements, count: row.count });
//   }

//   // Aggiungi le righe successive (5 elementi ciascuna)
//   let currentIndex = 9;
//   while (currentIndex < totalElements) {
//     const elements = [];
//     for (let i = 0; i < 5 && currentIndex < totalElements; i++) {
//       elements.push(currentIndex);
//       currentIndex++;
//     }
//     allRows.push({ elements, count: 5 });
//   }

//   // Randomizza ogni riga (tranne la prima che ha solo l'elemento 0)
//   const randomizedRows = allRows.map((row, rowIndex) => {
//     if (rowIndex === 0) {
//       // La prima riga (elemento 0) rimane fissa
//       return row.elements;
//     }

//     return getRowOrder(row.elements[0], row.elements.length, randomSeed);
//   });

//   // Stampa le righe (dall'alto al basso per visualizzazione)
//   for (let rowIndex = randomizedRows.length - 1; rowIndex >= 0; rowIndex--) {
//     const elements = randomizedRows[rowIndex];
//     const count = allRows[rowIndex].count;
//     const formattedElements = elements.map((el) =>
//       el.toString().padStart(2, " ")
//     );
//     const spacing = " ".repeat(Math.max(0, (5 - count) * 2));
//     console.log(
//       `Riga ${rowIndex + 1}: ${spacing}${formattedElements.join("  ")}`
//     );
//   }
// }
const BeansMapGeneration = ({ hints }: Props) => {
  if (hints === 0) {
    return null;
  }
  const color = useMemo(() => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }, []);

  return (
    <View style={[styles.absolute]}>
      <View
        style={[
          styles.absolute,
          {
            bottom: 0,
          },
        ]}
      >
        <AnimatedBean
          duration={1000}
          startTop={-200}
          endBottom={0}
          color={color}
        />
      </View>

      {/* {[...Array(hints).keys()].map((_, index) => {
        const position = calculateBeanPosition(index);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        return (
          <View
            style={[
              styles.absolute,
              {
                ...position,
              },
            ]}
          >
            <BeanSvgComponent color={color} />
          </View>
        );
      })} */}
    </View>
  );
};

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    bottom: 0,
  },
});

export default BeansMapGeneration;
