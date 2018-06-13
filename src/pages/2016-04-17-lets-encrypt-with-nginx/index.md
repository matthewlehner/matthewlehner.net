---
title: Using Let's Encrypt With NGINX
date: 2016-04-17T16:52Z
meta_description: Quickly set up NGINX to use Let's Encrypt's free SSL certificates. Using them together is simple, but not as automated as it could be.
image: lets-encrypt-with-nginx.svg
path: "/lets-encrypt-with-nginx"
---

Setting up NGINX to use SSL certificates from Let's Encrypt isn't as automated
as the Apache tooling, at least, not right now. That said, with a bit of setup,
we can configure this to work with NGINX very easily.

Here's what the entire setup process looks like:

1.  Install the Let's Encrypt client
2.  Create a Let's Encrypt configuration file for the domain
3.  Add an NGINX server block to allow Let's Encrypt to verify the domain
4.  Verify the domain and generate SSL certificates
5.  Set up NGINX to serve using our new SSL certificates

## A Note About File Permissions

There are a few gotchas that may sneak up on you while working through this
guide. The main thing that I ran into is that Let's Encrypt and NGINX will need
read and write access to specific files and directories on your system. I'm not
going to get into file permissions in this article, but I will mention
where/when this will be necessary.

Let's get started!

## Install the Let's Encrypt Client

The [Let's Encrypt client][lets-encrypt-client] is available on github. We'll
clone it to our user's home directory. In this instance, the username is
`deployer`. After this, running `letsencrypt-auto` will install Let's Encrypt's
dependencies using `apt-get` or `yum`.

```sh
cd /home/deployer
git clone https://github.com/letsencrypt/letsencrypt
cd letsencrypt
./letsencrypt-auto
```

For more information about this, read the official [Let's Encrypt
installation][lets-encrypt-install-docs] docs.

## Create the Let's Encrypt Configuration File

To issue an SSL certificate, Let's Encrypt requires a few piece of information
which we're going to store in a configuration file for easy reuse later. Write
this information to `/etc/letsencrypt/cli.ini` – both your user, and the user
that runs NGINX will need read and write access to this directory and its
children as it's also where the SSL certificates will be stored.

```ini
# /etc/letsencrypt/cli.ini
rsa-key-size = 4096
email = youremail@address.com
domains = yourdomain.com, www.yourdomain.com
text = True
authenticator = webroot
standalone-supported-challenges = tls-sni-01
webroot-path = /tmp/letsencrypt
```

There are more details in the documentation for a [Let's Encrypt configuration
file][letsencrypt-config-file].

## Configuring NGINX for Webroot Authentication

We're going to use [webroot authentication][letsencrypt-webroot-authentication]
in the Let's Encrypt client to obtain our SSL certificates. So, add this
configuration option to your domain's NGINX server block:

```nginx
server {
  listen 80;
  server_name yourdomain.com

  # other NGINX config for your domain

  location '/.well-known/acme-challenge' {
    default_type "text/plain";
    root         /tmp/letsencrypt;
    autoindex    on;
  }
}
```

Once you've added this to your server block, tell NGINX to reload the config
files `sudo nginx -s reload`.

What we're doing here is telling NGINX to statically serve any requests to
yourdomain.com/.well-known/acme-challenge and its subdirectories from the
`/tmp/letsencrypt/` directory on your server for the webroot authenticator. For
this to work, **NGINX will need permission to read from the `/tmp/letsencrypt`
directory**.

In the next step, I'll explain why, and how this works.

## Verifying the Domain and Receiving SSL Certificates

Now that this is set up, we need to request the certificates from Let's Encrypt.
Here's how:

```shell
mkdir -p /tmp/letsencrypt

/home/deployer/letsencrypt/letsencrypt-auto certonly \
  --server https://acme-v01.api.letsencrypt.org/directory \
  --agree-dev-preview \
  --config /etc/letsencrypt/cli.ini

sudo nginx -s reload
```

To break down what happens:

1.  The Let's Encrypt client creates a file in `/tmp/letsencrypt` containing a
    token.
2.  Then, the client tells the Let's Encrypt server that it can verify the
    domain by requesting the file it has created with a request to
    `yourdomain.com/.well-known/acme-challenge/token-filename`
3.  If the file is present, Let's Encrypt will generate SSL certificates for the
    domain and copy them to `/etc/letsencrypt/live/yourdomain.com/`
4.  The Let's Encrypt client cleans up the file from `/tmp/letsencrypt`

And that's it, you're ready to set up NGINX to use your brand new SSL
certificates.

## Configuring NGINX to Serve via SSL

This is a complete NGINX server block – with these certificates, it receives an
A on the [Qualys SSL Labs Scanner][ssl-scanner] but won't support older versions
of Android devices or Internet Explorer. _Disclaimer_ – these configurations
come from the [Mozilla SSL Configuration Generator][mozilla-ssl-generator] and
[an NGINX example config][letsencrypt-example-config] from the Let's Encrypt
forums. You may want different options based on browser support.

To use it, there's one additional step. You'll need to generate a `dhparam.pem`
file in `/etc/nginx` by running:

```shell
openssl dhparam -out /etc/nginx/dhparam.pem 2048
```

Finally, here is the NGINX config – replace `yourdomain.com` in this file with
your own domain name, tell NGINX where the project root is, and everything
_should_ work.

```nginx
server {
  root /home/deployer/webroot-path;
  listen 443 ssl;
  server_name yourdomain.com;

  ssl on;
  ssl_certificate /etc/letsencrypt/live/yourdomain.com/cert.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
  ssl_session_timeout 1d;
  ssl_session_cache shared:SSL:50m;
  ssl_session_tickets off;

  # Diffie-Hellman parameter for DHE ciphersuites, recommended 2048 bits
  # Generate with:
  #   `openssl dhparam -out /etc/nginx/dhparam.pem 2048`
  ssl_dhparam /etc/nginx/dhparam.pem;

  # modern configuration. tweak to your needs.
  ssl_protocols TLSv1.1 TLSv1.2;
  ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK';
  ssl_prefer_server_ciphers on;

  # HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
  add_header Strict-Transport-Security max-age=15768000;

  # OCSP Stapling ---
  # fetch OCSP records from URL in ssl_certificate and cache them
  ssl_stapling on;
  ssl_stapling_verify on;

  ## verify chain of trust of OCSP response using Root CA and Intermediate certs
  ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
}
```

## Renewing Certificates

The great thing about this process is that it is easy to schedule. Once you've
gotten everything working, you can simply run the command to generate
certificates when they are close to expiring, and it will generate new ones for
you and symlink them into the same location. Once the new certificates have been
generated, you need restart NGINX, and you're done!

[lets-encrypt-client]: https://github.com/letsencrypt/letsencrypt
[lets-encrypt-install-docs]: https://letsencrypt.readthedocs.org/en/latest/using.html#installation
[letsencrypt-config-file]: https://letsencrypt.readthedocs.org/en/latest/using.html#configuration-file
[ssl-scanner]: https://www.ssllabs.com/ssltest/
[mozilla-ssl-generator]: https://mozilla.github.io/server-side-tls/ssl-config-generator/
[letsencrypt-example-config]: https://community.letsencrypt.org/t/nginx-configuration-sample/2173
[letsencrypt-webroot-authentication]: http://letsencrypt.readthedocs.io/en/latest/using.html#webroot
