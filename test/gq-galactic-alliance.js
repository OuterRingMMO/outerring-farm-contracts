const { expect } = require('chai')
const { ethers } = require('hardhat')
const { time, snapshot } = require('@openzeppelin/test-helpers')

function tokens(n) {
  return ethers.utils.parseEther(n)
}

describe('GQGalacticAlliance contract', function () {
  let deployer, alice, bob, carol

  beforeEach(async function () {
    GQGalacticAlliance = await ethers.getContractFactory('GQGalacticAlliance')
    gqGalacticAlliance = await GQGalacticAlliance.deploy()
    ;[deployer, alice, bob, carol] = await ethers.getSigners()
  })
})
