import Acounts from '/imports/api/collections/Acounts'
import {_k} from '/imports/api/utils'
import {findByRefId} from '/imports/api/cf/accounts/utils'
import quantumCheck from '/imports/api/cf/accounts/quantumCheck'
import {Meteor} from 'meteor/meteor'

var exp = {}

exp.addressExists = function (address, refId) {
  if (!refId) return false;
  var accounts = findByRefId(refId, {private:true});
  var addresses = _.flatten(_.map(accounts.fetch(), function (account) {
    return _.map(account.addresses, function (v, k) {
      return k;
    })
  }));
  return addresses.indexOf(address) > -1
};


// autoupdate balances.
// 1. userId passed - do for all accounts
// 2. accountKey passed - do for that accountKey (use userId too.)

// get auto balances per address


//

// per single address.
// todo: operate at account level?
// private should be set by server.
exp.updateBalanceAddress = function(accountIn, address) {
  var account = typeof accountIn === "string" ? Acounts.findOne({_id: accountIn}) : accountIn;
  var addressObj = account && account.addresses && account.addresses[address];
  var modify = {
    $set: {},
    $unset: {}
  };

  if (!account || !addressObj) return;

  var balances = quantumCheck(address);
  if (balances[0] == "error") {
		console.log("in updateBalanceAddress, got error  ")
		return;
	}

  var key = _k(["addresses", address, "assets"]);

  _.each(addressObj.assets, function(asset, assetKey) {
    if (asset.update === "auto") {
      modify.$unset[_k([key, assetKey])] = "true";
    }
  });

  //print("balances", balances)

  _.each(balances, function(balance) {
    if (!balance.asset) return;

    var k = _k([key, balance.asset]);
    modify.$set[k] = {
      update: "auto",
      quantity: balance.quantity
    /*  vBtc: balance.vBtc,
      vUsd: balance.vUsd, */
    };
    delete modify.$unset[k];
  });

  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);
  if (_.keys(modify).length) {
    modify.$set[_k(["addresses", address, "updatedAt"])] = new Date();
    Acounts.update({
      _id: account._id
    }, modify);
  }
  //TODO: updateAddressBalance(account._id, address);
  // then updateAccountBalance(account._id)
};



exp.updateBalances = function(options) { //todo: optimize
  check(options, Object);

  var refId = options.refId;
  var accountKey = options.accountKey;
  var address = options.address;
  var private = options.private;

  var selector = {};
  if (options.refId) _.extend(selector, {
    refId: refId
  });
  if (options.accountKey) _.extend(selector, {
    _id: accountKey
  });

  Acounts.find(selector).forEach(function(account) {
    exp.updateBalanceAccount(account, options);
  });
};


// is version of _updateBalanceAddress, aims to operate at account level (less writes to db)
exp.updateBalanceAccount = function(accountIn, options) {

  var modify = {
    $set: {},
    $unset: {}
  };
  var account = typeof accountIn === "string" ? Acounts.findOne({_id: accountIn}) : accountIn;

  if (!account || !account.addresses) return

  if (!options.private) {
    var lastUpdate = account.updatedAt;
    //if (lastUpdate && (new Date().valueOf() - lastUpdate.valueOf()) < 300000) { //5 minutes
    //  return account._id;
    //}
  }

  _.each(account.addresses, function(addressObj, address) {
    var balances = quantumCheck(address);
    var key = _k(["addresses", address, "assets"]);

    // if balance checker is ok
    if (balances[0] == "error") {
			console.log("in updateBalanceAccount, got error balance on " + address )
      return;
		}
    _.each(balances, function(balance) {
      if (!balance.asset) {
        console.log("...")
        console.log("in updateBalanceAccount, got balance without asset")
        console.log(balance)
        console.log("---")
        return;
      }

      let k = _k([key, balance.asset]);
      if (balance.quantity == 0) {
        modify.$unset[k] = true
      } else {
        modify.$set[k] = {
          update: "auto",
          quantity: balance.quantity
        };
      }
      modify.$set[_k(["addresses", address, "updatedAt"])] = new Date();
    });
  });


  if (_.isEmpty(modify.$unset)) delete(modify.$unset);
  if (_.isEmpty(modify.$set)) delete(modify.$set);

  if (!_.isEmpty(modify)) {
    modify.$set[_k(["updatedAt"])] = new Date();
    Acounts.update({
      _id: account._id
    }, modify);
  }
  return account._id;
};

exp.importFromUser = function(userId) {
  var user = Meteor.users.findOne({
    _id: userId
  });
  if (!user) return;
  var accounts = user.accounts || {};
  var accountsPrivate = user.accountsPrivate || {};
  _.each(accounts, function(account, key) {
    var doc = {
      name: account.name,
      addresses: account.addresses,
      refId: userId,
      createdAt: new Date(),
      index: key // back compat. no need
    };
    Acounts.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
  _.each(accountsPrivate, function(account, key) {
    var doc = {
      name: account.name,
      addresses: account.addresses,
      isPrivate: true,
      refId: userId,
      createdAt: new Date(),
      index: key // back compat. no need
    };
    Acounts.upsert({
      refId: userId,
      index: key // back compat. no need
    }, doc);
  });
};

module.exports = exp