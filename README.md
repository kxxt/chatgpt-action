# chatgpt-action

Let chatgpt review your PR.

Please note： this repo is a WIP and I do not recommend you to use it in production!

## Warning

- code of experimental quality!
- ChatGPT often generates misleading comments which could confuse your contributors and that's
one reason against using this action in production.

## Showcase

- https://github.com/kxxt/chatgpt-action/pull/12
- https://github.com/kxxt/chatgpt-action/pull/10
- https://github.com/kxxt/chatgpt-action/pull/9

## Usage

```yaml
on: [pull_request]

name: ChatGPT CodeReview

jobs:
  chatgpt_comment:
    runs-on: ubuntu-latest
    name: Let chatgpt comment on your PR.
    steps:
      - name: ChatGPT comment
        uses: kxxt/chatgpt-action@HEAD
        id: chatgpt
        with:
          number: ${{ github.event.pull_request.number }}
          sessionToken: ${{ secrets.CHATGPT_SESSION_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
