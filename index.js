import { Octokit } from "@octokit/core"
import { config } from "dotenv"
import shell from 'shelljs'
import fs from 'fs'
import * as core from '@actions/core'

config()

const token = core.getInput('github_key')
const schema = core.getInput('graphql_schema')

const octokit = new Octokit({ auth: token })

console.log('1️⃣ Creating repo directory')
shell.mkdir('repo/')
shell.cd('repo/')

console.log('2️⃣ Cloning f4b-mobile-app and gql-generator')
shell.exec('git clone git@github.com:Fondeadora/f4b-mobile-app.git')
shell.exec('git clone git@github.com:Fondeadora/gql-generator.git')

console.log('3️⃣ Activating GraphQL Generator')
shell.cd('gql-generator/')
shell.exec('make activate')

console.log('4️⃣ Writing modified schema')
shell.cd('../../')

const path = 'repo/f4b-mobile-app/package/creators_graphql/lib/graphql/schema'
fs.writeFileSync(`${path}/schema.graphql`, schema)

console.log('5️⃣ Generating GraphQL Files')
shell.cd('repo/f4b-mobile-app/package/creators_graphql')
shell.exec('make gql-gen')
shell.cd('../../')

console.log('6️⃣ Committing new changes and push them')
shell.exec('git add .')
shell.exec('git checkout -b chore/update-schema')
shell.exec(`git commit -am 'chore: improving graphql schema updating'`)
shell.exec('git push origin chore/update-schema')

console.log('7️⃣ Creating pull request')
await octokit.request('POST /repos/{owner}/{repo}/pulls', {
  owner: 'Fondeadora',
  repo: 'f4b-mobile-app',
  title: '👾 [Setup] Actualización del GraphQL Schema',
  body: 'Fondea Tech Bot 🤖',
  head: 'chore/update-schema',
  base: 'main',
})

// console.log('🚀 Setting up environment dependencies')

// const { channel, octokit, slackToken, releaseTag } = environment()

// console.log('🥅 Filtering merged pull request from tag')

// const allowedCommits = await new SHAVersion(octokit).filteredCommits()

// console.log('🧽 Cleaning filtered pull request')

// const pulls = await new Pulls(octokit, releaseTag).githubPulls(allowedCommits)

// console.log('⚙️ Building changelog with formatted task')

// const postSlack = new PostSlack(pulls, channel, slackToken, releaseTag)

// console.log('📦 Sending changelog to slack')

// console.log(await postSlack.responsePostMessage());

// const response = await postSlack.responsePostMessage()

// console.log(`✅ Changelog delivered with timestamp ${response.ts}`)