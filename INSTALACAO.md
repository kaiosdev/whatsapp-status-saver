# 📱 Guia de Instalação - Status Saver para Android

## ⚡ Instalação Rápida

### Opção 1: Usando Expo Go (Mais Rápido - Recomendado para Testes)

1. **Instale o Expo Go no seu celular Android:**
   - Abra a Play Store
   - Procure por "Expo Go"
   - Instale o aplicativo

2. **No seu computador, instale o Node.js:**
   - Baixe em: https://nodejs.org/
   - Instale a versão LTS (recomendada)

3. **Instale o Expo CLI:**
   ```bash
   npm install -g expo-cli
   ```

4. **Extraia o projeto e entre na pasta:**
   ```bash
   cd whatsapp-status-saver
   ```

5. **Instale as dependências:**
   ```bash
   npm install
   ```

6. **Inicie o projeto:**
   ```bash
   npm start
   ```

7. **No seu celular:**
   - Abra o app Expo Go
   - Escaneie o QR code que aparece no terminal/navegador
   - Aguarde o app carregar

### Opção 2: Gerando APK (Para Instalar Direto no Android)

#### Método A: Usando EAS Build (Recomendado)

1. **Crie uma conta no Expo:**
   - Acesse: https://expo.dev/
   - Crie sua conta gratuita

2. **Instale EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

3. **Faça login:**
   ```bash
   eas login
   ```

4. **Configure o projeto:**
   ```bash
   cd whatsapp-status-saver
   npm install
   eas build:configure
   ```

5. **Crie o APK:**
   ```bash
   eas build --platform android --profile preview
   ```
   
   Obs: Para APK de produção use:
   ```bash
   eas build --platform android --profile production
   ```

6. **Aguarde a build:**
   - Você receberá um link para baixar o APK
   - Baixe o APK no seu celular
   - Instale normalmente

#### Método B: Build Local (Sem conta Expo)

⚠️ **Requisitos:**
- Android Studio instalado
- Java JDK 11
- Variáveis de ambiente configuradas

1. **Instale Android Studio:**
   - Baixe em: https://developer.android.com/studio
   - Instale SDK, NDK e Build Tools

2. **Configure variáveis de ambiente:**
   
   **Windows:**
   ```
   ANDROID_HOME=C:\Users\SeuUsuario\AppData\Local\Android\Sdk
   Adicione ao PATH: %ANDROID_HOME%\platform-tools
   ```
   
   **Linux/Mac:**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **Gere o APK:**
   ```bash
   cd whatsapp-status-saver
   npm install
   expo build:android -t apk
   ```

4. **Baixe e instale o APK gerado**

## 🔧 Configuração de Permissões

### Android 11+

Para que o app funcione no Android 11 ou superior, você precisa:

1. **Nas configurações do Android:**
   - Vá em: Configurações > Apps > Status Saver
   - Permissões > Armazenamento
   - Ative "Permitir gerenciamento de todos os arquivos"

2. **Ou manualmente no código (já configurado):**
   ```javascript
   // Já está em app.json
   "android": {
     "permissions": [
       "READ_EXTERNAL_STORAGE",
       "WRITE_EXTERNAL_STORAGE",
       "MANAGE_EXTERNAL_STORAGE"
     ]
   }
   ```

## 📂 Estrutura de Pastas do WhatsApp

O app busca status nestes locais:

- **WhatsApp Normal:**
  ```
  /storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses
  ```

- **WhatsApp Business:**
  ```
  /storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses
  ```

## ✅ Verificação

Após instalar, verifique se:

1. ✅ O app abre normalmente
2. ✅ Solicita permissões ao iniciar
3. ✅ Você concedeu todas as permissões
4. ✅ Visualizou alguns status no WhatsApp primeiro

## 🚨 Problemas Comuns

### Problema: "Nenhum status encontrado"

**Soluções:**
1. Abra o WhatsApp e visualize alguns status primeiro
2. Volte para o Status Saver e puxe para baixo para atualizar
3. Verifique se concedeu permissão de armazenamento
4. Vá em Configurações > Apps > Status Saver > Permissões e ative tudo

### Problema: "Expo Go não conecta"

**Soluções:**
1. Celular e PC na mesma rede WiFi
2. Desative VPN se estiver usando
3. Tente escanear o QR novamente
4. Use conexão USB:
   ```bash
   adb reverse tcp:8081 tcp:8081
   expo start
   ```

### Problema: "Erro ao salvar arquivo"

**Soluções:**
1. Libere espaço no celular
2. Verifique permissões novamente
3. Reinicie o app
4. Reinstale se necessário

### Problema: "Build falhou"

**Soluções:**
1. Limpe o cache: `expo start -c`
2. Delete node_modules e reinstale:
   ```bash
   rm -rf node_modules
   npm install
   ```
3. Verifique se Node.js está atualizado
4. Tente usar `yarn` ao invés de `npm`

## 📞 Comandos Úteis

```bash
# Limpar cache
expo start -c

# Ver logs do Android
adb logcat

# Listar dispositivos conectados
adb devices

# Desinstalar app
adb uninstall com.yourname.whatsappstatussaver

# Instalar APK via USB
adb install caminho/para/app.apk

# Reiniciar servidor Expo
expo start --clear
```

## 🎯 Checklist de Instalação

- [ ] Node.js instalado
- [ ] Expo CLI instalado (`npm install -g expo-cli`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Expo Go instalado no celular (ou APK gerado)
- [ ] Celular e PC na mesma rede (se usando Expo Go)
- [ ] Permissões concedidas no Android
- [ ] Status visualizados no WhatsApp
- [ ] App funcionando corretamente

## 💡 Dicas

1. **Para desenvolvimento:** Use Expo Go, é mais rápido para testar
2. **Para distribuir:** Gere um APK com EAS Build
3. **Mantenha atualizado:** Execute `npm update` periodicamente
4. **Backup:** Sempre salve seus arquivos importantes antes de testar

## 🎓 Recursos de Aprendizado

- Documentação Expo: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- Fórum Expo: https://forums.expo.dev/

---

**Pronto! Agora você tem tudo para instalar e usar o Status Saver!** 🎉

Se tiver dúvidas, consulte o README.md principal ou procure ajuda na comunidade Expo.
