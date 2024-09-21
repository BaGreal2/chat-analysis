import fs from "fs";

import { log, extractWords } from "./shared.js";

const formatLengthListToString = (list) => {
  let result = "";
  for (let i = 0; i < list.length; i++) {
    result += `"${list[i][0]}": ${list[i][1]} chars.\n`;
  }
  return result;
};

const analyzeWordsLengthByUser = (userMessages, minWordLength) => {
  const wordsLength = new Map();

  for (const [username, messages] of userMessages) {
    log(`Analyzing user ${username}.`, "log");

    let longestWord = {
      word: null,
      length: 0,
    };

    for (var i = 0; i < messages.length; i++) {
      process.stdout.write(`${i}/${messages.length} \r`);

      const message = messages[i];
      const words = extractWords(message, minWordLength);

      for (var j = 0; j < words.length; j++) {
        const word = words[j];

        if (!wordsLength.has(word)) {
          wordsLength.set(word, word.length);
        }
        if (wordsLength.length < wordsLength.get(word)) {
          longestWord = {
            word,
            length: wordsLength.get(word),
          };
        }
      }

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }
    log(`Longest word for ${username}: "${longestWord.word}"`, "info");
  }

  return wordsLength;
};

export const analyzeWordsLength = (userMessages, minWordLength, outputPath) => {
  const wordsLength = analyzeWordsLengthByUser(userMessages, minWordLength);
  log("Word length analysis completed.", "log");

  const sortedWordsLength = Array.from(wordsLength).sort((a, b) => b[1] - a[1]);

  if (outputPath) {
    try {
      fs.writeFileSync(outputPath, formatLengthListToString(sortedWordsLength));
      log(
        `List of all words sorted by length written successfully to "${outputPath}" file!`,
        "log"
      );
    } catch (error) {
      log(
        `Unexpected error while writing to a file: ${error.message}.`,
        "error"
      );
    }
  }

  const longestWord = sortedWordsLength[0];

  log(
    `Longest word of all time is:\n "${longestWord[0]}" with ${longestWord[1]} characters.`,
    "info"
  );
};
