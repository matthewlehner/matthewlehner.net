---
title: Ember.js Concepts for Rails Developers
date: 2013-10-05 00:00 UTC
meta_description: A comparison of Rails vs Ember.js MVC definitions to understand the similarities and differences between how they delegate responsibilities.
image: ember_concepts_for_rails_developers-2.jpg
---

<p>Moving from a full stack framework like Rails to a front end framework like Ember.js is less of a leap than you might anticipate. You're probably already using jQuery for some elements of interactivity, but at a certain point, you came up against that wall of maintainability and ended up with a hearty serving of front end spaghetti code. Yum. Here's where a frontend framework can help, but this can cause a different kind of confusion.</p>

<p>Of course, switching from Rails to a front end framework presents you with a new set of tools, many of which have the same names as the ones you are already familiar with. This really comes to a head with the issue of how responsibilities are delegated, so let's have a Rails vs Ember.js comparison of the two frameworks to clear this up.</p>

<h2>Origins of MVC</h2>

<p>First, lets take a walk through history. A really quick walk.</p>

<p>Wikipedia tells us that the term Model-View-Controller <a href="http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller">showed up in the 1970s</a>. Rails doesn't follow this original definition of MVC. At this point, this doesn't matter, because Rails is widespread and you probably make money because you know how to use it. Assuming that you've decided to use Ember (or other front end framework), they follow the traditional definition.</p>

<p>Great. Now we're ready to go!</p>

<h2>The Model</h2>

<p>Here, Rails doesn't differ too much from Ember or other frontend frameworks. A model defines a specific data structure and its relationship to other data structures. Think of a data structure as a predefined set of attributes, like a user or an appointment or a blog post, and how these things are persisted (saved to the database or whatever kind of scheme you might have cooked up).</p>

<p>The frameworks differ in the way that they persist things. In Rails, if you call <code>save</code> on an instance of a model it gets saved to the database. Cool. That's all well and good for server side code, but what should happen when you call <code>save</code> on an instance of a model in a front end framework? This becomes a little more complex when you're running client side code and can't speak directly to your database.</p>

<p>Ember.js provides this through the <a href="https://github.com/emberjs/data">Ember Data</a> library. At the time of writing, Ember Data isn't part of the standard Ember distribution, but as of 1.0.0-beta.1 (released back in August 2013), the API and core features have stabilized. This separate library makes a lot of sense, because having the client deal with the code creates a lot more decisions that need to be made.</p>

<p>On the client side, rather than dealing with a database interaction, we're dealing with multiple responsibilities. Our framework needs to make requests to endpoints of the webapp, serialize data and figure out if it should be cached locally. Ember Data breaks down these responsibilities into seperate concepts, each of which is clearly defined <a href="http://emberjs.com/guides/models/">here</a>.</p>

<p>A point of clarification - If you look at the current Ember.js guides you'll see two sections talking about models. <a href="http://emberjs.com/guides/models/">Models</a> is the section you want. <a href="http://emberjs.com/guides/object-model/classes-and-instances">The Object Model</a>, just refers to Ember's adherence to object oriented design principles (a topic for a different post, perhaps).</p>

<h2>The View</h2>

<p>The overall concept of the view covers the user interface, or "the stuff that the user interacts with."</p>

<p>In Rails, a view is an HTML template written with some ERB or HAML to render out stuff from the database. If you're doing it "the Rails way", you're probably DRYing things out with partials and maybe using helper methods or a presenter or decorator pattern. You may then sprinkle them with JavaScript to provide a rich, interactive app with a modern feel.</p>

<p>In Ember, there's a fairly clear distinction between the concept of templates and views. Templates are compiled with <a href="http://handlebarsjs.com/">Handlebars</a>, and would be akin to the ERB or HAML that you'd be used to working with in Rails. Views are the logic that controls event handling behind the scenes. Generally, you won't even need to interact with these JavaScript objects (Ember and Handlebars define them for you, intelligently) unless you're creating a re-usable component. Ember has already pre-packaged some of these for you, including checkboxes, textfields, select and text areas. Thanks Ember.js!</p>

<h2>The Controller</h2>

<p>Okay, I'm not going to lie. This is where stuff gets really crazy. Hold on to your hats, we're about to embark on a wild, mind-bending ride, but at the end of this, you'll understand how a front end framework thinks about its controllers, and why this is so important.</p>

<p>The Rails Guide, <a href="http://guides.rubyonrails.org/action_controller_overview.html">Action Controller Overview</a>, says</p>

<blockquote>
  <p>your controller is responsible for making sense of the request and producing the appropriate output</p>
</blockquote>

<p>We're all Rails experts here, so we know that the controller is what's supposed to send stuff to the view template. And maybe redirect the browser. And maybe send jobs to background processing and maybe create new objects in the database or load things out of it. Boy, it sure looks like the Rails controller has a lot of stuff to do!</p>

<p>When dealing with a client side framework, I like to think of controllers as 'view controllers', because they control the view. I came to the client side framework world from Rails, so that was the easiest way for me to think about what responsibilities controllers have on this side of things. If you remember our earlier walk through history, Ember's definition is actually more inline with the original.</p>

<p>That being said, what kind of responsibilities would you expect Ember's controllers to have? Controllers will handle UI functionality that probably won't be persisted. For example:</p>

<p>Let's say that you have an option to hide items in a list. When you enable it, certain list items are hidden in the UI. You wouldn't need to save the UI state to the database, but the controller still needs to know about it. This could be accomplished by by setting an <code>isHidden</code> attribute in the controller to <code>true</code>. The controller would pass this along to the template, which would update the UI and hide the item. So, in Ember.js, controllers act as another layer on top of a model, adding logic around how it should be displayed by the template.</p>

<p>However, controllers are not always backed by models. In some cases, a controller will just store attributes that pertains to a current view. The Ember docs have a great example of this pattern with the <a href="http://emberjs.com/guides/controllers/#toc_storing-application-properties">Storing Application Properties</a> part of the controllers introduction.</p>

<h2>Conclusion</h2>

<p>As a Rails developer it's becoming more and more necessary to have a solid grasp of at least one JavaScript framework. If you're looking into Ember.js this knowledge should ease your transition so that you can be more effective, right from the beginning.</p>
