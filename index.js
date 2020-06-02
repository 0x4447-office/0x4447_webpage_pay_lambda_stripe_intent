let stripe = require('stripe')(process.env.STRIPE_API_KEY);

//
//	LAMBDA_DESCRIPTION
//
exports.handler = (event) => {

	return new Promise(function(resolve, reject) {

		//
		//	1. This container holds all the data to be passed around the chain.
		//
		let container = {
			req: {
				amount:event.amount,
				currency:event.currency,
				metadata:event.metadata,
			},
			//
			//	The default response for Lambda.
			//
			res: {
				client_secret: ''
			}
		}

		//
		//	->	Start the chain.
		//
		return_payment_intent(container)
			.then(function(container) {
				
				return resolve(container.res)

			}).catch(function(error) {

				//
				//	->	Stop and surface the error.
				//
				return reject(error);

			});
	});
};

//	 _____    _____     ____    __  __   _____    _____   ______    _____
//	|  __ \  |  __ \   / __ \  |  \/  | |_   _|  / ____| |  ____|  / ____|
//	| |__) | | |__) | | |  | | | \  / |   | |   | (___   | |__    | (___
//	|  ___/  |  _  /  | |  | | | |\/| |   | |    \___ \  |  __|    \___ \
//	| |      | | \ \  | |__| | | |  | |  _| |_   ____) | | |____   ____) |
//	|_|      |_|  \_\  \____/  |_|  |_| |_____| |_____/  |______| |_____/
//

//
//	Create a payment intent so we can charge the user with thier card.
//
function return_payment_intent(container)
{
	return new Promise(function(resolve, reject) {

		let params = {
			amount: parseInt(container.req.amount),
			currency: container.req.currency,
			metadata: container.req.metadata
		};

        //
		//	Create payment intent object using stripe
		//
		stripe.paymentIntents.create(params).then(function(resp) {

			//
			//	Set client secret in container variable.
			//
			container.res.client_secret = resp.client_secret
			
			//
			//	->	Move to the next promise.
			//
			return resolve(container);

		}).catch(function(err){

			console.info(params);
			return reject(err.message)

		})

	});
}
