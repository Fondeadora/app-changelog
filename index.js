import { Octokit } from "@octokit/core"
import { config } from "dotenv"
import { createOrUpdateTextFile } from "@octokit/plugin-create-or-update-text-file"

config()

const schema = `
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type TokenSession {
  userId: String!
  accessToken: String!
  refreshToken: String!
  acl: [String!]!
}

type KycState {
  status: KYCStatus
  detail: String
}

"""KYC Status"""
enum KYCStatus {
  PENDING
  VERIFYING
  VALID
  INVALID
  ERROR
}

type OnboardingState {
  onboardingStatus: OnboardingStatus!
  nextStep: OnboardingStepName
  KycState: KycState

  """Steps completed"""
  stepsCompleted: Int!

  """Total steps"""
  totalSteps: Int!
  nextStepData: JSON
  tokenSession: TokenSession
}

"""Onboarding Status"""
enum OnboardingStatus {
  IN_PROGRESS
  COMPLETED
  DEBIT_USER
  BANNED
}

"""Onboarding steps name"""
enum OnboardingStepName {
  REGISTER_USER
  EMAIL_CODE
  PASSWORD
  RFC
  ADDRESS
  LOCATION
  SIGNATURE
  BENEFICIARY
  KYC
}

"""
The \`JSON\` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
"""
scalar JSON

type Address {
  street: String
  city: String
  state: String
  zipcode: String
  neighborhood: String
  municipality: String
  intNumber: String
  extNumber: String
}

type Company {
  status: String
  externalId: String
  commercialName: String
  externalAssociateId: String
}

type Location {
  state: String
  zip: String!
  municipality: String!
  city: String!
  neighbourhood: String!
  zipType: String!
  zone: String!
}

type Query {
  getTokenSession(email: String!, password: String!): TokenSession!
  refreshAccessToken: TokenSession!
  getOnboardingState: OnboardingState!
  getNeighborhoods(zipCode: String!): [Location!]!
  getKycState: KycState!
  getSecureMeUrl: String!
}

type Mutation {
  registerUser(email: String!, phone_number: String!, anonymous_id: String!): OnboardingState!
  verifyEmailCode(email: String!, code: String!): OnboardingState!
  savePassword(email: String!, password: String!): OnboardingState!
  getKycToken: String!
  uploadDocument(document: String!): Boolean!
  saveRfc(rfc: String!): OnboardingState!
  saveAddress(country: String!, city: String!, state: String!, neighborhood: String!, street: String!, municipality: String!, zipCode: String!, reference: String!, extNumber: String!): OnboardingState!
  saveLocation(latitude: Float!, longitude: Float!): OnboardingState!
  saveSignature(signature: String!): OnboardingState!
  finishOnboarding: Boolean!
  saveBeneficiary(first_name: String!, last_name: String!, other_last_name: String!, email: String!, phone_number: String!): OnboardingState!
  updateIdentifiers(identifiersInput: Identifiers!): Boolean!
}

input Identifiers {
  firebaseToken: String!
  ip: String!
  deviceId: String!
  deviceType: String!
  appVersion: String!
  locale: String!
  anonymousId: String!
  attributionId: String
  advertisingId: String
}
`
const PoweredOctokit = Octokit.plugin(createOrUpdateTextFile)
const octokit = new PoweredOctokit({ auth: process.env.GITHUB_KEY })


try {
  const { updated } = await octokit.createOrUpdateFileContents({
    owner: "Fondeadora",
    repo: "f4b-mobile-app",
    path: "package/creators_graphql/lib/graphql/schema/schema.graphql",
    message: "chore: updated graphql schema",
    content: schema,
    committer: {
      name: 'fondeadora-tech',
      email: "tech@fondeadora.com",
    },
    author: {
      name: 'fondeadora-tech',
      email: "tech@fondeadora.com",
    },
  });

  if (updated) {
    console.log("test.txt updated via %s", data.commit.html_url);
  } else {
    console.log("test.txt already up to date");
  }

  console.log(data);
} catch (err) {
  console.error(err);
}

// console.log('🚀 Setting up environment dependencies')

// const { channel, octokit, slackToken, releaseTag } = environment()

// console.log('🥅 Filtering merged pull request from tag')

// const allowedCommits = await new SHAVersion(octokit).filteredCommits()

// console.log('🧽 Cleaning filtered pull request')

// const pulls = await new Pulls(octokit, releaseTag).githubPulls(allowedCommits)

// console.log('⚙️ Building changelog with formatted task')

// const postSlack = new PostSlack(pulls, channel, slackToken, releaseTag)

// console.log('📦 Sending changelog to slack')

// console.log(await postSlack.responsePostMessage());

// const response = await postSlack.responsePostMessage()

// console.log(`✅ Changelog delivered with timestamp ${response.ts}`)