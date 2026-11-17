# WhatsApp Status Saver

Aplicativo Android feito com **React Native + Expo** para ver e salvar na galeria os status do WhatsApp que você já visualizou.

> Este projeto não é afiliado ao WhatsApp Inc. Respeite a privacidade das pessoas ao salvar os status delas.

## Recursos

- Lista os status do WhatsApp (e WhatsApp Business) em **abas separadas: Imagens | Vídeos**
- Mídias ordenadas **das mais recentes para as mais antigas**
- Pede permissão da pasta **uma única vez** (a escolha fica salva entre as aberturas do app)
- Salva o status na galeria (álbum "Status WhatsApp") com um toque
- Aba "Salvos" com as mesmas abas, além de compartilhar e excluir
- Compatível com Android 11 ou superior

## Como o app funciona

### Por que é preciso escolher uma pasta?

A partir do Android 11, nenhum app pode ler `Android/media/com.whatsapp/...` diretamente. A única forma sem privilégios especiais é o **Storage Access Framework (SAF)**: o app abre o seletor de pastas do sistema, o usuário escolhe a pasta `.Statuses` e o Android entrega uma permissão sobre essa pasta.

### Permissão persistente (sem pedir toda vez)

1. Na primeira vez, `StorageAccessFramework.requestDirectoryPermissionsAsync` abre o seletor. O Expo já pede ao Android para **manter** essa permissão (`takePersistableUriPermission`).
2. A URI da pasta é guardada no `AsyncStorage` (`@whatsapp_status_dir_uri`).
3. Nas próximas aberturas o app lê essa URI e já lista a pasta, sem perguntar nada.
4. A permissão só é descartada se o Android realmente a revogar (erro de leitura por permissão). Erros passageiros mostram "Tentar novamente" e **mantêm** a permissão salva.

### Ordenação por data

O Android **não informa a data de modificação** dos arquivos lidos via SAF, e os nomes dos status do WhatsApp são códigos aleatórios (não têm data). Por isso o app registra o momento em que viu cada arquivo pela primeira vez e ordena por esse registro (`@whatsapp_status_first_seen`). Registros de status que já sumiram (eles expiram em 24 h) são removidos automaticamente.

Consequência: status que aparecem na mesma abertura do app ficam agrupados e, entre eles, a ordem é a da listagem do Android. Quanto mais seguido você abre o app, mais fiel é a ordem. Na aba "Salvos" a ordem é exata, pois usa a data de criação da galeria.

### Fluxo ao salvar um status

1. Toque na miniatura → `ensureMediaPermission()` garante a permissão da galeria.
2. O arquivo é copiado da pasta SAF para o cache do app (`FileSystem.copyAsync`).
3. `MediaLibrary.createAssetAsync` cria o item na galeria e ele é colocado no álbum "Status WhatsApp".
4. O arquivo temporário é apagado.

## Estrutura do projeto

```
whatsapp-status-saver/
├── App.js                      # Navegação em abas (Status, Salvos, Sobre) + ErrorBoundary
├── app.json                    # Configuração do Expo (nome, ícones, permissões)
├── eas.json                    # Perfis de build (EAS)
├── package.json
├── INSTALACAO.md               # Guia detalhado de instalação
└── src/
    ├── constants.js            # Chaves do AsyncStorage, nome do álbum, extensões, cores
    ├── screens/
    │   ├── StatusScreen.js     # Lista os status da pasta autorizada e salva na galeria
    │   ├── SavedScreen.js      # Lista o álbum "Status WhatsApp"; compartilhar e excluir
    │   └── AboutScreen.js      # Instruções e informações do app
    ├── components/
    │   ├── MediaTabs.js        # Abas Imagens | Vídeos, cada uma em grade de 2 colunas
    │   ├── MediaThumb.js       # Miniatura (foto/vídeo) com ícone de play e fallback se falhar
    │   └── ErrorBoundary.js    # Evita que um erro de tela feche o app inteiro
    ├── services/
    │   ├── statusService.js    # SAF: escolher/guardar pasta, listar mídias, ordenar por recência
    │   └── permissions.js      # Permissão da galeria (um pedido por vez)
    └── utils/
        └── media.js            # Nome/tipo do arquivo, ordenação e separação imagem × vídeo
```

