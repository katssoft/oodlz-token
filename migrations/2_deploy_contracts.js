const ODZCrowdsale = artifacts.require('./ODZCrowdsale.sol');

module.exports = (deployer) => {
    //http://www.onlineconversion.com/unix_time.htm
    var owner =  "0x80951aF4C00DBF642d59650785AFE7FE98c9a03F";
    var wallet = "0x8a6932Bba7C610d4D578a9d08B18C38C7085ce25";

    deployer.deploy(ODZCrowdsale, owner, wallet);

};