import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const COLUMN_PADDING = 6;
const ITEM_GAP = 8;

function Column({ title, icon, emptyText, data, renderItem, keyExtractor, itemSize, refreshing, onRefresh, extraData }) {
  return (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <Ionicons name={icon} size={18} color={COLORS.primary} />
        <Text style={styles.columnTitle}>
          {title} ({data.length})
        </Text>
      </View>

      <FlatList
        data={data}
        extraData={extraData}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <View style={styles.itemWrapper}>{renderItem({ item, size: itemSize })}</View>}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[COLORS.accent]} />
          ) : undefined
        }
        // Renderiza poucos itens por vez e descarta os que saem da tela: menos memória, menos travamentos.
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

/**
 * Duas colunas lado a lado: Imagens | Vídeos.
 * Cada coluna rola de forma independente. Os dados já devem vir ordenados
 * (do mais recente para o mais antigo).
 *
 * renderItem recebe { item, size } — `size` é o lado do quadrado da miniatura.
 */
export default function MediaColumns({ images, videos, renderItem, keyExtractor, refreshing, onRefresh, extraData }) {
  const { width } = useWindowDimensions();
  const itemSize = Math.floor(width / 2 - COLUMN_PADDING * 2);

  const common = { renderItem, keyExtractor, itemSize, refreshing, onRefresh, extraData };

  return (
    <View style={styles.row}>
      <Column title="Imagens" icon="image" emptyText="Nenhuma imagem" data={images} {...common} />
      <View style={styles.divider} />
      <Column title="Vídeos" icon="videocam" emptyText="Nenhum vídeo" data={videos} {...common} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  column: {
    flex: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  columnTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  listContent: {
    padding: COLUMN_PADDING,
    flexGrow: 1,
  },
  itemWrapper: {
    marginBottom: ITEM_GAP,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginTop: 30,
    fontSize: 13,
  },
});
