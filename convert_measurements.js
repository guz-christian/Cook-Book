const legend = {tsp:1, tbsp: 3, cup:48};

function convertSmall(measurments,legend){
	let templist = measurments;

	for(let i = 0; i < measurments.length;i++){
		const multiplier = legend[measurments[i].unit];

		if (measurments[i].amount.includes(' ')){
			const wholeNumber = measurments[i].amount.split(' ')[0];

			const numerater = measurments[i].amount.split(' ')[1][0];
			const denomenator = measurments[i].amount.split(' ')[1][2];

			measurments[i].amount = (wholeNumber * multiplier) + ((numerater * multiplier) / denomenator)

		}

		else if (measurments[i].amount.includes('/')){
			const numerater = measurments[i].amount[0];
			const denomenator = measurments[i].amount[2];

			measurments[i].amount = multiplier *numerater / denomenator;
		}

		else{
			measurments[i].amount = measurments[i].amount * multiplier;
		}

		measurments[i].unit = 'tsp';
	}

	return templist;
}

function multipy(measurments,multiplier){
	let templist = measurments;
	for(let i = 0; i < measurments.length; i ++){
		measurments[i].amount = measurments[i].amount * multiplier;
	}
	return templist;
}


function convertLarge(measurments,legend){
	function convertString(denominator,unit,amount, i, list){
		let fraction = 0;
		let whole = 0;
		list[i].unit = unit;

		const loopLength = amount/legend[unit]*denominator;
		for(let i = 0; i<loopLength;i++){
			fraction ++;
			if(fraction == denominator){
				whole ++;
				fraction = 0;
			}
		}

		if(fraction > 0 && whole > 0){
			list[i].amount = String(whole) + ' ' +String(fraction)+ '/' + String(denominator);
		}

		else if(whole > 0){
			list[i].amount = String(whole);
		}
	
		else if(fraction > 0){
			list[i].amount = String(fraction)+ '/' + String(denominator);
		}

	}

	function findNearestUnit(i, list){
		if(list[i].amount % (legend.cup/2) == 0){
			return {'denominator': 2, 'unit': 'cup'};
		}

		else if(list[i].amount % (legend.cup/3) == 0){
			return {'denominator': 3,'unit': 'cup'};
		}
			
		else if(list[i].amount % (legend.cup/4) == 0){
			return {'denominator': 4,'unit': 'cup'};
		}
			
		else if (list[i].amount % (legend.tbsp/2) == 0){
			return {'denominator': 2,'unit': 'tbsp'};
		}

		else if(list[i].amount % (legend.tsp/2) == 0){
			return {'denominator': 2,'unit': 'tsp'};
		}

		else if(list[i].amount % (legend.tsp/4) == 0){
			return {'denominator': 4,'unit': 'tsp'};
		}

		else if(list[i].amount % (legend.tsp/8) == 0){
			return {'denominator': 8,'unit': 'tsp'};
		}
	}

	function checkSize(i){
		let amount = templist[i].amount;
		let amountOverflow = 0;
		let amountDenominator = 0;
		if(templist[i].amount > (legend.cup / 2)){
			while(amount % (legend.cup / 2) != 0){
				amount --;
				amountOverflow ++;
			}
		amountDenominator = 2;
		}

		else if(templist[i].amount > (legend.cup / 3)){
			while(amount % (legend.cup / 2) != 0){
				amount--;
				amountOverflow ++;
			}
		amountDenominator = 3;
		}

		else if(templist[i].amount > (legend.cup / 4)){
			while(amount % (legend.cup / 4) != 0){
				amount --;
				amountOverflow ++;
			}
		amountDenominator = 4
		}

		return {amount: amount, amountOverflow: amountOverflow, amountDenominator: amountDenominator}
	}

	let templist = measurments;
	let templistOverflow = [];

	for(let i = 0; i < templist.length; i++){
		const wholeUnit = findNearestUnit(i, templist);
		if(wholeUnit.unit == 'tsp' || wholeUnit.unit == 'tbsp'){
			const splitAmounts = checkSize(i);
			
			if(splitAmounts.amountOverflow > 0){
				
				convertString(splitAmounts.amountDenominator,'cup', splitAmounts.amount, i, templist);
				
				templistOverflow.push({ingredient: templist[i].ingredient, amount: splitAmounts.amountOverflow});
			}
		}
		else{
			convertString(wholeUnit.denominator, wholeUnit.unit, templist[i].amount, i, templist);
		}
	}
	for(let i = 0; i < templistOverflow.length; i++){
		const wholeUnit = findNearestUnit(i, templistOverflow);
		console.log(wholeUnit)
		convertString(wholeUnit.denominator, wholeUnit.unit, templistOverflow[i].amount, i, templistOverflow);
	}

	return [templist, templistOverflow];
}

function organize(list){
	const loopLength = list[0].length;
	const loopLengthOverflow = list[1].length;
	let templist = []

	for(let i1 = 0; i1 < loopLength; i1++){
		templist.push(list[0][i1]);
		for(let i2 = 0; i2 < loopLengthOverflow; i2++){
			if(list[0][i1].ingredient == list[1][i2].ingredient){
				templist.push(list[1][i2]);
			}
		}

	}
	return templist;
}




const recipe = [{unit: 'tbsp', amount: '5', ingredient: 'flour'},{unit: 'cup', amount: '1', ingredient: 'water'},{unit: 'tbsp', amount: '5', ingredient: 'vital wheat gluten'}];

//const recipe = [{unit: 'tbsp', amount: '5', ingredient: 'vital wheat gluten'}];

let newRecipe = convertSmall(recipe,legend);
newRecipe = multipy(newRecipe,2);
newRecipe = convertLarge(newRecipe,legend);
newRecipe = organize(newRecipe);

console.log(newRecipe)