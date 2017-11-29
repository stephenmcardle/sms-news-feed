const pkg_json = require('../package.json')
const turbo = require('turbo360')({site_id:pkg_json.app})
const vertex = require('vertex360')({site_id:pkg_json.app})
const router = vertex.router()
const superagent = require('superagent')
const cheerio = require('cheerio')
const scrape = require('../utils/scrape')

router.get('/', function(req, res){
	var url = req.query.url

	if (url == null) {
		res.json({
			confirmation: 'fail',
			message: 'missing url query parameter'
		})
		return
	}

	superagent
	.get(url)
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
		res.json({
			confirmation: 'success',
			tags: tags
		})
	
	})
})



module.exports = router
