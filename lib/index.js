/**
 * Imports
 */

var request = require('superagent')

/**
 * Vars
 */

var baseUrl = 'https://<dc>.api.mailchimp/3.0/'

/**
 * Mailchimp wrapper
 */

function wrapper (opts) {
  var dc = opts.dc
  var apiKey = opts.apiKey

  if(! dc) throw new Error('Must provide mailchimp datacenter for your account')
  if(! apiKey) throw new Error('Must provide mailchimp API key')

  var base = baseUrl.replace(/\<dc\>/, dc)

  return {
    subscribe: function (listId, email, mergeFields, cb) {
      if ('function' === typeof mergeFields) {
        cb = mergeFields
        mergeFields = undefined
      }

      request
        .post(base + '/lists/' + listId + '/members/')
        .send({
          email_address: email,
          status: 'subscribed',
          merge_fields: mergeFields
        })
        .end(cb)
    }
  }
}

/**
 * Exports
 */

module.exports = wrapper