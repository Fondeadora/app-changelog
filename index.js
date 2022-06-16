import * as core from '@actions/core'
import { config } from "dotenv"

import { Pulls } from "./src/pulls.js"
import { PostSlack } from "./src/post-slack.js"

config()

const channel = process.env.CHANNEL == null ? core.getInput('slack_channel') : process.env.CHANNEL
const githubKey = process.env.GITHUB_KEY == null ? core.getInput('github_key') : process.env.GITHUB_KEY
const slackToken = process.env.SLACK_TOKEN == null ? core.getInput('slack_token') : process.env.SLACK_TOKEN
const releaseTag = process.env.RELEASE_TAG == null ? core.getInput('release_tag') : process.env.RELEASE_TAG

const postSlack = new PostSlack(new Pulls(githubKey, releaseTag), channel, slackToken, releaseTag)

console.log(await postSlack.responsePostMessage())