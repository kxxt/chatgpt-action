function genReviewPRPrompt(title, body, lang, diff) {
  const prompt = `Can you tell me the problems with the following pull request and describe your suggestions?
  title: ${title}
  body: ${body}
  The following diff is the changes made in this PR.
  ${diff}`;

  if(lang.length > 0) {
    // langで指定された言語でのプロンプトを生成する
    return `{prompt}
    Please write a review of the following pull request in ${lang}.`;
  }
  return prompt;
}

function genReviewPRSplitedPrompt(title, body, lang, diff, limit) {
  let splits = [];
  diff
    .split(/(diff --git .+\n)/g)
    .slice(1)
    .reduce((prev, cur, i) => {
      if (i % 2 == 1) {
        let dif = prev + cur;
        if (dif.length > limit) {
          const header = diff.split("\n", 1)[0];
          const info = "This diff is too large so I omitted it for you.";
          splits.push(`${header}\n${info}`);
        } else splits.push(dif);
      }
      return cur;
    });

  return {
    welcomePrompts: [
      `Here is a pull request. Please assume you are a reviewer of this PR. First I will tell you the title and body of the PR. Please greet the PR author if you have done reading.
The title is ${title}
The remaining part is the body.
${body}`,
      `Now I will give you the changes made in this PR one file at a time.
When a diff is too large, I will omit it and tell you about that.`,
    ],
    diffPrompts: splits,
    endPrompt: `Based on your existing knowledge, can you tell me the problems with the above pull request and your suggestions for this PR?`,
  };
}

module.exports = { genReviewPRPrompt, genReviewPRSplitedPrompt };
