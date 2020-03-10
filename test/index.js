import React from "react"
import { Text } from "react-native"
import { render } from "@testing-library/react-native"
import { toHaveStyle, toHaveProp } from "@testing-library/jest-native"
import { ThemeProvider, useTheme, jsx, styled, sx } from "../src"

expect.extend({ toHaveStyle, toHaveProp })

describe("ThemeProvider", () => {
  test("renders", () => {
    const { container } = render(
      <ThemeProvider>
        <Text>Hello</Text>
      </ThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

describe("useTheme", () => {
  test("returns theme context", () => {
    let context
    const GetContext = () => {
      context = useTheme()
      return false
    }
    render(
      <ThemeProvider
        theme={{
          colors: {
            text: "tomato"
          }
        }}
      >
        <GetContext />
      </ThemeProvider>
    )

    expect(context).toBeTruthy()
    expect(context.theme.colors.text).toBe("tomato")
  })

  test("returns sx function", () => {
    let context
    const GetContext = () => {
      context = useTheme()
      return false
    }
    render(
      <ThemeProvider
        theme={{
          colors: {
            text: "tomato"
          }
        }}
      >
        <GetContext />
      </ThemeProvider>
    )

    expect(context).toBeTruthy()
    expect(context.sx).toBeInstanceOf(Function)
  })
})

describe("jsx", () => {
  test("custom pragma adds styles", () => {
    const { getByTestId } = render(
      jsx(Text, {
        sx: { marginHorizontal: 2, fontSize: 2, color: "red" },
        testID: "test"
      })
    )

    expect(getByTestId("test")).toHaveStyle({
      marginHorizontal: 8
    })
    expect(getByTestId("test")).toHaveStyle({
      fontSize: 16
    })
    expect(getByTestId("test")).toHaveStyle({
      color: "red"
    })
  })

  test("custom pragma handles null props", () => {
    const json = render(jsx(Text, null, "hello"))
    expect(json).toMatchSnapshot()
  })

  test("removes sx prop", () => {
    const { getByTestId } = render(
      jsx(Text, {
        sx: { marginHorizontal: 2, fontSize: 2, color: "red" },
        testID: "test"
      })
    )
    expect(getByTestId("test")).not.toHaveProp("sx")
  })

  test("adds raw values from style prop", () => {
    const { getByTestId } = render(
      jsx(Text, {
        style: { marginHorizontal: 2 },
        testID: "test"
      })
    )

    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 2 })
  })

  test("sx prop can accept a function", () => {
    const { getByTestId } = render(
      jsx(
        ThemeProvider,
        {
          theme: {
            colors: {
              primary: "tomato"
            }
          }
        },
        jsx(Text, {
          sx: t => ({ color: t.colors.primary }),
          testID: "test"
        })
      )
    )
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" })
  })

  test("sx and style prop can be used together", () => {
    const { getByTestId } = render(
      jsx(Text, {
        style: {
          margin: 0
        },
        sx: {
          backgroundColor: "tomato"
        },
        testID: "test"
      })
    )
    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "tomato" })
    expect(getByTestId("test")).toHaveStyle({ margin: 0 })
  })

  test("sx prop supports dot notation", () => {
    const { getByTestId } = render(
      jsx(
        ThemeProvider,
        {
          theme: {
            colors: {
              text: "black",
              base: {
                blue: ["#07c"],
                primary: "cyan"
              }
            }
          }
        },
        jsx(Text, {
          sx: {
            color: "base.blue.0",
            backgroundColor: "base.primary"
          },
          testID: "test"
        })
      )
    )
    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "cyan" })
    expect(getByTestId("test")).toHaveStyle({ color: "#07c" })
  })

  test("does not add style prop when not provided", () => {
    const { getByTestId } = render(jsx(Text, { testID: "test" }, "hi"))
    expect(getByTestId("test")).not.toHaveProp("style")
  })
})

describe("styled", () => {
  test("does not add style prop when not provided", () => {
    const Test = styled(Text)
    const { getByTestId } = render(<Test testID="test" />)

    expect(getByTestId("test")).not.toHaveProp("style")
  })

  test("works when no styles are added", () => {
    const Test = styled(Text, {})
    const { container } = render(<Test />)
    expect(container).toMatchSnapshot()
  })

  test("adds styles when using function call argument", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] }
    const Test = styled(Text, {
      marginHorizontal: 2,
      color: "tomato",
      backgroundColor: "primary"
    })

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test testID="test" />
      </ThemeProvider>
    )

    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "#07c" })
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" })
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 16 })
  })

  test("adds styles when using sx prop", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] }
    const Test = styled(Text)

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test
          testID="test"
          sx={{
            marginHorizontal: 2,
            color: "tomato",
            backgroundColor: "primary"
          }}
        />
      </ThemeProvider>
    )

    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "#07c" })
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" })
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 16 })
  })

  test("styles passed in through sx prop override argument styles", () => {
    const Test = styled(Text, { marginHorizontal: 16, color: "red" })
    const { getByTestId } = render(
      <Test sx={{ marginHorizontal: 20 }} testID="test" />
    )
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 20 })
    expect(getByTestId("test")).toHaveStyle({ color: "red" })
  })

  test("works with style prop, sx prop and argument styles", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] }
    const Test = styled(Text, { marginHorizontal: 0, color: "red" })
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test
          style={{ marginHorizontal: 30 }}
          sx={{ marginHorizontal: 2, color: "primary" }}
          testID="test"
        />
      </ThemeProvider>
    )
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 30 })
    expect(getByTestId("test")).toHaveStyle({ color: "#07c" })
  })
})

describe("sx", () => {
  test("adds style object to component", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] }

    const Test = () => {
      const { sx } = useTheme()
      return (
        <Text
          testID="test"
          style={sx({
            marginHorizontal: 2,
            color: "tomato",
            backgroundColor: "primary"
          })}
        />
      )
    }

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test />
      </ThemeProvider>
    )

    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "#07c" })
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" })
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 16 })
  })
})
