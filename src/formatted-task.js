export const FormattedTask = class {
    #squads
    #title
    #labels

    #defaultSquads = ['adquisicion', 'retencion', 'plataforma']

    #githubLabels = {
        'design-system': 'design',
        'design-bug': 'design',
        'bug': 'fix',
        'sentry': 'fix',
        'documentation': 'maintenance',
        'maintenance': 'maintenance',
        'technical-debt': 'maintenance',
        'security': 'maintenance',
        'help-wanted': 'collaborative',
        'pair-programming': 'collaborative',
        'proposal': 'collaborative',
        'android': 'native',
        'ios': 'native',
        'testing': 'testing',
        'enhancement': 'enhancement',
    }

    constructor(pull) {
        this.#title = pull.title
        this.#squads = pull.labels.filter((label) => this.#defaultSquads.includes(label))
        this.#labels = pull.labels.filter((label) => !this.#defaultSquads.includes(label))
    }

    #fondeadoraLabels = () => {
        if (this.#labels.length == 0) {
            return []
        }

        const labels = this.#labels.map((label) => {
            if (this.#githubLabels[label] == undefined) {
                return label
            }

            return this.#githubLabels[label]
        })

        return [...new Set(labels)]
    }

    message = () => {
        const labels = this.#fondeadoraLabels().map((label) => `\`${label}\``)
        const squads = this.#squads.map((squad) => `\`${squad.toUpperCase()}\``)
        return `${this.#title}\ndeveloped by: ${squads.join(', ')}\n${labels.join(', ')}`
    }
}