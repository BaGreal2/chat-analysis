import {
  log,
  handleArguments,
  extractMessagesByUser,
} from "./modules/shared.js";
import { analyzeSentiment } from "./modules/sentiment.js";
import { analyzeWordsFrequency } from "./modules/frequency.js";

const args = process.argv;
const { chatInfo, outputPath, ignoreEmojis, programOption, minWordLength } =
  handleArguments(args);

log(`Minimum word length set to ${minWordLength}.`, "info");
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
    analyzeWordsFrequency(userMessages, minWordLength, outputPath);
    break;
  default:
    log("Invalid program option.", "error");
    process.exit(1);
}
