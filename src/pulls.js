

export const Pulls = class {
    #octokit

    constructor(octokit) {
        this.#octokit = octokit
    }

    githubPulls = async (commits, page = 1, filteredPulls = []) => {
        if (commits.length == 0) {
            return filteredPulls
        }

        const response = await this.#octokit.request("GET /repos/Fondeadora/FondeadoraApp/pulls", {
            state: 'close',
            per_page: '20',
            page: page,
        })

        const currentCommit = commits.pop()

        response.data.forEach((pull) => {
            if (pull.merge_commit_sha == currentCommit) {
                filteredPulls.push({
                    title: pull.title,
                    labels: pull.labels.map((label) => label.name)
                })

                return this.githubPulls(commits, page, filteredPulls)
            }
        })

        return this.githubPulls(commits, page, filteredPulls)
    }
}

