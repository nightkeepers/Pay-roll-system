var SafeMath = artifacts.require("./SafeMath.sol");
var Payroll = artifacts.require("./payroll.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Payroll);
  deployer.deploy(Payroll);
};
