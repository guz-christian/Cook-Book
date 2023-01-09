legend = {"tsp":1, "tbs":3,"cup":48}

def convert_small(measurements, legend):

	templist = measurements
	for item in templist:
		if ' ' in item['amount']:
			x = item['amount'].split()
			whole = 0
			fraction = 0
			for num in x:
				if '/' in num:
					fraction = ((float(num[0])*legend[item['unit']])/float(num[2]))
				else:
					whole = (float(num)*legend[item['unit']])

			item['amount'] = whole + fraction

		elif '/' in item['amount']:
			item['amount'] = float(item['amount'][0]) * legend[item['unit']] / float(item['amount'][2])
			
		
		else:
			item['amount'] = float(item['amount']) * legend[item['unit']]
	return templist



def multiply(measurements,multiplier):
	templist = measurements
	for item in templist:
		item['amount'] = item['amount'] * multiplier
	return templist




def convert_large(measurements,legend):

	def change_to_string(denominator, unit, amount):
		fraction = 0
		whole = 0
		item['unit'] = unit
		for x in range(int(amount/(legend[unit]/denominator))):
			fraction += 1
			if fraction == denominator:
				whole += 1
				fraction = 0

		if fraction > 0 and whole > 0:
			item['amount'] = str(whole) + ' ' +str(fraction)+ '/' + str(denominator)

		elif whole > 0:
			item['amount'] = str(whole)
	
		elif fraction > 0:
			item['amount'] = str(fraction)+ '/' + str(denominator)
			

	def check_size():
		amount = float(item['amount'])
		amount_overflow = 0
		templist = []
		amount_denominator = 0
		if item['amount'] > (legend['cup']/2):
			while amount % (legend['cup']/2) != 0:
				amount -= 1
				amount_overflow += 1
			amount_denominator = 2


		elif item['amount'] > (legend['cup']/3):
			while amount % (legend['cup']/3) != 0:
				amount -= 1
				amount_overflow += 1
			amount_denominator = 3
		
		elif item['amount'] > (legend['cup']/4):
			while amount % (legend['cup']/4) != 0:
				amount -= 1
				amount_overflow += 1
			amount_denominator = 4
		return {'amount': amount,'amount_overflow': amount_overflow,'amount_denominator': amount_denominator}




	def find_nearest_whole_number():
		if item['amount'] % (legend['cup']/2) == 0:
			return {'denominator': 2, 'unit': 'cup'}

		elif item['amount'] % (legend['cup']/3) == 0:
			return {'denominator': 3,'unit': 'cup'}
			
		elif item['amount'] % (legend['cup']/4) == 0:
			return {'denominator': 4,'unit': 'cup'}
			
		elif item['amount'] % (legend['tbs']/2) == 0:
			return {'denominator': 2,'unit': 'tbs'}

		elif item['amount'] % (legend['tsp']/2) == 0:
			return {'denominator': 2,'unit': 'tsp'}

		elif item['amount'] % (legend['tsp']/4) == 0:
			return {'denominator': 4,'unit': 'tsp'}

		elif item['amount'] % (legend['tsp']/8) == 0:
			return {'denominator': 8,'unit': 'tsp'}


	templist = measurements
	templist_overflow = []

	for item in templist:
		whole_number = find_nearest_whole_number()
		if whole_number['unit'] == 'tsp' or whole_number['unit'] == 'tbs':
			split_amounts = check_size()
			if split_amounts['amount_overflow'] > 0:
				change_to_string(split_amounts['amount_denominator'],'cup', split_amounts['amount'])
				templist_overflow.append({'ingredient': item['ingredient'], 'amount': split_amounts['amount_overflow']})

			else:
				change_to_string(whole_number['denominator'], whole_number['unit'], item['amount'])

		else:
			change_to_string(whole_number['denominator'], whole_number['unit'], item['amount'])

	for item in templist_overflow:
		whole_number = find_nearest_whole_number()
		change_to_string(whole_number['denominator'],whole_number['unit'], item['amount'])
		templist.append(item)

	return templist



def organize(measurements):
	x = {i['ingredient']:measurements.count(i) for i in measurements}
	return x


cupcake = [{'ingredient':'flour', 'unit': 'cup', 'amount': '1 3/4'}, {'ingredient': 'sugar', 'unit': 'cup', 'amount': '1'}, {'ingredient': 'baking powder', 'unit': 'tsp', 'amount': '1 1/2'} , {'ingredient': 'Vanilla extract', 'unit': 'tsp', 'amount': '2'}, {'ingredient': 'vegetable oil', 'unit': 'cup', 'amount': '1/3'}, {'ingredient':'soy milk', 'unit': 'cup', 'amount': '1'}, {'ingredient':'apple cider vinigar', 'unit': 'tsp', 'amount': '1'}]

frosting = [{'ingredient':'butter', 'unit': 'cup', 'amount': '1/2'}, {'ingredient':'powder sugar', 'unit': 'cup', 'amount': '1 1/2'}, {'ingredient':'vanilla extract', 'unit': 'tsp', 'amount': '1/2'}, {'ingredient':'soy milk', 'unit': 'tsp', 'amount': '1'}]

cupcake = convert_small(cupcake,legend)
cupcake = multiply(cupcake,2.5)
cupcake = convert_large(cupcake,legend)




frosting_update = convert_large(multiply(convert_small(frosting,legend),2.5),legend)

for item in cupcake:
	print(item)