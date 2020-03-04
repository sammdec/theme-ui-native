<img
  src="https://contrast.now.sh/fff/000?size=200&fontSize=2&baseline=2&fontWeight=900&radius=32&text=UIN"
  width="96"
  heigh="96"
/>

# Theme UI Native

Build consistent, theme-able React Native apps based on constraint-based design principles | Built with the principles from [Theme UI](https://theme-ui.com)

[![GitHub][github-badge]][github]
[![Build Status][github-actions-badge]][github-actions]
[![Version][version]][npm]
![MIT License][license]
[![system-ui/theme][system-ui-badge]](https://system-ui.com/theme)
![][size]

[github]: https://github.com/samjbmason/theme-ui-native
[github-badge]: https://badgen.net/badge/-/github?icon=github&label
[github-actions]: https://github.com/samjbmason/theme-ui-native/actions
[github-actions-badge]: https://github.com/samjbmason/theme-ui-native/workflows/Run%20CI/badge.svg
[version]: https://badgen.net/npm/v/theme-ui-native
[npm]: https://npmjs.com/package/theme-ui-native
[license]: https://badgen.net/badge/license/MIT/blue
[system-ui-badge]: https://badgen.net/badge/system-ui/theme/black
[size]: https://badgen.net/bundlephobia/minzip/theme-ui-native

Built for design systems, white-labels, themes, and other applications where customizing colors, typography, and layout are treated as first-class citizens and based on a standard [Theme Specification](https://system-ui.com/theme), Theme UI Native is intended to work in a variety of applications, libraries, and other UI components. Colors, typography, and layout styles derived from customizable theme-based design scales help you build UI rooted in constraint-based design principles.

- [Getting started](#getting-started)
- [Differences between Theme UI & Theme UI Native](#differences-between-theme-ui-and-theme-ui-native)
- [API](#api)

## Getting started

```bash
npm install theme-ui-native
```

Any styles in your app can reference values from the global theme object. To provide the theme in context, wrap your application with the ThemeProvider component and pass in a custom theme object.

```jsx
// basic usage
import React from "react"
import { ThemeProvider } from "theme-ui-native"
import theme from "./theme"

export default props => (
  <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
)
```

The theme object follows the System UI [Theme Specification](https://system-ui.com/theme), which lets you define custom color palettes, typographic scales, fonts, and more. Read more about [theming](https://theme-ui.com/theming/).

```jsx
// example theme.js
export default {
  fonts: {
    body: "Avenir Next",
    monospace: "Menlo, monospace"
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#33e"
  }
}
```

## `sx` prop

The `sx` prop works similarly to Theme UI's `sx` prop, accepting style objects to add styles directly to an element in JSX, with theme-aware functionality. Using the `sx` prop for styles means that certain properties can reference values defined in your theme object. This is intended to make keeping styles consistent throughout your app the easy thing to do.

The `sx` prop only works in modules that have defined a custom pragma at the top of the file, which replaces the default `React.createElement` function. This means you can control which modules in your application opt into this feature without the need for a Babel plugin or additional configuration.

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui-native"
import { Text } from "react-native"

export default props => (
  <Text
    sx={{
      fontWeight: "bold",
      fontSize: 4, // picks up value from `theme.fontSizes[4]`
      color: "primary" // picks up value from `theme.colors.primary`
    }}
  >
    Hello
  </Text>
)
```

## `styled` function

The `styled` function works similarly to Emotion's `styled` function, the first argument accepts a React component and the second argument accepts a style object that adds theme aware style properties to the `style` prop. The function returns a React component that can be used as normal within your application.

```jsx
import React from "react"
import { Text } from "react-native"
import { styled } from "theme-ui-native"

const Headline = styled(Text, {
  marginY: 2, // picks up value from `theme.space[2]`
  color: "primary" // picks up value from `theme.color.primary`
})

export default () => <Headline>Hello</Headline>
```

Components that are created with the styled function get the added ability of being able to use the `sx` prop. This allows you to set default styles and then override at each call site with theme aware values.

```jsx
import React from "react"
import { Text } from "react-native"
import { styled } from "theme-ui-native"

const Headline = styled(Text, {
  marginY: 2,
  color: "primary"
})

export default () => (
  <>
    <Headline>Hello</Headline> {/* output will use color `primary` */}
    <Headline
      sx={{
        color: "secondary" // output will use color `secondary`
      }}
    >
      Hello
    </Headline>
  </>
)
```

You can use a function as the second argument in `styled`, this function has access to all the props of the component and the theme object. This enables you to change values dynamically based on props.

```jsx
import React from "react"
import { Text } from "react-native"
import { styled } from "theme-ui-native"

const Headline = styled(Text, ({ isEnabled, theme }) => ({
  color: isEnabled ? "primary" : "secondary"
}))

export default () => <Headline isEnabled={true}>Hello</Headline>
```

## Raw values

If you would like to not use a theme value and instead use a literal value, you can pass the value as a string. The raw value is converted into a number so that it is compatible with React Natives style API.

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui-native"
import { Text } from "react-native"

export default props => (
  <Text
    sx={{
      marginY: "2", // uses the raw value `2`
      marginX: 2 // picks up value from `theme.space[2]`
    }}
  >
    Hello
  </Text>
)
```

You can also use raw values by using the `style` prop as usual. These styles will take precedence over any styles created with the `sx` prop.

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui-native"
import { Text } from "react-native"

export default props => (
  <Text
    sx={{
      color: 'primary'
      marginX: 2 // picks up value from `theme.space[2]`
    }}
    style={{color: '#000'}}
  >
    Hello
  </Text>
)
// Final output will be
// {color: '#000', marginX: 2}
```

## Differences between Theme UI and Theme UI Native

### Responsive styles

If you are coming from using Theme UI for web applications you are probably familiar with using arrays as values to change properties responsively based on breakpoints. This API isn't included Theme UI Native as there is currently no concept of responsive breakpoints within the React Native ecosystem.

### Body styles

There is no concept of the global styles within React Native and so this functionality is not available within Theme UI Native.

### MDX content

We haven't ported over MDX styling at this time as it seems unlikely to be used within the React Native context

### Color modes

We currently don't support color modes but are very open to the integrating them in future versions, feel free to raise a issue or PR if you have ideas on how to implement this.

## API

### `jsx`

The `jsx` export is a React create element function intended for use with a custom pragma comment. It adds support for the `sx` prop, which parses style objects with the Theme UI Native `css` utility.

```jsx
/** @jsx jsx */
import { jsx } from "theme-ui-native"
import { Text } from "react-native"

export default props => (
  <Text
    {...props}
    sx={{
      color: "primary"
    }}
  ></Text>
)
```

### `ThemeProvider`

The `ThemeProvider` provides context to components that use the `sx` prop.

| Prop       | Type   | Description            |
| ---------- | ------ | ---------------------- |
| `theme`    | Object | Theming context object |
| `children` | Node   | React children         |

### `useTheme`

The `useTheme` hook returns the full Theme UI Native context object, which includes the theme.

```js
const theme = useTheme()
```

### `styled`

The `styled` function allows you to create components that can be styled using theme aware styles. The newly created components also have access to the `sx` prop, which allows for per call site theme aware style overrides.

The first argument expects a react component, the second argument expects either a object containing styles or a function that returns a style object. If a function is used the props and theme are passed as the functions argument as an object.

```js
import { Text } from "react-native"

const Heading = styled(Text, { color: "primary" })

const Box = styled(View, ({ theme, ...props }) => ({
  color: theme.colors.primary
}))
```

MIT License
