export const SHAVersion = class {
    /** objecto {Octokit} */
    #octokit

    constructor(octokit) {
        this.#octokit = octokit
    }

    /** regresa los {SHAs} de los dos últimos tags encontrados */
    #getSHAsFromTags = async () => {
        const tags = (await this.#octokit.request(`GET /repos/Fondeadora/FondeadoraApp/tags`)).data
        /** 
         * se toma como {head} el último {tag} y como {base} el penúltimo.
         * posteriormente, esto permitirá obtener los {commits} dentro de este rango.
         * */
        return { head: tags[0].commit.sha, base: tags[1].commit.sha }
    }

    /** regresa los {commits} encontrados dentro del rango del {base} y {head} */
    #getSHAsFromComparison = async (base, head) => {
        const commits = await this.#octokit.request(`GET /repos/Fondeadora/FondeadoraApp/compare/${base}...${head}`)
        return commits
    }

    /** 
     * obtiene los {commits} filtrados. es decir, los {commits} encontrados entre el rango 
     * de {base} y {head} 
     * */
    filteredCommits = async () => {
        const range = await this.#getSHAsFromTags()
        const compared = (await this.#getSHAsFromComparison(range.base, range.head)).data.commits

        return compared.filter((commit) => {
            /** filtra los {commit} que tienen mensajes válidos */
            return /#[0-9]+/g.exec(commit.commit.message) != null
        }).map((commit) => {
            /** manda el {SHAs} de los {commits} filtrados */
            return commit.sha
        })
    }
}