import fs from "fs";

import { log, extractWords } from "./shared.js";

const formatFrequencyListToString = (list) => {
  let result = "";
  for (let i = 0; i < list.length; i++) {
    result += `"${list[i][0]}": ${list[i][1]} occurrences.\n`;
  }
  return result;
};

const analyzeWordsFrequencyByUser = (
  userMessages,
  minWordLength,
  maxWordLength
) => {
  const wordsFrequency = new Map();

  for (const [username, messages] of userMessages) {
    log(`Analyzing user ${username}.`, "log");

    let mostFrequentWord = {
      word: null,
      count: 0,
    };

    for (var i = 0; i < messages.length; i++) {
      process.stdout.write(`${i}/${messages.length} \r`);

      const message = messages[i];
      const words = extractWords(message, minWordLength, maxWordLength);

      for (var j = 0; j < words.length; j++) {
        const word = words[j];

        if (!wordsFrequency.has(word)) {
          wordsFrequency.set(word, 1);
        } else {
          wordsFrequency.set(word, wordsFrequency.get(word) + 1);
        }

        if (mostFrequentWord.count < wordsFrequency.get(word)) {
          mostFrequentWord = {
            word,
            count: wordsFrequency.get(word),
          };
        }
      }

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }

    log(
      `Most frequent word for ${username}: "${mostFrequentWord.word}"`,
      "info"
    );
  }

  return wordsFrequency;
};

export const analyzeWordsFrequency = (
  userMessages,
  minWordLength,
  maxWordLength,
  outputPath
) => {
  const wordsFrequency = analyzeWordsFrequencyByUser(
    userMessages,
    minWordLength,
    maxWordLength
  );
  log("Word frequency analysis completed.", "log");

  const sortedWordsFrequency = [...wordsFrequency.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  if (outputPath) {
    try {
      fs.writeFileSync(
        outputPath,
        formatFrequencyListToString(sortedWordsFrequency)
      );
      log(
        `List of all words sorted by frequency written successfully to "${outputPath}" file!`,
        "log"
      );
    } catch (error) {
      log(
        `Unexpected error while writing to a file: ${error.message}.`,
        "error"
      );
    }
  }

  const mostFrequentWord = sortedWordsFrequency[0];
  const leastFrequentWord =
    sortedWordsFrequency[sortedWordsFrequency.length - 1];

  log(
    `Most frequent word of all time is:\n "${mostFrequentWord[0]}" with ${mostFrequentWord[1]} occurrences.`,
    "info"
  );
  log(
    `Least frequent word of all time is:\n "${leastFrequentWord[0]}" with ${leastFrequentWord[1]} occurrences.`,
    "info"
  );
};
