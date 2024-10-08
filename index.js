import {
  log,
  handleArguments,
  extractMessagesByUser,
} from "./modules/shared.js";
import { analyzeSentiment } from "./modules/sentiment.js";
import { analyzeWordsFrequency } from "./modules/frequency.js";
import { analyzeWordsLength } from "./modules/length.js";

const args = process.argv;
const {
  chatInfo,
  outputPath,
  ignoreEmojis,
  programOption,
  minWordLength,
  maxWordLength,
} = handleArguments(args);

if (minWordLength !== 0) {
  log(`Minimum word length set to ${minWordLength}.`, "info");
}
if (maxWordLength !== Infinity) {
  log(`Maximum word length set to ${maxWordLength}.`, "info");
}
log(`Analyzing "${chatInfo.name}" chat.`, "info");

const userMessages = extractMessagesByUser(chatInfo, ignoreEmojis);
log("Chat mapping by user completed.", "log");

switch (programOption) {
  case "sentiment":
    log("Analyzing chat sentiment.", "info");
    analyzeSentiment(userMessages, outputPath);
    break;
  case "word-frequency":
    log("Analyzing word frequency.", "info");
    analyzeWordsFrequency(
      userMessages,
      minWordLength,
      maxWordLength,
      outputPath
    );
    break;
  case "word-length":
    log("Analyzing word length.", "info");
    analyzeWordsLength(userMessages, minWordLength, maxWordLength, outputPath);
    break;
  default:
    log("Invalid program option.", "error");
    process.exit(1);
}
