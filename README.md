# Reveal Current File

Минимальное расширение для Visual Studio Code, которое добавляет кнопку в тулбар Explorer и по нажатию раскрывает текущий активный файл в проводнике.

## Что делает расширение

- Добавляет кнопку в тулбар Explorer через `view/title`.
- Для сохраненного файла вызывает стандартное поведение VS Code, аналогичное `Reveal Active File in Explorer`.
- Если файл еще не сохранен (`Untitled`), показывает понятное уведомление.
- Если активного файла нет, показывает уведомление.

## Структура проекта

```text
.
├── .vscode
│   ├── launch.json
│   └── tasks.json
├── src
│   └── extension.ts
├── .vscodeignore
├── LICENSE
├── package.json
├── README.md
└── tsconfig.json
```

## Запуск локально

1. Установить зависимости:

```bash
npm install
```

2. Скомпилировать расширение:

```bash
npm run compile
```

3. Открыть проект в VS Code и нажать `F5`.

Откроется новое окно `Extension Development Host`. В нем:

- откройте любой сохраненный файл;
- в заголовке Explorer появится кнопка с иконкой папки;
- нажмите кнопку, и VS Code откроет Explorer и выделит текущий файл.

## Сборка `.vsix`

Самый простой вариант:

```bash
npm run package
```

Команда выполнит компиляцию и соберет `.vsix` через `@vscode/vsce`.

Альтернатива:

```bash
npx @vscode/vsce package --allow-missing-repository
```

После этого в корне проекта появится файл вида `reveal-current-file-0.0.1.vsix`.

## Как работает реализация

Расширение регистрирует команду `revealCurrentFile.revealInExplorer` в `src/extension.ts` и выводит ее в меню `view/title` для `workbench.explorer.fileView`.

Логика работы такая:

1. Получить URI активного ресурса из текущей вкладки редактора.
2. Если ресурса нет, показать уведомление.
3. Если файл `untitled`, показать уведомление, что его нельзя раскрыть в Explorer.
4. Для обычного файла попытаться вызвать встроенную команду VS Code `workbench.files.action.showActiveFileInExplorer`.
5. Если встроенная команда недоступна или завершилась ошибкой, сделать fallback: открыть Explorer и вызвать `revealInExplorer` напрямую для URI файла.

За счет этого решение остается коротким, надежным и без лишних зависимостей.

## Troubleshooting

If the Explorer button is not visible:

1. Make sure the extension is enabled.
2. Open the Command Palette.
3. Run `Developer: Reload Window`.
4. Check that Explorer is visible.
