import { tokens, EVM_REVERT } from './helpers'

const { default: Web3 } = require('web3');

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', ([deployer, receiver]) => {
    const name = 'Clever Cat Token'
    const symbol = 'CLC'
    const decimals = '18'
    const totalSupply = tokens(1000000).toString()
    let token


    // Fetch token
    beforeEach(async () => {
        token = await Token.new()
    })

    describe('deployment', () => {
        it('tracks the name', async () => {
            // Read token name here...
            const result = await token.name()
            // Check the token name is 'EtherCoin Token'
            result.should.equal(name)
        })
        it('tracks the symbol', async () => {
            const result = await token.symbol()
            result.should.equal(symbol)
        })
        it('tracks the decimals', async () => {
            const result = await token.decimals()
            result.toString().should.equal(decimals)
        })
        it('tracks the total supply', async () => {
            const result = await token.totalSupply()
            result.toString().should.equal(totalSupply.toString())
        })

        it('assigns the total supply to the deployer', async () => {
            const result = await token.balanceOf(deployer)
            result.toString().should.equal(totalSupply.toString())
        })
    })

    describe('sending tokens', () => {
        let result
        let amount

        describe('success', async () => {
            beforeEach(async () => {
                amount = tokens(100)
                result = await token.transfer(receiver, amount, { from: deployer })
            })
            it('transfers token balances', async () => {
                let balanceOf
                // After transfer
                balanceOf = await token.balanceOf(deployer)
                balanceOf.toString().should.equal(tokens(999900).toString())
                balanceOf = await token.balanceOf(receiver)
                balanceOf.toString().should.equal(tokens(100).toString())

            })

            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event.from.toString().should.equal(deployer, 'from value is correct')
                event.to.should.equal(receiver, 'to is correct')
                event.value.toString().should.equal(amount.toString(), 'value is correct')
            })
        })

        describe('failure', async () => {
            it('rejects insufficient balances', async () => {
                let invalidAmount
                invalidAmount = tokens(100000000) // 100 million > than total supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

                // Attempt transfer tokens, when you have none
                invalidAmount = tokens(10) // recipient has no tokens
                await token.transfer(deployer, invalidAmount, { from: receiver }).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects invalid recipients', async () => {
                await token.transfer(0x0, amount, { from: deployer }).should.be.rejected
            })
        })
    })

})