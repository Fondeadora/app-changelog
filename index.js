import { Pulls } from "./src/pulls.js"
import { PostSlack } from "./src/post-slack.js"
import { environment } from "./src/environment.js"

console.log('🚀 Setting up environment dependencies')

const { channel, githubKey, slackToken, releaseTag } = environment()

const postSlack = new PostSlack(new Pulls(githubKey, releaseTag), channel, slackToken, releaseTag)

const response = await postSlack.responsePostMessage()

console.log('📦 Sending changelog to slack')

console.log(`✅ Changelog delivered with timestamp ${response.ts}`)