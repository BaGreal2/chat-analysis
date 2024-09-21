# chatan

Chatan (short for "Chat Analysis") is a CLI tool designed to analyze and give user some statistics from their [Telegram](https://telegram.org/) chats.

## It's use is simple and straightforward:

To use chatan, you'll first need to export the desired Telegram chat as a JSON file.
Follow the instructions below to export your chat data via the [Telegram Desktop](https://desktop.telegram.org/?setln=en) app.

> **Note for MacOS Users:** Make sure to download Telegram Desktop directly from the website, not from the App Store.

### How to export a chats:

1. Open Telegram Desktop and navigate to the chat you want to analyze.
2. Click on the three dots in the top-right corner.
3. Select the "Export chat history" option.
4. Uncheck all items and set the format to **JSON**.
5. Wait for the export to finish.

### Installation

Install the required dependencies:

```bash
npm install
```

### Running the program

Run the program with:

```bash
node index.js <file_path> [arguments]
```

**By default**, chatan performs a [sentiment analysis](https://www.wikiwand.com/en/articles/Sentiment) for each user in the chat. You can also specify different analysis modes via options:
| Command specifier | Description |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--sentiment` | The default command. It outputs the most positive/negative messages for each user using a simple sentiment analysis. If an output path is specified, it saves all messages sorted by sentiment score to the specified file. |
| `--word-frequency` | Outputs the most frequent word for each user. If an output path is specified, it saves all words sorted by their frequency. |
| `--word-length` | Outputs the longest word for each user. If an output path is specified, it saves all words sorted by their length. |

There are some additional options you can pass to the program:
| Command specifier | Description |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--ignore-emojis` | Ignores all messages containing emojis. Useful for improving sentiment analysis. |
| `--limit-min-word-length <number>` | Limits the analysis to words with a length greater than the specified number. Useful for focusing on significant words in word frequency or word length analyses. |
| `-o, --output <output_file_path>` | Specifies a file to save the detailed output from any command. |
| `-h, --help` | Displays help information for using the program. |
