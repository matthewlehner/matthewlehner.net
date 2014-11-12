###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", :locals => {
#  :which_fake_page => "Rendering a fake page with a local variable" }

###
# Helpers
###

activate :blog do |blog|
  blog.permalink = "/{title}.html"
  blog.layout = "article"
end
activate :directory_indexes

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

set :markdown_engine, :redcarpet
set :markdown, fenced_code_blocks: true, smartypants: true

activate :syntax

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

activate :disqus do |d|
  # d.shortname = "matthewlehnerblog"
  d.shortname = "mlblogdev"
end

# Reload the browser automatically whenever files change
configure :development do
  set :domain_name, "http://localhost:4567"
  activate :livereload
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :rsync
  deploy.host   = "cedar"
  deploy.path   = "~/apps/matthewlehner.net"
end

# Build-specific configuration
configure :build do
  set :domain_name, "http://matthewlehner.net"
  activate :minify_css
  activate :minify_javascript
  activate :minify_html
  activate :imageoptim
  activate :gzip

  # Enable cache buster
  activate :asset_hash

  # Use relative URLs
  # activate :relative_assets

  # Or use a different image path
  # set :http_prefix, "/Content/images/"
end
