const pkg_json = require('../package.json')
const turbo = require('turbo360')({site_id:pkg_json.app})
const vertex = require('vertex360')({site_id:pkg_json.app})
const router = vertex.router()
const superagent = require('superagent')
const scrape = require('../utils/scrape')


router.get('/', function(req, res){

	res.json({
		confirmation: 'success',
		data: 'this is the sms route!'
	})

})

// This will receive texts from Twilio
router.post('/', function(req, res){

	var body = req.body // this is the data from Twilio
	var message = body['Body']
	if (message == null) {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
		return
	}
	var from = body['From'] // the phone #
	if (from == null) {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
		return
	}

	// This is a URL
	if (message.indexOf('http') != -1) {
		superagent
		.get(message)
		.query(null)
		.end((err, response) => {
			if (err) {
				res.json({
					confirmation: 'fail',
					message: err.message
				})
				return
			}

			var tags = scrape.tags(response.text)
			
			turbo.create('link', tags)
			.then(data => {
				res.json({
					confirmation: 'success',
					data: data
				})
			})
			.catch(err => {
				res.json({
					confirmation: 'fail',
					message: err.message
				})
			})
		})

		return
	}

	
	var sms = {
		from: from,
		message: message
	}

	turbo.create('sms', sms)
	.then(data => {
		res.json({
			confirmation: 'success',
			data: data
		})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail',
			message: err.message
		})
	})

})



module.exports = router