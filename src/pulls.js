

export const Pulls = class {
    #octokit
    #releaseTag

    constructor(octokit, releaseTag) {
        this.#octokit = octokit
        this.#releaseTag = releaseTag
    }

    #githubPulls = async () => {
        return await this.#octokit.request("GET /repos/Fondeadora/FondeadoraApp/pulls", {
            state: 'close',
            per_page: '100',
            page: 1,
        })
    }

    #filteredPulls = async (commits) => {
        const githubPulls = await this.#githubPulls()

        const filtered = []

        githubPulls.data.forEach((pull) => {
            if (commits.includes(pull.merge_commit_sha) && pull.milestone != null) {
                filtered.push({
                    title: pull.title,
                    labels: pull.labels.map((label) => label.name),
                    tag: pull.milestone.title,
                })
            }

            if (pull.milestone != null && pull.milestone.title == this.#releaseTag) {
                filtered.push({
                    title: pull.title,
                    labels: pull.labels.map((label) => label.name),
                    tag: pull.milestone.title,
                })
            }
        })

        return filtered.filter((f) => f.tag == this.#releaseTag)
    }

    cleanedPulls = async (commits) => {
        const filteredPulls = await this.#filteredPulls(commits)

        return filteredPulls
            .filter((pull) => pull.labels.includes('retencion') || pull.labels.includes('plataforma') || pull.labels.includes('adquisicion'))
            .filter((pull) => !pull.labels.includes('ignored'))
    }
}

