import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

/**
 * Rede de segurança: se alguma tela lançar um erro de renderização, em vez de o
 * app fechar de uma vez mostramos uma mensagem com botão para tentar de novo.
 */
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Erro não tratado na interface:', error, info && info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Algo deu errado</Text>
        <Text style={styles.message}>O app encontrou um erro inesperado, mas você pode tentar continuar.</Text>
        <TouchableOpacity style={styles.button} onPress={this.reset}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  message: { fontSize: 15, color: COLORS.textMuted, textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: COLORS.accent, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
