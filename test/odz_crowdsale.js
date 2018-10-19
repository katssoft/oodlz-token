var ODZCrowdsale = artifacts.require("./ODZCrowdsale.sol");
//import assertRevert from './helpers/assertRevert';


contract('ODZCrowdsale', (accounts) => {
    var contract;
    var owner = accounts[0]; // for test

    var rate = Number(325);
    var buyWei = Number(2 * 10**18);
    var rateNew = Number(325);
    var buyWeiNew = 3 * 10**18;
    var buyWeiMin = 2 * 10**15;

    var fundForSale = 17 * 10**25;

    it('should deployed contract', async ()  => {
        assert.equal(undefined, contract);
        contract = await ODZCrowdsale.deployed();
        assert.notEqual(undefined, contract);
    });

    it('get address contract', async ()  => {
        assert.notEqual(undefined, contract.address);
    });

    it('verification balance owner contract', async ()  => {
        var balanceOwner = await contract.balanceOf(owner);
        assert.equal(fundForSale, balanceOwner);
    });


    it('verification of receiving Ether', async ()  => {
        var tokenAllocatedBefore = await contract.tokenAllocated.call();
        var balanceAccountTwoBefore = await contract.balanceOf(accounts[2]);
        var weiRaisedBefore = await contract.weiRaised.call();

        await contract.buyTokens(accounts[2],{from:accounts[2], value:buyWei});
        var tokenAllocatedAfter = await contract.tokenAllocated.call();
        assert.isTrue(tokenAllocatedBefore < tokenAllocatedAfter);
        assert.equal(0, tokenAllocatedBefore);
        //assert.equal(Number(rate*buyWei), Number(tokenAllocatedAfter));

       var balanceAccountTwoAfter = await contract.balanceOf(accounts[2]);
        assert.isTrue(balanceAccountTwoBefore < balanceAccountTwoAfter);
        assert.equal(0, balanceAccountTwoBefore);
        assert.equal(rate*buyWei, balanceAccountTwoAfter);

        var weiRaisedAfter = await contract.weiRaised.call();
        assert.isTrue(weiRaisedBefore < weiRaisedAfter);
        assert.equal(0, weiRaisedBefore);
        assert.equal(buyWei, weiRaisedAfter);

        var depositedAfter = await contract.getDeposited.call(accounts[2]);
        assert.equal(buyWei, depositedAfter);

        var balanceAccountThreeBefore = await contract.balanceOf(accounts[3]);
        await contract.buyTokens(accounts[3],{from:accounts[3], value:buyWeiNew});
        var balanceAccountThreeAfter = await contract.balanceOf(accounts[3]);
        assert.isTrue(balanceAccountThreeBefore < balanceAccountThreeAfter);
        assert.equal(0, balanceAccountThreeBefore);
        assert.equal(rateNew*buyWeiNew, balanceAccountThreeAfter);
    });

    it('verification define period', async ()  => {
        var currentDate = 1528128000; // Mon, 04 Jun 2018 00:00:00 GMT
        period = await contract.getPeriod(currentDate);
        assert.equal(0, period);

        currentDate = 1539993600; // Tue, 20 Oct 2018 00:00:00 GMT
        period = await contract.getPeriod(currentDate);
        assert.equal(1, period);

        currentDate = 1546646400; // Sat, 05 Jan 2019 00:00:00 GMT
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);

        currentDate = 1578182400; // Sun, 05 Jan 2020 00:00:00 GMT
        period = await contract.getPeriod(currentDate);
        assert.equal(2, period);
    });

    it('verification claim tokens', async ()  => {
        var balanceAccountOneBefore = await contract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountOneBefore);
        await contract.buyTokens(accounts[1],{from:accounts[1], value:buyWei});
        var balanceAccountOneAfter = await contract.balanceOf(accounts[1]);
        await contract.transfer(contract.address,balanceAccountOneAfter,{from:accounts[1]});
        var balanceContractBefore = await contract.balanceOf(contract.address);
        assert.equal(buyWei*rate, balanceContractBefore);
        //console.log("balanceContractBefore = " + balanceContractBefore);
        var balanceAccountAfter = await contract.balanceOf(accounts[1]);
        assert.equal(0, balanceAccountAfter);
        var balanceOwnerBefore = await contract.balanceOf(owner);
        await contract.claimTokens(contract.address,{from:accounts[0]});
        var balanceContractAfter = await contract.balanceOf(contract.address);
        assert.equal(0, balanceContractAfter);
        var balanceOwnerAfter = await contract.balanceOf(owner);
        assert.equal(true, balanceOwnerBefore<balanceOwnerAfter);
    });

    it('verification tokens limit min amount', async ()  => {
        var numberTokensMinWey = await contract.validPurchaseTokens.call(buyWeiMin);
        assert.equal(0, Number(numberTokensMinWey));
    });

});



