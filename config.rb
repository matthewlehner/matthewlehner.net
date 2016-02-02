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
#
# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

helpers do
  def domain_name
    if build?
      "http://matthewlehner.net"
    else
      "//localhost:4567"
    end
  end
end


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

activate :disqus do |d|
  d.shortname = "mlblogdev"
end

# Reload the browser automatically whenever files change
configure :development do
  activate :livereload
end

activate :external_pipeline,
         name: :webpack,
         command: build? ? "npm run build" : "npm start",
         source: ".tmp/dist",
         latency: 1

# Build-specific configuration
configure :build do
  activate :asset_hash
  activate :minify_css
  activate :minify_javascript
  activate :minify_html
  activate :gzip
end

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.deploy_method = :rsync
  deploy.host   = "cedar"
  deploy.path   = "~/apps/matthewlehner.net"
  deploy.flags  = "-avz --chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r"
end
