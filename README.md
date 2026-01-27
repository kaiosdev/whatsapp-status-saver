# WhatsApp Status Saver - Android

Aplicativo React Native para baixar status do WhatsApp no Android 11+

## 🚀 Recursos

- ✅ Salvar fotos e vídeos dos status do WhatsApp
- ✅ Suporte para WhatsApp e WhatsApp Business
- ✅ Interface intuitiva e fácil de usar
- ✅ Visualização de arquivos salvos
- ✅ Compartilhamento de status
- ✅ Exclusão de arquivos salvos
- ✅ Compatível com Android 11 e superior

## 📋 Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- Android Studio (para emulador) ou dispositivo Android físico
- Expo Go app instalado no dispositivo (disponível na Play Store)

## 🔧 Instalação

1. **Clone ou extraia o projeto:**
```bash
cd whatsapp-status-saver
```

2. **Instale as dependências:**
```bash
npm install
```
ou
```bash
yarn install
```

3. **Inicie o projeto:**
```bash
npm start
```
ou
```bash
expo start
```

4. **Execute no dispositivo:**
   - Abra o app Expo Go no seu Android
   - Escaneie o QR code exibido no terminal ou navegador
   - Aguarde o app carregar

## 📱 Como Usar

1. **Primeira execução:**
   - O app solicitará permissão para acessar mídia e armazenamento
   - Conceda todas as permissões solicitadas

2. **Baixar status:**
   - Abra o WhatsApp e visualize os status que deseja salvar
   - Volte para o Status Saver
   - Na aba "Status", você verá todos os status visualizados recentemente
   - Toque no status para salvá-lo automaticamente na galeria

3. **Gerenciar salvos:**
   - Acesse a aba "Salvos" para ver todos os arquivos baixados
   - Toque no botão compartilhar para enviar o status
   - Toque no botão lixeira para excluir o arquivo

## 🏗️ Compilar APK

### Usando EAS Build (Recomendado):

1. **Instale EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Configure o projeto:**
```bash
eas build:configure
```

3. **Crie a build Android:**
```bash
eas build --platform android --profile production
```

### Usando Expo Build (Alternativa):

```bash
expo build:android
```

## ⚙️ Configurações Importantes

### Permissões Android (app.json)

O app requer as seguintes permissões:
- `READ_EXTERNAL_STORAGE` - Ler status do WhatsApp
- `WRITE_EXTERNAL_STORAGE` - Salvar arquivos
- `MANAGE_EXTERNAL_STORAGE` - Acesso completo (Android 11+)
- `READ_MEDIA_IMAGES` - Ler imagens (Android 13+)
- `READ_MEDIA_VIDEO` - Ler vídeos (Android 13+)

### Caminhos do WhatsApp (Android 11+)

- WhatsApp Normal: `/storage/emulated/0/Android/media/com.whatsapp/WhatsApp/Media/.Statuses`
- WhatsApp Business: `/storage/emulated/0/Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses`

## 🛠️ Estrutura do Projeto

```
whatsapp-status-saver/
├── App.js                          # Componente principal
├── app.json                        # Configurações Expo
├── package.json                    # Dependências
├── babel.config.js                 # Configuração Babel
└── src/
    └── screens/
        ├── StatusScreen.js         # Tela de status do WhatsApp
        ├── SavedScreen.js          # Tela de arquivos salvos
        └── AboutScreen.js          # Tela sobre o app
```

## 🐛 Solução de Problemas

### Status não aparecem:

1. Certifique-se de ter visualizado os status no WhatsApp primeiro
2. Verifique se todas as permissões foram concedidas
3. Tente atualizar a lista puxando para baixo
4. Reinicie o aplicativo

### Erro ao salvar:

1. Verifique as permissões de armazenamento nas configurações do Android
2. Certifique-se de ter espaço disponível no dispositivo
3. Tente conceder permissão "Gerenciar todos os arquivos" manualmente nas configurações

### App não carrega no Expo Go:

1. Certifique-se de que o celular e o computador estão na mesma rede
2. Tente usar conexão via USB com `adb reverse`
3. Limpe o cache: `expo start -c`

## 📝 Notas Importantes

- Este app não é afiliado ao WhatsApp Inc.
- Respeite a privacidade dos outros ao salvar status
- Os arquivos são salvos localmente no dispositivo
- Compatível apenas com Android (iOS tem restrições diferentes)

## 🔒 Privacidade

- O app não coleta dados dos usuários
- Não há conexão com servidores externos
- Todos os arquivos são armazenados localmente
- Nenhuma informação é compartilhada

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👨‍💻 Desenvolvimento

Desenvolvido com React Native e Expo.

### Principais bibliotecas:

- React Navigation - Navegação entre telas
- Expo File System - Manipulação de arquivos
- Expo Media Library - Acesso à galeria
- Ionicons - Ícones do app

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## ⭐ Suporte

Se você achou este projeto útil, considere dar uma estrela!

---

Desenvolvido com ❤️ usando React Native + Expo
