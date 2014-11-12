---
title: Rails API Testing Best Practices
date: 2013-08-15 00:00 UTC
meta_description: Rails API testing best practises. Guidelines for testing an API using RSpec, what we should be testing for and setting correct expectations.
---
Writing an API is almost a given with modern web applications. I'd like to lay out some simple guidelines and best practises for Rails API testing. We need to determine what to test and why it should be tested. Once we've established what we will be writing tests for, we will set up RSpec to do this quickly and easily. Basically we'll be sending HTTP requests and testing that the response status codes and content match our expectations.

<h2>What to test?</h2>

A properly designed API should return two things: an HTTP response status-code and the response body. Testing the status-code is necessary for web applications with user authentication and resources with different permissions. That being said, testing the response body should just verify that the application is sending the right content.

<h3>HTTP Status Codes</h3>

Typical HTTP responses for a simple API on an application with authentication will generally fall within the following 4 status codes:

<ul>
<li><strong>200: OK</strong> - Basically self-explanitory, the request went okay.</li>
<li><strong>401: Unauthorized</strong> - Authentication credentials were invalid.</li>
<li><strong>403: Forbidden</strong> - The resource requested is not accessible - in a Rails app, this would generally be based on permissions.</li>
<li><strong>404: Not Found</strong> - The resource doesn't exist on the server.</li>
</ul>

If you're wondering why not just use 401 - Unauthorized or 403 - Forbidden for every permission/auth error, I'd suggest reading <a href="http://stackoverflow.com/a/6937030/492566">this stackoverflow answer</a>. If that's not enough, check out the <a href="http://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html">W3 spec</a>.

<h3>Response Body</h3>

It goes without saying that the content body should contain the resources that you requested and shouldn't contain attributes that are private. This is straight forward for <code>GET</code> requests, but what if you're sending a <code>POST</code> or <code>DELETE</code> request? Your test should also ensure that any desired business logic gets completed as expected.

<h2>API Testing is Integration Testing</h2>

Just like we use an integration tests to ensure that our app behaves as planned, we also require that our API responds as desired. These tests are based on HTTP requests to urls with calculated responses. For user interaction, Capybara is my testing tool of choice, but it is the wrong tool for testing APIs. Jonas Nicklas (creator of Capybara) wrote <a href="http://www.elabs.se/blog/34-capybara-and-testing-apis">Capybara and Testing APIs</a> to explain why you shouldn't use it.

<blockquote>
  "Do not test APIs with Capybara. It wasn’t designed for it." - Jonas Nicklas
</blockquote>

Instead, use Rack::Test, rather than the Capybara internals.

<h3>Use RSpec Request Specs</h3>

Since we've established that we'll be using Rack::Test to drive the tests, RSpec request specs make the most sense. There's no need to get fancy and add extra weight to your testing tools for this.

> Request specs provide a thin wrapper around Rails' integration tests, and are designed to drive behavior through the full stack, including routing (provided by Rails) and without stubbing (that's up to you).

To test requests and their responses, just add a new request spec. I'll demonstrate testing a user sessions endpoint. My API returns a token on a successful login.

```ruby
# spec/requests/api/v1/messages_spec.rb
describe "Messages API" do
  it 'sends a list of messages' do
    FactoryGirl.create_list(:message, 10)

    get '/api/v1/messages'

    expect(response).to be_success            # test for the 200 status-code
    json = JSON.parse(response.body)
    expect(json['messages'].length).to eq(10) # check to make sure the right amount of messages are returned
  end
end
```

This works exceptionally well for get, post and delete requests. Just check for the status code you want, and that the response body is as you expected. That being said, with this setup we'll be doing <code>json = JSON.parse(response.body)</code> a lot. This should be a helper method.

<h3>Add JSON Helper</h3>

To DRY things out for future tests, pull the json parsing logic into an RSpec helper. This is what I've done:

```ruby
# spec/support/request_helpers.rb
module Requests
  module JsonHelpers
    def json
      @json ||= JSON.parse(response.body)
    end
  end
end
```

And then add the following line inside the config block of <code>spec_helper.rb</code>

```ruby
RSpec.configure do |config|

  config.include Requests::JsonHelpers, type: :request

end
```

Now we can remove any of the <code>JSON.parse(response.body)</code> calls within our tests.

Let's have another example spec, this time getting a single message.

```ruby
# spec/requests/api/v1/messages_spec.rb
describe "Messages API" do
  it 'retrieves a specific message' do
    message = FactoryGirl.create(:message)    
    get "/api/v1/messages/#{message.id}"

    # test for the 200 status-code
    expect(response).to be_success

    # check that the message attributes are the same.
    expect(json['content']).to eq(message.content) 

    # ensure that private attributes aren't serialized
    expect(json['private_attr']).to eq(nil)
  end
end
```

Okay - you're done. Keep this in mind when you're building out your api, and you'll be golden. I promise. If you need some more info on how to set up your app as an API, I'd highly recommend this article: <a href="http://www.emilsoman.com/blog/2013/05/18/building-a-tested/">Building a Tested, Documented and Versioned JSON API Using Rails 4</a>

