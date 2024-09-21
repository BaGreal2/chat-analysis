# chatan

Chatan (short for "Chat Analysis") is a CLI program designed to analyze and give user some statistics from their [https://telegram.org/](Telegram) chats.

## It's use is simple and straightforward:

Firstly, you install the dependencies:

```bash
npm install
```

And then you can just run it:

```bash
node index.js <file_path> [arguments]
```

**By default**, it will run a [https://www.wikiwand.com/en/articles/Sentiment](sentiment) analysis performed for every individual user, but there are more other options:
| Command specifier | Description |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --sentiment | This options is set **by default** and will output most positive/negative messages for each user based on an extremely simple sentiment analysis. If you specify the output path, it will save all messages sorted by sentiment score to a specified file. |
| --word-frequency | Will output most frequent word for each user. If output path is specified, will output all words sorted by the amount of occurrences. |
| --word-length | Will output longest word for each user. If output path is specified, will output all words sorted by length. |

There are some additional options you can pass to that program:
| Command specifier | Description |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| --ignore-emojis | With this option specified, program will ignore all messages that contain emojis. It is useful for sentiment analysis. |
| --limit-min-word-length \<number\> | With this option you can limit word length that is considered. Words with length lower than specified value will be ignored in a "by-word" analysis. |
| -o, --output \<output_file_path\> | Specifies an output file path for additional information to be saved from each command. |
| -h, --help | Will display help message. |
