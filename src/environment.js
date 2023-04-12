import * as core from '@actions/core'
import { config } from "dotenv"
import { Octokit } from "@octokit/core"

config()

export const environment = () => {
    console.log(core.getInput('graphql_schema'))

    const channel = process.env.CHANNEL == null ? core.getInput('slack_channel') : process.env.CHANNEL
    const githubKey = process.env.GITHUB_KEY == null ? core.getInput('github_key') : process.env.GITHUB_KEY
    const slackToken = process.env.SLACK_TOKEN == null ? core.getInput('slack_token') : process.env.SLACK_TOKEN
    const releaseTag = process.env.RELEASE_TAG == null ? core.getInput('release_tag') : process.env.RELEASE_TAG

    const octokit = new Octokit({ auth: githubKey })

    return { channel, octokit, slackToken, releaseTag }
}