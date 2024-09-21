import fs from "fs";

import { COLORS, EMOJI_REGEX } from "./constants.js";

export const colorText = (text, color) => {
  return "\x1b[" + color.fg + ";1m" + text + "\x1b[0m";
};

export const log = (text, kind) => {
  switch (kind) {
    case "error":
      console.log(colorText("ERROR:", COLORS.RED), text);
      break;
    case "info":
      console.log(colorText("INFO:", COLORS.BLUE), text);
      break;
    case "log":
      console.log(colorText("LOG:", COLORS.GREEN), text);
      break;
    default:
      console.log(text);
      break;
  }
};

export const printUsage = () => {
  log("");
  log("Usage: node index.js <file_path> [arguments]");
  log("");
  log("Available arguments:");
  log(
    "--ignore-emojies [optional]                 - ignore messages with emojis."
  );
  log(
    '--limit-min-word-length <number> [optional] - limit minimum length of a word to be considered, only works in "by-word" options.'
  );
  log(
    "-o, --output <output_file_path> [optional]  - output file path, if not provided output won't be saved."
  );
  log(
    "--sentiment [default]                       - analyze sentiment of the chat by user."
  );
  log(
    "--word-length                               - get the longest word in the chat and list of all words with length."
  );
  log(
    "--word-frequency                            - get the most fequent word in the chat and list of all words with frequency."
  );
  log("-h, --help                                  - get program usage.");
  log("");
  log("Example: node index.js chat.json --ignore-emojies -o output.txt");
};

export const handleArguments = (args) => {
  if (args.length < 3) {
    log("No file provided", "error");
    printUsage();
    process.exit(1);
  }

  if (["--help", "-h"].includes(args[2])) {
    printUsage();
    process.exit(0);
  }

  if (!args[2].endsWith(".json")) {
    log("File is not a JSON file.", "error");
    process.exit(1);
  }

  let outputPath = null;
  let ignoreEmojis = false;
  let programOption = "sentiment";
  let minWordLength = 0;

  for (let i = 3; i < args.length; i++) {
    if (["--output", "-o"].includes(args[i])) {
      if (!args[i + 1]) {
        log("No output file provided.", "error");
        printUsage();
        process.exit(1);
      }

      outputPath = args[i + 1];
      i++;
    } else if (["--limit-min-word-length"].includes(args[i])) {
      if (!args[i + 1]) {
        log("No minimum length provided.", "error");
        printUsage();
        process.exit(1);
      }

      minWordLength = parseInt(args[i + 1]);
      i++;
    } else if (["--ignore-emojis"].includes(args[i])) {
      ignoreEmojis = true;
    } else if (["--sentiment"].includes(args[i])) {
      programOption = "sentiment";
    } else if (["--word-frequency"].includes(args[i])) {
      programOption = "word-frequency";
    } else {
      log(`Invalid argument ${args[i]}.`, "error");
      printUsage();
      process.exit(1);
    }
  }

  const chatInfo = JSON.parse(fs.readFileSync(args[2], "utf8"));

  return {
    chatInfo,
    outputPath,
    ignoreEmojis,
    programOption,
    minWordLength,
  };
};

export const extractMessagesByUser = (chatInfo, ignoreEmojis) => {
  const userMessages = new Map();

  for (const message of chatInfo.messages) {
    if (message.type !== "message" || message.file) {
      continue;
    }

    const username = message.from;
    let textContent = message.text;

    if (typeof textContent !== "string") {
      textContent = textContent[0].text;
    }

    if (typeof textContent !== "string") {
      continue;
    }

    if (ignoreEmojis && textContent.match(EMOJI_REGEX)) {
      continue;
    }

    if (userMessages.has(username)) {
      userMessages.get(username).push(textContent);
    } else {
      userMessages.set(username, [textContent]);
    }
  }

  return userMessages;
};
