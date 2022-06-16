import { Octokit } from "@octokit/core"

export const Pulls = class {
    #githubKey
    #releaseTag

    constructor(githubKey, releaseTag) {
        this.#githubKey = githubKey
        this.#releaseTag = releaseTag
    }

    #githubPulls = async () => {
        const octokit = new Octokit({ auth: this.#githubKey })

        console.log('🔌 Loading pull requests from FondeadoraApp')

        const response = await octokit.request("GET /repos/Fondeadora/FondeadoraApp/pulls", {
            state: 'close',
            per_page: '100',
            page: 1,
        })

        return response
    }

    #formatTag = (tag) => {
        const splittedTag = tag.split('.')
        splittedTag.pop()
        return splittedTag.join('.')
    }

    #filteredPulls = async () => {
        const githubPulls =  await this.#githubPulls()

        console.log('🧽 Cleaning pull requests')

        return githubPulls.data.filter((pulls) => {
            return pulls.milestone != null && this.#formatTag(this.#releaseTag) === this.#formatTag(pulls.milestone.title)
        })
    }

    #formattedPulls = async () => {
        return (await this.#filteredPulls()).map((pull) => ({
            title: pull.title,
            labels: pull.labels.map((label) => label.name),
            tag: pull.milestone.title
        }))
    }

    cleanedPulls = async () => {
        return (await this.#formattedPulls())
            .filter((pull) => pull.labels.includes('retencion') || pull.labels.includes('plataforma') || pull.labels.includes('adquisicion'))
            .filter((pull) => !pull.labels.includes('ignored'))
    }
}

