import { FormattedTask } from "./formatted-task.js"
import { WebClient } from "@slack/web-api"

export const PostSlack = class {
    #pulls
    #web
    #channel
    #releaseTag

    constructor(pulls, channel, slackToken, releaseTag) {
        this.#pulls = pulls
        this.#web = new WebClient(slackToken);
        this.#channel = channel
        this.#releaseTag = releaseTag
    }

    #tasksBySquad = async () => {
        return this.#pulls.map((pull) => new FormattedTask(pull).message())
    }

    responsePostMessage = async () => {
        return this.#web.chat.postMessage({
            channel: this.#channel,
            text: `🛎 <!here>\n\n\n*CHANGELOG v${this.#releaseTag}*\n\n\n${(await this.#tasksBySquad()).join('\n\n\n')}\n\n`
        })
    }
}