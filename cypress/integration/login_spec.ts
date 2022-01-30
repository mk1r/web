import { translations } from 'assets/translations'
import { KeyManager } from 'context/WalletProvider/config'

import { getRandomNumericalString, getSeedPhrase } from '../integration/helpers'

const baseUrl = Cypress.config().baseUrl

describe('ShapeShift home page', () => {
  it('loads correctly', () => {
    cy.visit('')
    cy.url().should('equal', `${baseUrl}connect-wallet?returnUrl=/dashboard`)

    // Open WalletProvider.SelectModal
    cy.getBySel('connect-wallet-button').click()

    // All expected wallet types rendered
    Object.values(KeyManager).forEach(value => {
      cy.getBySel(`wallet-${value}-button`)
    })
  })
})

describe('Wallet type', () => {
  describe('Native', () => {
    it('can log in via an imported wallet', () => {
      cy.visit('')

      // Open WalletProvider.SelectModal
      cy.getBySel('connect-wallet-button').click()
      cy.getBySel('wallet-native-button').click()
      cy.getBySel('wallet-native-import-button').click()

      // Test 'empty` seed validation
      cy.getBySel('wallet-native-seed-submit-button').click()
      cy.getBySel('wallet-native-seed-validation-message').should(
        'have.text',
        translations.en.walletProvider.shapeShift.import.secretRecoveryPhraseRequired
      )

      // Test 'too-short` seed validation
      cy.getBySel('wallet-native-seed-input').click().type('too-short')
      cy.getBySel('wallet-native-seed-submit-button').click()
      cy.getBySel('wallet-native-seed-validation-message').should(
        'have.text',
        translations.en.walletProvider.shapeShift.import.secretRecoveryPhraseTooShort
      )
      cy.getBySel('wallet-native-seed-input').clear()

      // Test 'invalid bip39 mnemonic` seed validation
      cy.getBySel('wallet-native-seed-input').type(
        'this-is-long-enough-but-is-not-a-valid-seed-phrase'
      )
      cy.getBySel('wallet-native-seed-submit-button').click()
      cy.getBySel('wallet-native-seed-validation-message').should(
        'have.text',
        translations.en.walletProvider.shapeShift.import.secretRecoveryPhraseError
      )
      cy.getBySel('wallet-native-seed-input').clear()

      // Use randomly generated seed to load an account
      cy.wrap(getSeedPhrase()).then(seed => {
        if (typeof seed === 'string') {
          cy.getBySel('wallet-native-seed-input').type(seed)
        }
      })
      cy.getBySel('wallet-native-seed-submit-button').click()

      cy.getBySel('wallet-native-set-name-input').type('cypress-test')
      cy.getBySel('wallet-native-password-input').type(getRandomNumericalString())
      cy.getBySel('wallet-native-password-submit-button').click()
      // This redirect is slow - it might flake if it takes < 4 seconds
      cy.url().should('equal', `${baseUrl}dashboard`)
    })
  })

  it('Portis can log in', () => {
    cy.visit('')

    // Open WalletProvider.SelectModal
    cy.getBySel('connect-wallet-button').click()
    cy.getBySel('wallet-portis-button').click()
    cy.getBySel('wallet-pair-button').click()

    // We can't use UI for this bit:
    // https://docs.cypress.io/guides/references/trade-offs#Same-origin
    // Instead, we'll need to do this part programmatically using cy.request():
    // https://docs.cypress.io/guides/references/best-practices#Visiting-external-sites
  })
})
