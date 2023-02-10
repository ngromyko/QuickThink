"use strict";

const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/completions";

const TEMPLATE = `Chat with the recruiter. Answer in a young manner, friendly, briefly, shortly, not formal speech. Recruiter: {0}. \n Answer:`;

const generateResponse = async (prompt, max_tokens = 200, count = 1, model="text-davinci-003") => {
  try {
    const formatedPromt = TEMPLATE.format(prompt);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: model,
        prompt: formatedPromt,
        temperature: 0.5,
        max_tokens: max_tokens,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        best_of: 3,
        n: count,
        stop: ["Recruiter:", "Answer:"],
      }),
    });
    const json = await response.json();
    return json.choices.map((x) => x.text);
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while generating the response");
  }
};

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/{([0-9]+)}/g, function (match, index) {
    return typeof args[index] == "undefined" ? match : args[index];
  });
};



globalThis.generateResponse = generateResponse;