**Divisão de responsabilidades:** as telas cuidam do estado e da interface; `services/` fala com o Android (permissões e arquivos); `utils/` tem funções puras; `components/` são peças de interface reutilizadas pelas duas telas.

## Correções desta versão

| Problema | Causa | Correção |
| --- | --- | --- |
| Pedia a pasta de novo a cada abertura | O app validava a pasta salva com `getInfoAsync`, que sempre responde "não existe" para pastas SAF, e então apagava a permissão | Não valida mais assim; usa a URI salva e só a descarta se o Android revogar a permissão |
| App fechando de vez em quando | Pedidos de permissão simultâneos (App.js + telas); fotos carregadas em tamanho cheio; toques repetidos ao salvar; respostas antigas chegando depois da tela mudar; nome de arquivo inválido (URI codificada) | Pedido de permissão único e reaproveitado, `resizeMethod="resize"`, listas virtualizadas, trava de toque duplo, descarte de respostas antigas, nome de arquivo tratado e `ErrorBoundary` |
| Spinner eterno se a galeria fosse negada | O carregamento dependia da permissão da galeria | A galeria só é pedida na hora de salvar |
| "Salvos" mostrava no máximo 20 itens | `getAssetsAsync` devolve 20 por padrão | Busca em páginas até o fim |
| Botão compartilhar enviava só texto | `Share.share({ url })` ignora `url` no Android | Usa `expo-sharing` com o arquivo de verdade |

## Como rodar

Requisitos: Node.js 18+, um celular Android com o app **Expo Go** (ou emulador).

```bash
npm install
npx expo start
```

Escaneie o QR code com o Expo Go. Para limpar o cache: `npx expo start -c`.

### Primeiro uso

1. Abra o app e toque em **Permitir Acesso**.
2. No seletor, navegue até `Android > media > com.whatsapp > WhatsApp > Media > .Statuses` (WhatsApp Business: `com.whatsapp.w4b > WhatsApp Business > Media > .Statuses`).
3. Toque em **Usar esta pasta** e confirme. Isso só é necessário uma vez.
4. Veja os status no WhatsApp, volte ao app e toque na miniatura para salvar.

## Gerar o APK (EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Solução de problemas

- **Nenhum status aparece:** veja os status no WhatsApp antes, puxe a lista para atualizar e confira se a pasta escolhida é a `.Statuses`. Use o ícone de pasta no topo para trocar.
- **Erro ao salvar:** confirme a permissão de fotos/vídeos do app nas configurações do Android e se há espaço no aparelho.
- **Pediu a pasta de novo:** acontece se o Android revogar a permissão (por exemplo, ao limpar os dados do app ou do Expo Go). Escolha a pasta novamente.
- **Expo Go não carrega:** celular e computador devem estar na mesma rede; tente `npx expo start --tunnel`.

## Limitações conhecidas

- A ordem dos status da aba "Status" é por "primeira vez que o app viu o arquivo" (ver acima). Para usar a data real do arquivo seria necessário um módulo nativo, o que exigiria sair do Expo Go e usar uma build de desenvolvimento.
- A miniatura dos vídeos depende do Android conseguir gerar um quadro do arquivo; se não conseguir, aparece um ícone no lugar.

## Principais bibliotecas

React Navigation (abas), Expo File System (SAF e cópia de arquivos), Expo Media Library (galeria), Expo Sharing (compartilhar), AsyncStorage (guardar a pasta e a ordem), Ionicons (ícones).

## Privacidade

O app não coleta dados nem se conecta a servidores. Tudo fica no aparelho.

## Licença

MIT.
