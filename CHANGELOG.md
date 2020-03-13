# theme-ui-native

## 1.0.0

### Major Changes

- cbeaf46: `useTheme` hook now returns an object that contains the `theme` object and the `sx` function

  `sx` this function is returned from the `useTheme` hook and allows a user to add theme aware styles to a component without having to use `styled` or the `jsx` pragma. See README for more details.

  #### What

  The `useTheme` hook previously returned the theme object it now returns an object that contains `theme` prop and the `sx` prop

  #### Why

  We moved to an object as it allows for future features to be added into the `useTheme` hook without breaking changes

  #### How

  Previously you would access the theme object like so

  ```js
  const theme = useTheme()
  ```

  You will now need to access it like so

  ```js
  const { theme } = useTheme()
  ```
