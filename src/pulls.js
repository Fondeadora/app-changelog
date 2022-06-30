

export const Pulls = class {
    #octokit

    constructor(octokit) {
        this.#octokit = octokit
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
            if (commits.includes(pull.merge_commit_sha)) {
                filtered.push({
                    title: pull.title,
                    labels: pull.labels.map((label) => label.name),
                    tag: pull.milestone.title
                })
            }
        })

        return filtered
    }

    cleanedPulls = async (commits) => {
        const filteredPulls = await this.#filteredPulls(commits)

        return filteredPulls
            .filter((pull) => pull.labels.includes('retencion') || pull.labels.includes('plataforma') || pull.labels.includes('adquisicion'))
            .filter((pull) => !pull.labels.includes('ignored'))
    }
}

