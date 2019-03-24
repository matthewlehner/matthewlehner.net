---
title: Exporting CSVs Using Phoenix
date: 2016-05-04T03:19Z
description:
  This article shows how to export CSVs from Elixir's web framework, Phoenix,
  using the underlying Elixir library, Plug.
cover_image: exporting-csv-files-from-phoenix.svg
tags: ["elixir", "phoenix"]
path: "exporting-csvs-with-phoenix-elixir"
---

Phoenix is the de facto web framework for Elixir, and it's quite common to need
to export CSVs from a web app. Let's have a look at how this works in Phoenix.

We'll be using Phoenix 1.2, with the [CSV][github-csv] package to get everything
going.

## Adding the CSV package

First, we need to install CSV – the package is good for both encoding and
decoding CSV files so it will handle all the heavy lifting for us. Add the
following to `mix.exs`:

```elixir
defp deps do
  [
    # The rest of your dependencies will be here
    {:csv, "~> 1.4.0"}
  ]
end
```

Once this is done, run `mix deps.get` and we'll be able to use CSV in our app.

## Working with `CSV`

Before we create our endpoint, let's have a look how `CSV` works. Here, we'll be
working with a list of lists, as this translates directly to the type of data
that `CSV.encode/2` is expecting. A quick example of how this works:

```elixir
raw_csv_content = [['a', 'list'],['of', 'lists']]
  |> CSV.encode
  |> Enum.to_list
  |> to_string

raw_csv_content # => "a,list\r\nof,lists\r\n"
```

Let's break down what's happening here.

First, we take a list of lists and pass it to `CSV.encode/2`.

`CSV.encode/2` expects a stream of data in a tabular format, and encodes it to
RFC 4180 compliant CSV lines. If you don't know what RFC 4180 is, don't worry, I
didn't either, but I did some googling and found the [Common Format and MIME
Type for Comma-Separated Values (CSV) Files][rfc-4180] specification. Great!
Since CSV returns a stream, we need to turn it back into a list. Streams are
great for working with large datasets, but are more complex and worth an entire
post in themselves.

The list we get back from `Enum.to_list/1` looks like this:

```elixir
["a,list\r\n", "of,lists\r\n"]
```

Each of the items in it is a CSV row, so to make the entire CSV, we could write
it to a file, or in our case, we'll send it along as the response from our
endpoint.

Let's create the endpoint now.

## Creating our CSV controller and endpoint

The first thing that we need to do is add an endpoint to the router. For this
example, we'll add our own controller called `CsvController` with the action
`export`.

First, let's define the route:

```elixir
  scope "/", ExampleApp do
    pipe_through :browser # Use the default browser stack

    get "/csv", CsvController, :export
  end
```

Now, when we make a get request to `/csv` it will hit the `export` action in our
`CsvController`.

At this point, your app won't compile, because we haven't made the controller.
We'll do that next.

Create a new file at `web/controllers/csv_controller.ex` that looks like this:

```elixir
defmodule ExampleApp.CsvController do
  use ExampleApp.Web, :controller

  def export(conn, _params) do
    conn
    |> put_resp_content_type("text/csv")
    |> put_resp_header("content-disposition", "attachment; filename=\"A Real CSV.csv\"")
    |> send_resp(200, csv_content)
  end

  defp csv_content do
    csv_content = [['a', 'list'],['of', 'lists']]
    |> CSV.encode
    |> Enum.to_list
    |> to_string
  end
end
```

This is the whole thing – if you stop now, it'll work. Visit `/csv` in your
browser and you'll find yourself downloading our very important CSV file. 😉

Let's talk about what's happening. If you look at the private function
`csv_content`, you'll notice that it's the same thing we were working with in
the [Working with `CSV`](#working-with-csv) section. It turns the list into a
string of CSV rows.

The stuff we haven't seen yet is happening in the `export` function. Because
we're not sending back a normal HTML response, we use `put_resp_content_type/2`
to set the `Content-Type` header to the correct MIME type – `text/csv`. Then, we
use `put_resp_header/3` to set the `Content-Disposition` header to specify that
it is an attachment, with the filename `A Real CSV.csv`.

Finally, we send the response, with a `200` status (or success), and the
stringified contents of the CSV itself.

In this endpoint, we're using two functions from Plug directly. You can read
more in the docs for each – [`put_resp_content_type`
docs][put-resp-content-type-docs], and [`put_resp_header`
docs][put-resp-header-docs].

##### Regarding `put_resp_header`

You may have noticed that we're passing a lower case `"content-disposition"`
header name to `put_resp_header`. This the recommended approach with Plug, as
the docs say:

> It is recommended for header keys to be in lower-case, to avoid sending
> duplicate keys in a request. As a convenience, this is validated during
> testing which raises a `Plug.Conn.InvalidHeaderError` if the header key is not
> lowercase.

Using Plug like this illustrates how easy it is to dig down to the lower level
functions that allow you to do extremely powerful things without much effort.

## Linking in a template

Last but not least, we'll want to link to the CSV exporting endpoint. Pop this
code into a template, and now all your end users will be able to download CSVs!

```elixir
<%= link "Download CSV", to: csv_path(@conn, :export) %>
```

#### Credits and Attribution

_Thanks to Oliviu Stoian for the CSV File icon_

[github-csv]: https://github.com/beatrichartz/csv
[rfc-4180]: https://tools.ietf.org/html/rfc4180
[put-resp-content-type-docs]:
  https://hexdocs.pm/plug/Plug.Conn.html#put_resp_content_type/3
[put-resp-header-docs]: https://hexdocs.pm/plug/Plug.Conn.html#put_resp_header/3
