import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { toHaveStyle, toHaveProp } from "@testing-library/jest-native";
import { ThemeProvider, useTheme, jsx, styled, css } from "../src";

expect.extend({ toHaveStyle, toHaveProp });

const theme = {
  colors: {
    primary: "tomato",
    secondary: "cyan",
    background: "white",
    text: "black"
  },
  fontSizes: [12, 14, 16, 24, 36],
  fonts: {
    monospace: "Menlo, monospace"
  },
  lineHeights: {
    body: 1.5
  },
  fontWeights: {
    bold: "600"
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    small: 4,
    medium: 8,
    large: 16,
    sidebar: 320
  },
  buttons: {
    primary: {
      p: 3,
      fontWeight: "bold",
      color: "white",
      bg: "primary",
      borderRadius: 2
    }
  },
  text: {
    caps: {
      fontSize: [1, 2],
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    },
    title: {
      fontSize: [3, 4],
      letterSpacing: ["-0.01em", "-0.02em"]
    }
  },
  borderWidths: {
    thin: 1
  },
  radii: {
    small: 5
  }
};

describe("ThemeProvider", () => {
  test("renders", () => {
    const { container } = render(
      <ThemeProvider>
        <Text>Hello</Text>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});

describe("useTheme", () => {
  test("returns theme context", () => {
    let context;
    const GetContext = () => {
      context = useTheme();
      return false;
    };
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
    );

    expect(context).toBeTruthy();
    expect(context.colors.text).toBe("tomato");
  });
});

describe("jsx", () => {
  test("custom pragma adds styles", () => {
    const { getByTestId } = render(
      jsx(Text, {
        sx: { marginHorizontal: 2, fontSize: 2, color: "red" },
        testID: "test"
      })
    );

    expect(getByTestId("test")).toHaveStyle({
      marginHorizontal: 8
    });
    expect(getByTestId("test")).toHaveStyle({
      fontSize: 16
    });
    expect(getByTestId("test")).toHaveStyle({
      color: "red"
    });
  });

  test("custom pragma handles null props", () => {
    const json = render(jsx(Text, null, "hello"));
    expect(json).toMatchSnapshot();
  });

  test("removes sx prop", () => {
    const { getByTestId } = render(
      jsx(Text, {
        sx: { marginHorizontal: 2, fontSize: 2, color: "red" },
        testID: "test"
      })
    );
    expect(getByTestId("test")).not.toHaveProp("sx");
  });

  test("adds raw values from style prop", () => {
    const { getByTestId } = render(
      jsx(Text, {
        style: { marginHorizontal: 2 },
        testID: "test"
      })
    );

    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 2 });
  });

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
    );
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" });
  });

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
    );
    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "tomato" });
    expect(getByTestId("test")).toHaveStyle({ margin: 0 });
  });

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
    );
    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "cyan" });
    expect(getByTestId("test")).toHaveStyle({ color: "#07c" });
  });

  test("does not add style prop when not provided", () => {
    const { getByTestId } = render(jsx(Text, { testID: "test" }, "hi"));
    expect(getByTestId("test")).not.toHaveProp("style");
  });
});

describe("styled", () => {
  test("does not add style prop when not provided", () => {
    const Test = styled(Text);
    const { getByTestId } = render(<Test testID="test" />);

    expect(getByTestId("test")).not.toHaveProp("style");
  });

  test("works when no styles are added", () => {
    const Test = styled(Text, {});
    const { container } = render(<Test />);
    expect(container).toMatchSnapshot();
  });

  test("adds styles when using function call argument", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] };
    const Test = styled(Text, {
      marginHorizontal: 2,
      color: "tomato",
      backgroundColor: "primary"
    });

    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test testID="test" />
      </ThemeProvider>
    );

    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "#07c" });
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" });
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 16 });
  });

  test("adds styles when using sx prop", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] };
    const Test = styled(Text);

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
    );

    expect(getByTestId("test")).toHaveStyle({ backgroundColor: "#07c" });
    expect(getByTestId("test")).toHaveStyle({ color: "tomato" });
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 16 });
  });

  test("styles passed in through sx prop override argument styles", () => {
    const Test = styled(Text, { marginHorizontal: 16, color: "red" });
    const { getByTestId } = render(
      <Test sx={{ marginHorizontal: 20 }} testID="test" />
    );
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 20 });
    expect(getByTestId("test")).toHaveStyle({ color: "red" });
  });

  test("works with style prop, sx prop and argument styles", () => {
    const theme = { colors: { primary: "#07c" }, space: [0, 8, 16] };
    const Test = styled(Text, { marginHorizontal: 0, color: "red" });
    const { getByTestId } = render(
      <ThemeProvider theme={theme}>
        <Test
          style={{ marginHorizontal: 30 }}
          sx={{ marginHorizontal: 2, color: "primary" }}
          testID="test"
        />
      </ThemeProvider>
    );
    expect(getByTestId("test")).toHaveStyle({ marginHorizontal: 30 });
    expect(getByTestId("test")).toHaveStyle({ color: "#07c" });
  });
});

