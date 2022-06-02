import { Octokit } from "@octokit/core"
import { WebClient } from "@slack/web-api"
import { config } from "dotenv"

config()

const channel = process.env.CHANNEL
const githubKey = process.env.GITHUB_KEY
const slackToken = process.env.SLACK_TOKEN
const releaseTag = process.env.RELEASE_TAG

console.log(githubKey)

const octokit = new Octokit({ auth: githubKey })

const response = await octokit.request("GET /repos/Fondeadora/FondeadoraApp/pulls", {
  state: 'close',
  per_page: '100',
  page: 1,
})

const filteredPulls = response.data.filter((pulls) => {
  return pulls.milestone != null && pulls.milestone.title == releaseTag
});

const formattedPulls = filteredPulls.map((pull) => ({
  title: pull.title,
  labels: pull.labels.map((label) => label.name)
}))

const squads = ['adquisicion', 'retencion', 'plataforma']

const githubLabels = {
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

const FormattedTask = class {
  constructor(pull) {
    this.squads = pull.labels.filter((label) => squads.includes(label))
    this.title = pull.title
    this.labels = pull.labels.filter((label) => !squads.includes(label))
  }

  get fondeadoraLabels() {
    if (this.labels.length == 0) {
      return this.githubLabels
    }

    const labels = this.labels.map((label) => {
      if (githubLabels[label] == undefined) {
        return label
      }

      return githubLabels[label]
    })

    return [...new Set(labels)]
  }

  get summary() {
    return {
      squads: this.squads,
      title: this.title,
      labels: this.fondeadoraLabels
    }
  }

  get message() {
    const labels = this.fondeadoraLabels.map((label) => `\`${label}\``)
    const squads = this.squads.map((squad) => `\`${squad.toUpperCase()}\``)
    return `${this.title}\ndeveloped by: ${squads.join(', ')}\n${labels.join(', ')}`
  }
}

const tasksBySquad = formattedPulls
  .filter((pull) => pull.labels.includes('retencion') || pull.labels.includes('plataforma') || pull.labels.includes('adquisicion'))
  .filter((pull) => !pull.labels.includes('ignored'))
  .map((pull) => new FormattedTask(pull).message)

console.log(tasksBySquad)

const web = new WebClient(slackToken);

const conversationId = channel;

const responsePostMessage = await web.chat.postMessage({ channel: conversationId, text: `*CHANGELOG v${releaseTag}*\n\n\n${tasksBySquad.join('\n\n\n')}` });

console.log(responsePostMessage)