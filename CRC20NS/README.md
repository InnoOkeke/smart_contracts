# The CRC20 Naming Service Contract

The naming service contract is from the `CRC20NS.lity` file. The compiled ABI and bytecode are in the `CRC20NS.abi` and `CRC20NS.bin` files respectively.

The DEMO token used in the example below is from the `CRC20Demo.sol` file.

## Applications 

For applications / wallets / explorer web site that need to verify the "official" status of a CRC20 token symbol, they should use the `isRegistered` function. This function takes the symbol and contract address as input parameters, and returns a boolean value indicating whether the pair is registered. There is no gas fee for this function call. In web3-cmt.js and the Travis client console, we will first construct a contract instance from its deployed address. 

```
// unlock or inject from account: 0x9ee2dfa53038b4d2bbcefcd3517f21384490cbb1
abi = [{...}]
contract = web3.cmt.contract(abi, "0xcc549613436838f03946d29749ba2ed1fbd5618f")
```

Then we can call the `isRegistered` function without gas.

```
contract.isRegistered("DEMO", "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256")
true

contract.isRegistered("DEMO123", "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256")
false
```

Applications could also use the `lookup` function on the contract to get more information. The function takes a single parameter, the symbol, and returns the official contract address for this symbol. This function call requires no gas. The function's return values are as follows. 

* The contract address of this symbol.
* The registration date time for the symbol. The registration expires a year from that date. 

Here is an example of the `lookup` function call in web3-cmt.js or Travis client console. 

```
contract.lookup("DEMO")

{
	"string _symbol": "DEMO",
	"address _contractAddr": "0x85F30253218fCAaa8e0c8f32ae7909D217eB1256"
}
```

When someone creates another DEMO token and wants to register the new contract as the official DEMO token contract, she will need to wait until the existing DEMO registration expires a year from the registartion date, and be the first to register the DEMO symbol with the new contract address.

## Token creators

If you are a token creator, you can call the register function on this contract to officially register your token's contract address. You will need to pay a fee based on how many characters you symbol has in order to complete the registration. 

* For symbols that are two chars, you will pay 1000 CMTs
* For symbols that are three chars, you will pay 100 CMTs
* For symbols that are four chars, you will pay 10 CMTs. 
* For symbols that are five or more chars, you will pay 1 CMT. 

The `register` function takes the the CRC20 contract address to be registered, in addition to the above registration fee in the TX value and gas fee. 

You must be the current owner of the CRC20 token contract in order to call the `register` function. Here is how it works in web3-cmt.js and Travis client console. 

```
contract.register("0x85F30253218fCAaa8e0c8f32ae7909D217eB1256", {
    from: '0x9ee2dfa53038b4d2bbcefcd3517f21384490cbb1',
    value: 10000000000000000000,
    gas: 1500000
})
```

![Registration](images/register.png)


When someone creates another DEMO token and wants to register the new contract as the official DEMO token contract, she will need to wait until the existing DEMO registration expires a year from the registartion date, and be the first to register the DEMO symbol with the new contract address.

