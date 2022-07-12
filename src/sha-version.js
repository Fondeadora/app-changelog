export const SHAVersion = class {
    #octokit

    constructor(octokit) {
        this.#octokit = octokit
    }

    #getSHAsFromTags = async () => {
        const tags = (await this.#octokit.request(`GET /repos/Fondeadora/FondeadoraApp/tags`)).data
        return { head: tags[0].commit.sha, base: tags[1].commit.sha }
    }

    #getSHAsFromComparison = async (base, head) => {
        return await this.#octokit.request(`GET /repos/Fondeadora/FondeadoraApp/compare/${base}...${head}`)
    }

    filteredCommits = async () => {
        const sha = await this.#getSHAsFromTags()
        const compared = (await this.#getSHAsFromComparison(sha.base, sha.head)).data.commits

        return compared.filter((commit) => /#[0-9]+/g.exec(commit.commit.message) != null).map((commit) => commit.sha)
    }
}