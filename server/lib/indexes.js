
Meteor.startup(function() {

	MarketData._ensureIndex({ timestamp: 1 });
	// Neither name, nor symbol are unique, but their pair is.

//
	MarketData._ensureIndex({
		systemId: 1,
		timestamp: 1,
		interval: 1,
		source: 1,
	}, {
		unique: true,
		dropDups: true,
	});

	//CurrentData._ensureIndex({ name: 1, symbol: 1 });

// obsolete schema
	CurrentData._ensureIndex({
		"_id": 1,
		"token.symbol": 1
	}, {
		unique: true,
		sparse: true,
		dropDups: true
		//background: true
	});

	Meteor.users._ensureIndex({
		"username": 1
	}, {unique: 1} )


	CurrentData._ensureIndex({"ratings.rating_cyber": 1, "metrics.cap.btc": 1});
	CurrentData._ensureIndex({"metrics.supplyChangePercents.day": 1}, {sparse: true});
	CurrentData._ensureIndex({"metrics.cap.btc": 1});
	CurrentData._ensureIndex({"metrics.cap.usd": 1});
	CurrentData._ensureIndex({"metrics.capChangePercents.day.btc": 1}, {sparse: true});
	CurrentData._ensureIndex({"metrics.capChangePercents.day.usd": 1}, {sparse: true});

	CurrentData._ensureIndex({"crowdsales": 1}, {sparse: true});
	CurrentData._ensureIndex({"descriptions.state": 1}, {sparse: true});
	CurrentData._ensureIndex({"aliases.quantum": 1}, {sparse: true});

	CurrentData._ensureIndex({"flags.supply_from_here": 1}, {sparse: true});
	CurrentData._ensureIndex({"flags.rating_do_not_display": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.BR.sum": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.CS.sum": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.GR.monthlyGrowthB": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.GR.monthlyGrowthD": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.GR.months": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.GR.sum": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.WL.sum": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.vector.LV.sum": 1}, {sparse: true});
	CurrentData._ensureIndex({"calculatable.RATING.sum": 1}, {sparse: true});
});
