function genReviewPRPrompt(title, body, diff) {
  const prompt = `Can you tell me the problems with the following pull request and describe your suggestions? 
  title: ${title}
  body: ${body}
  The following diff is the changes made in this PR.
  ${diff}`;
  return prompt;
}

function genReviewPRSplitedPrompt(title, body, diff, limit) {
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
      `Here is a pull request. First I will tell you the title and body of the PR. Please reply 'Completed' if you have done reading.
The title is ${title}
The remaining part is the body.
${body}`,
      `Now I will give you the changes made in this PR.
Please note that the changes are in diff format and I will give you the diff one file at a time.
When a diff is too large, I will omit it and tell you about that.
Please reply 'Completed' if you have done reading. Do the same for the following diffs.`,
    ],
    diffPrompts: diff,
    endPrompt: `Now you have read the complete pull request.
Can you tell me the problems with the pull request and describe your suggestions?`,
  };
}

module.exports = { genReviewPRPrompt, genReviewPRSplitedPrompt };
