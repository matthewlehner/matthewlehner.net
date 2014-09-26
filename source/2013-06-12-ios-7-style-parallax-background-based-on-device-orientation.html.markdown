---
title: iOS 7 Parallax Backgrounds with JavaScript and CSS
meta_description: "use the deviceorientation event in mobile browsers to reproduce the parallax background effect introduced in ios 7 with javascript and css."
---
The unveiling of iOS 7 has brought a lot of focus onto whether or not the design direction that Apple has chosen to take has been the right path. In this article we're focusing on reproducing the parallax background effect used to 'create a whole new experience of depth' (as Jony Ive puts it). The effect is demonstrated in the <a href="http://www.apple.com/ios/ios7/#video" target="_blank">iOS 7 video</a> at the 2:45 mark. When you tilt your iOS device, the background moves slightly while the foreground elements stay fixed. This creates an effect which separates the two plains and gives a slight illusion of three dimensions.

<a href="http://matthewlehner.net/wp-content/uploads/2013/06/ku-xlarge.gif"><img class="aligncenter  wp-image-29" alt="iOS 7 Background Parallax" src="http://matthewlehner.net/wp-content/uploads/2013/06/ku-xlarge.gif" width="640" height="360" /></a>

To reproduce this in a web browser, we're required to tap into the device's gyroscopes and accelerometers through the ```deviceorientation``` event. Luckily, modern browsers have enabled this API. On mobile platforms, this will be available in the following versions browsers: Safari 4.2 and  Android Browser 3 (or greater.) On the desktop, only Chrome and Firefox support it. For simplicity, this demo only supports webkit browsers (Safari, Chrome, Android) as the implementation is currently different in FireFox.

<h2>The &#96;deviceorientation&#96; Event</h2>

To get information about how the device is positioned in space, we need to watch the &#96;deviceorientation&#96; event. This event will return values which will tell you how far the device is leaning and which way it is pointed, if the device has a compass. The returned values are: beta, the side-to-side value, gamma, the front-to-back value, and alpha, the compass direction. A basic example of listening to the &#96;deviceorientation&#96; data is as follows:

```
#!javascript
window.addEventListener('deviceorientation', function(eventData) {
  // The compass direction - will return a value between 0 and 360
  eventData.alpha

  // Side to side value - will return a value between -180 and 180
  eventData.beta

  // Front to back value - will return a value between -90 and 90
  eventData.gamma
});
```

Using this data, we will move the background around to create the same effect as in iOS7. First, we need to set up a container with the background that is the same size as the device. In this example, we're using an iPhone 5

<h3>HTML</h3>

```
#!xml
<div id='background'>
  <div id='foreground'>
    Content for the foreground
  </div>
</div>
```

<h3>CSS</h3>

We're using a non-repeating background asset from iOS7. The important thing here is to make the actual background image larger than its container, and then we manually center it with the 'background-size' and 'background-position' attributes. With a repeating background, this step can be skipped.

```
#!css
#background {
  margin: 0 auto;
  padding-top: 100px;
  height: 568px;
  width: 320px;
  background-image: url('background.png');
  background-size: 360px 608px;
  background-position: -20px -20px;
}

#foreground {
  text-align: center;
  padding: 20px;
  background: rgba(255,255,255,0.2);
  border-radius: 18px;
}
```

<h3>Finally, the JavaScript</h3>

```
var background = document.getElementByID('background');

window.addEventListener('deviceorientation', function(eventData) {
  // Retrieving the front/back tilting of the device and moves the
  // background in the opposite way of the tilt

  var yTilt = Math.round((-eventData.beta + 90) * (40/180) - 40);

  // Retrieve the side to side tilting of the device and move the
  // background the opposite direction.

  var xTilt = Math.round(-eventData.gamma * (20/180) - 20);

  // Thi 'if' statement checks if the phone is upside down and corrects
  // the value that is returned.
  if (xTilt &amp;gt; 0) {
    xTilt = -xTilt;
  } else if (xTilt &amp;lt; -40) {
    xTilt = -(xTilt + 80);
  }

  var backgroundPositionValue = yTilt + 'px ' + xtilt + "px";

  background.style.backgroundPosition = backgroundPositionValue;
}, false);
```

A working demo is available <a href="http://cedar.io/ios7-parallax">here</a> - it's best viewed on an iOS device, but will work on Android as well. Tip your device around to see the effect (it's a bit subtle).

<h2>A Working iOS 7 Parallax Style Background</h2>

While performing this test, I noticed that Android devices return strange values when turned from side to side, going from 0° to 270° in when turning over to the right and 0° to -90° and jumping to 270° when turning over to the left. Don't ask me why this is a thing that happens, it's flabbergasting even to me.

<h2>Further resources</h2>

* HTML5 Rocks - <a href="http://www.html5rocks.com/en/tutorials/device/orientation/">This End Up: Using Device Orientation</a>
* caniuse - <a href="http://caniuse.com/#feat=deviceorientation">deviceorientation</a>
* W3 - <a href="http://www.w3.org/TR/orientation-event/">DeviceOrientation Event Specification</a>
