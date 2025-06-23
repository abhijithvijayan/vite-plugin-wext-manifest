<h1 align="center">vite-plugin-wext-manifest</h1>
<p align="center">Vite Plugin for Webextension manifest</p>
<div align="center">
  <a href="https://www.npmjs.com/package/vite-plugin-wext-manifest">
    <img src="https://img.shields.io/npm/v/vite-plugin-wext-manifest" alt="NPM" />
  </a>
  <a href="https://travis-ci.com/abhijithvijayan/vite-plugin-wext-manifest">
    <img src="https://travis-ci.com/abhijithvijayan/vite-plugin-wext-manifest.svg?branch=main" alt="Travis Build" />
  </a>
  <a href="https://david-dm.org/abhijithvijayan/vite-plugin-wext-manifest">
    <img src="https://img.shields.io/david/abhijithvijayan/vite-plugin-wext-manifest.svg?colorB=orange" alt="DEPENDENCIES" />
  </a>
  <a href="https://github.com/abhijithvijayan/vite-plugin-wext-manifest/blob/main/license">
    <img src="https://img.shields.io/github/license/abhijithvijayan/vite-plugin-wext-manifest.svg" alt="LICENSE" />
  </a>
  <a href="https://twitter.com/intent/tweet?text=Check%20out%20vite-plugin-wext-manifest%21%20by%20%40_abhijithv%0A%0AVite%20Plugin%20for%20Webextension%20manifest%0Ahttps%3A%2F%2Fgithub.com%2Fabhijithvijayan%2Fvite-plugin-wext-manifest%0A%0A%23vite%20%23plugin%20%23manifest%20%23javascript%20%23webextensions%20">
     <img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social" alt="TWEET" />
  </a>
</div>
<h3 align="center">🙋‍♂️ Made by <a href="https://twitter.com/_abhijithv">@abhijithvijayan</a></h3>
<p align="center">
  Donate:
  <a href="https://www.paypal.me/iamabhijithvijayan" target='_blank'><i><b>PayPal</b></i></a>,
  <a href="https://www.patreon.com/abhijithvijayan" target='_blank'><i><b>Patreon</b></i></a>
</p>
<p align="center">
  <a href='https://www.buymeacoffee.com/abhijithvijayan' target='_blank'>
    <img height='36' style='border:0px;height:36px;' src='https://bmc-cdn.nyc3.digitaloceanspaces.com/BMC-button-images/custom_images/orange_img.png' border='0' alt='Buy Me a Coffee' />
  </a>
</p>
<hr />

Generate browser tailored `manifest.json` for Web Extensions that you specify properties to appear only in specific browsers.

❤️ it? ⭐️ it on [GitHub](https://github.com/abhijithvijayan/vite-plugin-wext-manifest/stargazers) or [Tweet](https://twitter.com/intent/tweet?text=Check%20out%20vite-plugin-wext-manifest%21%20by%20%40_abhijithv%0A%0AVite%20Plugin%20for%20Webextension%20manifest%0Ahttps%3A%2F%2Fgithub.com%2Fabhijithvijayan%2Fvite-plugin-wext-manifest%0A%0A%23vite%20%23plugin%20%23manifest%20%23javascript%20%23webextensions%20) about it.

## Table of Contents

- [Browser Support](#browser-support)
- [Installation](#installation)
- [Usage](#usage)
- [FAQs](#faqs)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
- [LICENSE](#license)

## Browser Support

| [![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)](/) | [![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)](/) | [![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)](/) | [![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)](/) |
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✔ | ✔ | ✔ | ✔ |

This loader will take a definition input for the manifest, and return you content for the specified browser.

### Looking for Web Extension starter

Checkout [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter) that uses this package

## Installation

Ensure you have [Node.js](https://nodejs.org) 10 or later installed. Then run the following:

```sh
# via npm
npm install --save-dev vite-plugin-wext-manifest

# or yarn
yarn add vite-plugin-wext-manifest --dev
```

## Usage

You can easily use this module to output the `manifest.json` as part of your build process with auto rebundling on file change.

**Note:** Make sure you pass a **TARGET_BROWSER** env variable with one of `chrome/firefox/edge/brave/opera/vivaldi/arc/yandex` value

#### Sample manifest with vendor prefixed keys

<https://github.com/abhijithvijayan/web-extension-starter/blob/react-typescript/source/manifest.json>

> **vite.config.ts**

```js
// ... other plugins
import vitePluginWextManifest from "./vite-plugin-wext-manifest";

export default defineConfig(({ mode }) => {
	const sourcePath = path.resolve(__dirname, "source");

	return {
		root: sourcePath,

		plugins: [
			vitePluginWextManifest({
				manifestPath: "manifest.json",
				usePackageJSONVersion: true,
			}),
			// ...
		],
	}
});
```

## Options

### `manifestPath`

Type: `String`

Path to the manifest.json to transform.

### `usePackageJSONVersion`

Type: `Boolean`
Default: `false`

If true, updates manifest.json `version` field with `package.json` version. It is often useful for easy release of web-extension.

<hr />

## FAQs

### 1.What are vendor prefixed manifest keys

Vendor prefixed manifest keys allow you to write one `manifest.json` for multiple vendors.

```js
{
  "__chrome__name": "AwesomeChrome",
  "__firefox__name": "AwesomeFirefox",
  "__edge__name": "AwesomeEdge",
  "__opera__name": "AwesomeOpera"
}
```

if the **TARGET_BROWSER** is `chrome` this compiles to:

```js
{
  "name": "AwesomeChrome",
}
```

---

Add keys to multiple vendors by seperating them with `|` in the prefix

```
{
  __chrome|opera__name: "AwesomeExtension"
}
```

if the vendor is `chrome` or `opera`, this compiles to:

```
{
  "name": "AwesomeExtension"
}
```

### 2. How can I conditionally set keys based on environment

```js
{
  "__dev__name": "NameInDevelopment",
  "__prod__name": "NameInProduction",
  "__chrome|firefox|dev__description": "DescriptionInDevelopmentForSetOfBrowsers",
  "__chrome|firefox|prod__description": "DescriptionInProductionForSetOfBrowsers"
}
```

if the **NODE_ENV** is `production` and the **TARGET_BROWSER** is `chrome` this compiles to:

```js
{
  "name": "NameInProduction",
  "description": "DescriptionInProductionForSetOfBrowsers"
}
```

else

```js
{
  "name": "NameInDevelopment",
  "description": "DescriptionInDevelopmentForSetOfBrowsers"
}
```

## Issues

_Looking to contribute? Look for the [Good First Issue](https://github.com/abhijithvijayan/vite-plugin-wext-manifest/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22good+first+issue%22)
label._

### 🐛 Bugs

Please file an issue [here](https://github.com/abhijithvijayan/vite-plugin-wext-manifest/issues/new) for bugs, missing documentation, or unexpected behavior.

[**See Bugs**](https://github.com/abhijithvijayan/vite-plugin-wext-manifest/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22type%3A+bug%22)

### Linting & TypeScript Config

- Shared Eslint & Prettier Configuration - [`@abhijithvijayan/eslint-config`](https://www.npmjs.com/package/@abhijithvijayan/eslint-config)
- Shared TypeScript Configuration - [`@abhijithvijayan/tsconfig`](https://www.npmjs.com/package/@abhijithvijayan/tsconfig)

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)