describe("css", () => {
  test("returns an object", () => {
    const result = css();
    expect(typeof result).toBe("object");
  });

  test("returns styles", () => {
    const result = css({
      fontSize: 32,
      color: "blue",
      borderRadius: 4
    });
    expect(result).toEqual({
      fontSize: 32,
      color: "blue",
      borderRadius: 4
    });
  });

  test("handles all core styled system props", () => {
    const result = css(
      {
        m: 0,
        mb: 2,
        mx: "auto",
        p: 3,
        py: 4,
        fontSize: 3,
        fontWeight: "bold",
        color: "primary",
        bg: "secondary",
        fontFamily: "monospace",
        lineHeight: "body"
      },
      { theme }
    );
    expect(result).toEqual({
      margin: 0,
      marginBottom: 8,
      marginHorizontal: "auto",
      padding: 16,
      paddingVertical: 32,
      color: "tomato",
      backgroundColor: "cyan",
      fontFamily: "Menlo, monospace",
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 1.5
    });
  });

  test("works with functional arguments", () => {
    const result = css(
      t => ({
        color: t.colors.primary
      }),
      { theme }
    );
    expect(result).toEqual({
      color: "tomato"
    });
  });

  test("supports functional values", () => {
    const result = css(
      {
        color: t => t.colors.primary
      },
      { theme }
    );
    expect(result).toEqual({
      color: "tomato"
    });
  });

  test("returns variants from theme", () => {
    const result = css(
      {
        variant: "buttons.primary"
      },
      theme
    );
    expect(result).toEqual({
      padding: 16,
      fontWeight: "600",
      color: "white",
      backgroundColor: "tomato",
      borderRadius: 2
    });
  });

  test("handles negative margins from scale", () => {
    const result = css(
      {
        mt: -3,
        mx: -4
      },
      theme
    );
    expect(result).toEqual({
      marginTop: -16,
      marginHorizontal: -32
    });
  });

  test("handles negative top, left, bottom, and right from scale", () => {
    const result = css(
      {
        top: -1,
        right: -4,
        bottom: -3,
        left: -2
      },
      theme
    );
    expect(result).toEqual({
      top: -4,
      right: -32,
      bottom: -16,
      left: -8
    });
  });

  test("multiples are transformed", () => {
    const style = css(
      {
        marginX: 2,
        marginY: 2,
        paddingX: 2,
        paddingY: 2,
        size: "large"
      },
      theme
    );
    expect(style).toEqual({
      marginHorizontal: 8,
      marginVertical: 8,
      paddingHorizontal: 8,
      paddingVertical: 8,
      width: 16,
      height: 16
    });
  });

  test("returns individual border styles", () => {
    const result = css(
      {
        borderTopWidth: "thin",
        borderTopColor: "primary",
        borderTopLeftRadius: "small",
        borderTopRightRadius: "small",
        borderTopStartRadius: "small",
        borderTopEndRadius: "small",
        borderBottomWidth: "thin",
        borderBottomColor: "primary",
        borderBottomLeftRadius: "small",
        borderBottomRightRadius: "small",
        borderBottomStartRadius: "small",
        borderBottomEndRadius: "small",
        borderRightWidth: "thin",
        borderRightColor: "primary",
        borderLeftWidth: "thin",
        borderLeftColor: "primary"
      },
      theme
    );
    expect(result).toEqual({
      borderTopColor: "tomato",
      borderTopWidth: 1,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      borderTopStartRadius: 5,
      borderTopEndRadius: 5,
      borderBottomColor: "tomato",
      borderBottomWidth: 1,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderBottomStartRadius: 5,
      borderBottomEndRadius: 5,
      borderRightColor: "tomato",
      borderRightWidth: 1,
      borderLeftColor: "tomato",
      borderLeftWidth: 1
    });
  });

  test("flexBasis uses theme.sizes", () => {
    const style = css(
      {
        flexBasis: "sidebar"
      },
      theme
    );
    expect(style).toEqual({
      flexBasis: 320
    });
  });

  test("string values are passed as raw value numbers", () => {
    const style = css(
      {
        fontSize: "2",
        marginX: "auto",
        marginY: "4",
        margin: "4",
        paddingX: "2",
        paddingY: "2",
        padding: "2",
        borderTopWidth: "2",
        fontWeight: "600"
      },
      theme
    );

    expect(style).toEqual({
      fontSize: 2,
      marginHorizontal: "auto",
      marginVertical: 4,
      margin: 4,
      paddingHorizontal: 2,
      paddingVertical: 2,
      padding: 2,
      borderTopWidth: 2,
      fontWeight: "600"
    });
  });
});
