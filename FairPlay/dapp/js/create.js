const fun = new MainFun();
const tip = IUToast;
const lgb = fun.languageChoice();
var webBrowser = new AppLink();
var abi = '';
var bin = '';

$(function () {
    webBrowser.openBrowser();
    // init the abi and bin
    getAbi();
    getBin();
    // initLanguage();

    $('#cutoff').datetimepicker();
});

// init language
var initLanguage = function () {
    if (lgb == '' || lgb == null) {
        return;
    }
}

var create = function () {
    tip.loading("Creating contract ... This could take a few minutes!");
    web3.cmt.getAccounts(function (e, address) {
        if (e) {
            tip.error("There is an error");
        } else {
            var userAddress = address.toString();
            var title = $('#title').val();
            var desc = $('#desc').val();
            var image_url = $('#img').val();
            var num_of_winners = $('#num').val();
            var cutoff_ts = $('#cutoff').datetimepicker('date').unix();
            
            var contract = web3.cmt.contract(abi);
            var data = '0x' + contract.new.getData(title, desc, image_url, num_of_winners, cutoff_ts, {data: bin.object});

            contract.new([title, desc, image_url, num_of_winners, cutoff_ts], {
                from: userAddress.toString(),
                data: data,
                gas: '9999000',
                gasPrice: 2000000000
            }, function (e, instance) {
                if (e) {
                    console.log(e);
                    tip.close();
                    tip.error("Failed to create contract");
                } else {
                    console.log(instance.address);
                    if (instance.address != undefined) {
                        window.location.href = "qrcode.html?code=" + instance.address;
                    } else {
                        var checkTransactionTimer = setInterval(function () {
                            web3.cmt.getTransactionReceipt(instance.transactionHash, function (error, result) {
                                if (!error) {
                                    if (result != null && result.status == '0x1') {
                                        clearInterval(checkTransactionTimer);
                                        if (result.contractAddress != undefined) {
                                            window.location.href = "qrcode.html?code=" + result.contractAddress;
                                        } else if (result.address != undefined) {
                                            window.location.href = "qrcode.html?code=" + result.address;
                                        } else {
                                            tip.close();
                                            tip.error("Could not get a contract address");
                                        }
                                    } else if (result != null && result.status == '0x0') {
                                        tip.close();
                                        tip.error("Failed to create contract");
                                        clearInterval(checkTransactionTimer);
                                    }
                                }
                            })
                        }, 3000);
                    }
                }
            });
        }
    });
}

var getAbi = function () {
    $.ajax({
        url: 'FairPlay.abi',
        sync: true,
        dataType: 'text',
        success: function (data) {
            abi = JSON.parse(data);
        }
    });
}

var getBin = function () {
    $.ajax({
        url: 'FairPlay.bin',
        dataType: 'text',
        sync: true,
        success: function (data) {
            bin = JSON.parse(data);
        }
    });
}