import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * Miniatura quadrada de uma foto ou vídeo.
 * - `resizeMethod="resize"` faz o Android reduzir a imagem ANTES de carregar na
 *   memória (fotos grandes em tamanho cheio são uma causa clássica de fechamento do app).
 * - Se a imagem falhar ao carregar, mostra um ícone no lugar em vez de quebrar.
 */
function MediaThumb({ uri, isVideo, size, children }) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {failed ? (
        <View style={styles.placeholder}>
          <Ionicons name={isVideo ? 'videocam' : 'image'} size={36} color="#bbb" />
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          resizeMethod="resize"
          onError={() => setFailed(true)}
        />
      )}

      {isVideo && (
        <View style={styles.playOverlay} pointerEvents="none">
          <Ionicons name="play-circle" size={40} color="white" />
        </View>
      )}

      {children}
    </View>
  );
}

export default React.memo(MediaThumb);

const styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
