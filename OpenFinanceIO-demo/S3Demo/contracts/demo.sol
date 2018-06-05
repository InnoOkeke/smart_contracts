pragma solidity ^0.4.18;

import './RegD506c.sol';
import './RegD506cToken.sol';
import './RestrictedTokenLogic.sol';
import './zeppelin-solidity/contracts/ownership/Ownable.sol';

contract demo is RegD506cToken, RestrictedTokenLogic, Ownable {
	/// Is the token being used to raise capital for a fund?
  	bool public isFund = false;

	/// Total number of shareholders
	uint16 public shareholderCount = 0;

     ///
  /// The contract is initialized to have zero shareholders with the entire
  /// supply under the control of the contract creator
    constructor (
      bool isFund_,
      address issuer,
      address restrictor_,
      address capTables_,
      uint256 index_
    ) public {
        // Initially assign all tokens to the contract's creator.
        isFund = isFund_;
        owner = issuer;

        restrictor = restrictor_;
        capTables = capTables_;
        index = index_;

    }

    /// Manage shareholder count after transfer
    function transfer(address _to, uint256 _value) public returns (bool) {
        //=======================================
        uint16 newCount = shareholderCountAfter(msg.sender, _to, _value);
	if (shareholderCount != newCount)
	        shareholderCount = newCount;
	if(isFund){
		if(shareholderCount>99)
			return false;
	}
	else{
		if(shareholderCount>2000)
                        return false;
	}
        super.transfer(_to, _value);

        return true;
    }


    /// Manage shareholder count after delegated transfer
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool)
    {
        //require(_value <= mbalanceOf[_from]);
        //require(_value <= allowance[_from][msg.sender]);

        //=======================================
        uint16 newCount = shareholderCountAfter(_from, _to, _value);
	if (shareholderCount != newCount)
                shareholderCount = newCount;
        if(isFund){
                if(shareholderCount>99)
                        return false;
        }
        else{
                if(shareholderCount>2000)
                        return false;
        }

        super.transferFrom(_from, _to, _value);

        //=======================================

        return true;
    }

    ///
  /// Officially issue the security, beginning the holding period
  function issue() public onlyOwner {
    RegD506c(restrictor).startHoldingPeriod();
  }

  ///
  /// Migrate by changing the owner of the security id in CapTables to the new address
  function migrate(address newRules) public onlyOwner {
    ICapTables(capTables).migrate(index, newRules);
  }

  function shareholderCountAfter(address _from, address _to, uint256 _value)
    public
    view
    returns (uint16)
  {
    bool newShareholder = balanceOf(_to) == 0;
    bool loseShareholder = balanceOf(_from) == _value;

    if (newShareholder && !loseShareholder)
      return shareholderCount + 1;

    if (!newShareholder && loseShareholder)
      return shareholderCount - 1;

    return shareholderCount;

  }



}
