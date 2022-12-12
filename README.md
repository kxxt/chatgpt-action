# chatgpt-action

Let chatgpt review your PR.

Please note： this repo is a WIP and I do not recommend you to use it in production!

## Ideas

- Create a vscode extension that asks ChatGPT to refactor or point out the bugs of a selected range of code. I don't have time to learn vscode extension and implement it.
- Implement ChatGPT's review feedback as a commit or suggested change ([#27](https://github.com/kxxt/chatgpt-action/issues/27))

## Warning

- code of experimental quality!
- ChatGPT often generates misleading comments which could confuse your contributors and that's
one reason against using this action in production.
- Sometimes you will get 403 errors when the generated prompt is too long or considered an attack(perhaps?). 
  - ~~Split the prompt and let ChatGPT comment on every single file should resolve this issue most of the time.~~ 
  - This feature has been implemented but it is unstable. Add `split: true` to `with` node in your config to enable this feature.
    - When you have too many changed files, ChatGPT will produce very bad results. Here is an example: https://github.com/LearningOS/lab5-os8-kxxt/pull/1
## Showcase

### YOLO Mode: Give all the info to ChatGPT in one go

- https://github.com/kxxt/chatgpt-action/pull/12
- https://github.com/kxxt/chatgpt-action/pull/10
- https://github.com/kxxt/chatgpt-action/pull/9

### Using Unstable Split Feature

- https://github.com/kxxt/chatgpt-action/pull/20
- https://github.com/kxxt/chatgpt-action/pull/22

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
        uses: kxxt/chatgpt-action@v0.3
        id: chatgpt
        with:
          number: ${{ github.event.pull_request.number }}
          sessionToken: ${{ secrets.CHATGPT_SESSION_TOKEN }}
          split: 'yolo'  # Use true to enable the unstable split feature.
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
