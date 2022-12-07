# chatgpt-action

Let chatgpt review your PR.

Example:

```yaml
on: [pull_request]

name: ChatGPT CodeReview

jobs:
  chatgpt_comment:
    runs-on: ubuntu-latest
    name: Let chatgpt comment on your PR.
    steps:
      # To use this repository's private action,
      # you must check out the repository
      - name: Checkout
        uses: actions/checkout@v3
      - name: ChatGPT comment
        uses: kxxt/chatgpt-action
        id: chatgpt
        with:
          number: ${{ github.event.pull_request.number }}
          sessionToken: ${{ secrets.CHATGPT_SESSION_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```