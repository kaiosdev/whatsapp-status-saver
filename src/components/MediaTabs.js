import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

const GRID_PADDING = 6;
const ITEM_GAP = 8;
const NUM_COLUMNS = 2;

const TABS = [
  { key: 'images', title: 'Imagens', icon: 'image', emptyText: 'Nenhuma imagem' },
  { key: 'videos', title: 'Vídeos', icon: 'videocam', emptyText: 'Nenhum vídeo' },
];

/**
 * Abas "Imagens" | "Vídeos". Cada aba ocupa a tela inteira e mostra apenas
 * o seu tipo de mídia em uma grade de 2 colunas.
 *
 * renderItem recebe { item, size } — `size` é o lado do quadrado da miniatura.
 */
export default function MediaTabs({ images, videos, renderItem, keyExtractor, refreshing, onRefresh, extraData }) {
  const [active, setActive] = useState('images');
  const { width } = useWindowDimensions();
  const itemSize = Math.floor((width - GRID_PADDING * 2 - ITEM_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS);

  const counts = { images: images.length, videos: videos.length };
  const current = TABS.find((t) => t.key === active);
  const data = active === 'images' ? images : videos;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const selected = tab.key === active;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, selected && styles.tabSelected]}
              onPress={() => setActive(tab.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
            >
              <Ionicons name={tab.icon} size={18} color={selected ? COLORS.primary : COLORS.textLight} />
              <Text style={[styles.tabTitle, selected && styles.tabTitleSelected]}>
                {tab.title} ({counts[tab.key]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        key={active}
        data={data}
        extraData={extraData}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        renderItem={({ item }) => <View style={styles.itemWrapper}>{renderItem({ item, size: itemSize })}</View>}
        columnWrapperStyle={styles.rowWrapper}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>{current.emptyText}</Text>}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} colors={[COLORS.accent]} />
          ) : undefined
        }
        // Renderiza poucos itens por vez e descarta os que saem da tela: menos memória, menos travamentos.
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabSelected: {
    borderBottomColor: COLORS.accent,
  },
  tabTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  tabTitleSelected: {
    color: COLORS.primary,
  },
  listContent: {
    padding: GRID_PADDING,
    flexGrow: 1,
  },
  rowWrapper: {
    justifyContent: 'space-between',
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
