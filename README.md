# Changes from the [create-react-app typescript template](https://www.npmjs.com/package/cra-template-typescript)

## [emotion](https://emotion.sh/docs/introduction)

Added `@emotion/react` as a dependency.

For being able to use the emotion `css` prop, the babel config needs to be altered.
Thats why the project is using `react-app-rewired` and `customize-cra` as dependencies to be able to alter the webpack config via [config-overrides.js](/config-overrides.js) without ejecting the app.

## usage info

Simply change the apps name in [package.json](/package.json) and you are ready to go.

Before deployment, replace the CRA placeholders, namely [favicon.ico](/public/favicon.ico), [logo192.png](/public/logo192.png), [logo512.png](/public/logo512.png), [manifest.json](/public/manifest.json), [robots.txt](/public/robots.txt) with your own versions.
