var demo = artifacts.require("./demo.sol");
var CapTables = artifacts.require("./CapTables.sol");
var TheRegD506c = artifacts.require("./TheRegD506c.sol");
module.exports = function(deployer) {
	deployer.deploy(TheRegD506c, 31536000);
	deployer.deploy(CapTables).then(function() {
  return deployer.deploy(demo, true, "0x4ec87ae6c8b1c0b2161c1906a653792d90df048b", TheRegD506c.address, CapTables.address,1);
});
}
