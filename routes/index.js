const pkg_json = require('../package.json')
const turbo = require('turbo360')({site_id:pkg_json.app})
const vertex = require('vertex360')({site_id:pkg_json.app})
const router = vertex.router()

router.get('/', function(req, res){

	turbo.fetch('link', null)
	.then(data => {
		res.render('index', {links: data})
	})
	.catch(err => {
		res.json({
			confirmation: 'fail,',
			message: err.message
		})
	})

})

module.exports = router