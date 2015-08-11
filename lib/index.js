/**
 * Imports
 */

var superagent = require('superagent-as-promised')(require('superagent'))
var joinUrl = require('url-join')

/**
 * Vars
 */

var baseUrl = 'https://<dc>.api.mailchimp.com/3.0/'

/**
 * Mailchimp wrapper
 */

function wrapper (opts) {
  var dc = opts.dc
  var apiKey = opts.apiKey

  if(! dc) throw new Error('Must provide mailchimp datacenter for your account')
  if(! apiKey) throw new Error('Must provide mailchimp API key')

  var base = baseUrl.replace(/\<dc\>/, dc)
  var request = requestor(base, apiKey)


  return {
    subscribe: function (listId, email, mergeFields) {
      return request
        .post('/lists/' + listId + '/members/')
        .send({
          email_address: email,
          status: 'subscribed',
          merge_fields: mergeFields
        })
        .then(function (res) {
          if(res.status !== 200)
            throw new Error(res.body)

          return res.body
        })
    }
  }
}

function requestor (base, apiKey) {
  return ['get', 'put', 'post', 'delete'].reduce(function(memo, method) {
    memo[method] = function (url) {
      return superagent[method](joinUrl(base, url))
        .set('Authorization', 'apikey ' + apiKey)
    }
    return memo
  }, {})
}

/**
 * Exports
 */

module.exports = wrapper