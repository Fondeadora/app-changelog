export const FormattedTask = class {
    #title
    #labels

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
        this.#labels = pull.labels
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
        return `${this.#title}\n${labels.join(', ')}`
    }
}