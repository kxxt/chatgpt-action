function genReviewPRPrompt(title, body, diff) {
  const prompt = `Can you tell me the problems with the following pull request and describe your suggestions? 
  title: ${title}
  body: ${body}
  The following diff is the changes made in this PR.
  ${diff}`;
  return prompt;
}

module.exports = { genReviewPRPrompt };
