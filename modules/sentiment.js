import fs from "fs";
import sentiment from "multilang-sentiment";

import { log } from "./shared.js";

const formatSentimentListToString = (list) => {
  let result = "";
  for (let i = 0; i < list.length; i++) {
    result += `${list[i].user}: "${list[i].message}", score: ${list[i].score}\n`;
  }
  return result;
};

const analyzeSentimentByUser = (userMessages) => {
  const messagesWithScore = [];
  const averageSentimentByUser = new Map();

  for (const [username, messages] of userMessages) {
    log(`Analyzing user ${username}.`, "log");

    let nonNeutralMessagesCount = 0;

    const mostPositiveMessage = {
      message: "",
      score: -Infinity,
    };
    const mostNegativeMessage = {
      message: "",
      score: Infinity,
    };

    for (var i = 0; i < messages.length; i++) {
      process.stdout.write(`${i}/${messages.length} \r`);

      const message = messages[i];
      var messageSentiment = sentiment(message, "ru");
      messagesWithScore.push({
        user: username,
        message,
        score: messageSentiment.score,
      });

      if (messageSentiment.score !== 0) {
        nonNeutralMessagesCount++;

        if (!averageSentimentByUser.has(username)) {
          averageSentimentByUser.set(username, messageSentiment.score);
        } else {
          averageSentimentByUser.set(
            username,
            (averageSentimentByUser.get(username) + messageSentiment.score) /
              nonNeutralMessagesCount
          );
        }
      }

      if (mostPositiveMessage.score < messageSentiment.score) {
        mostPositiveMessage.message = message;
        mostPositiveMessage.score = messageSentiment.score;
      }

      if (mostNegativeMessage.score > messageSentiment.score) {
        mostNegativeMessage.message = message;
        mostNegativeMessage.score = messageSentiment.score;
      }

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }

    log(
      `Average sentiment for ${username}: "${averageSentimentByUser.get(
        username
      )}"`,
      "info"
    );
    log(
      `Most positive message for ${username}: "${mostPositiveMessage.message}"`,
      "info"
    );
    log(
      `Most negative message for ${username}: "${mostNegativeMessage.message}"`,
      "info"
    );
  }

  return {
    messagesWithScore,
    averageSentimentByUser,
  };
};

export const analyzeSentiment = (userMessages, outputPath) => {
  const { messagesWithScore, averageSentimentByUser } =
    analyzeSentimentByUser(userMessages);
  log("Chat sentiment analysis completed.", "log");

  messagesWithScore.sort((a, b) => b.score - a.score);

  if (outputPath) {
    try {
      fs.writeFileSync(
        outputPath,
        formatSentimentListToString(messagesWithScore)
      );
      log(
        `List of all messages sorted with sentiment score written successfully to "${outputPath}" file!`,
        "log"
      );
    } catch (error) {
      log(
        `Unexpected error while writing to a file: ${error.message}.`,
        "error"
      );
    }
  }

  for (const [username, averageSentiment] of averageSentimentByUser) {
    log(
      `Average sentiment for ${username}: ${averageSentiment.toFixed(2)}.`,
      "info"
    );
  }

  const mostPositiveMessage = messagesWithScore[0];
  const mostNegativeMessage = messagesWithScore[messagesWithScore.length - 1];

  log(
    `Most positive message of all time is:\n "${mostPositiveMessage.message}" from ${mostPositiveMessage.user} with score ${mostPositiveMessage.score}.`,
    "info"
  );
  log(
    `Most negative message of all time is:\n "${
      messagesWithScore[messagesWithScore.length - 1]
    }" from ${mostNegativeMessage.user} with score ${
      mostNegativeMessage.score
    }.`,
    "info"
  );
};
