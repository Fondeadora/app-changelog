import { Pulls } from './src/pulls.js'
import { PostSlack } from './src/post-slack.js'
import { SHAVersion } from './src/sha-version.js'
import { environment } from './src/environment.js'

console.log('🚀 Setting up environment dependencies')

const { channel, octokit, slackToken, releaseTag } = environment()

console.log('🥅 Filtering merged pull request from tag')

const allowedCommits = await new SHAVersion(octokit).filteredCommits()

console.log('🧽 Cleaning filtered pull request')

const pulls = await new Pulls(octokit).cleanedPulls(allowedCommits)

console.log('⚙️ Building changelog with formatted task')

const postSlack = new PostSlack(pulls, channel, slackToken, releaseTag)

console.log('📦 Sending changelog to slack')

const response = await postSlack.responsePostMessage()

console.log(`✅ Changelog delivered with timestamp ${response.ts}`)