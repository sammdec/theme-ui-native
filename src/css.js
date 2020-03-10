const defaultTheme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 72]
}

export const get = (obj, key, def, p, undef) => {
  const path = key && typeof key === "string" ? key.split(".") : [key]
  for (p = 0; p < path.length; p++) {
    obj = obj ? obj[path[p]] : undef
  }
  return obj === undef ? def : obj
}

const aliases = {
  bg: "backgroundColor",
  m: "margin",
  mt: "marginTop",
  mr: "marginRight",
  mb: "marginBottom",
  ml: "marginLeft",
  mx: "marginHorizontal",
  my: "marginVertical",
  marginX: "marginHorizontal",
  marginY: "marginVertical",
  p: "padding",
  pt: "paddingTop",
  pr: "paddingRight",
  pb: "paddingBottom",
  pl: "paddingLeft",
  px: "paddingHorizontal",
  py: "paddingVertical",
  paddingX: "paddingHorizontal",
  paddingY: "paddingVertical"
}

const multiples = {
  size: ["width", "height"]
}

export const scales = {
  width: "sizes",
  height: "sizes",
  bottom: "space",
  end: "space",
  left: "space",
  right: "space",
  start: "space",
  top: "space",
  minWidth: "sizes",
  maxWidth: "sizes",
  minHeight: "sizes",
  maxHeight: "sizes",
  margin: "space",
  marginTop: "space",
  marginRight: "space",
  marginBottom: "space",
  marginLeft: "space",
  marginStart: "space",
  marginEnd: "space",
  marginHorizontal: "space",
  marginVertical: "space",
  padding: "space",
  paddingTop: "space",
  paddingRight: "space",
  paddingBottom: "space",
  paddingLeft: "space",
  paddingStart: "space",
  paddingEnd: "space",
  paddingHorizontal: "space",
  paddingVertical: "space",
  paddingX: "space",
  paddingY: "space",
  borderWidth: "borderWidths",
  borderTopWidth: "borderWidths",
  borderRightWidth: "borderWidths",
  borderBottomWidth: "borderWidths",
  borderLeftWidth: "borderWidths",
  borderEndWidth: "borderWidths",
  borderStartWidth: "borderWidths",
  zIndex: "zIndices",
  shadowColor: "colors",
  backgroundColor: "colors",
  borderColor: "colors",
  borderBottomColor: "colors",
  borderEndColor: "colors",
  borderLeftColor: "colors",
  borderRightColor: "colors",
  borderStartColor: "colors",
  borderTopColor: "colors",
  borderRadius: "radii",
  borderBottomEndRadius: "radii",
  borderBottomLeftRadius: "radii",
  borderBottomRightRadius: "radii",
  borderBottomStartRadius: "radii",
  borderTopEndRadius: "radii",
  borderTopLeftRadius: "radii",
  borderTopRightRadius: "radii",
  borderTopStartRadius: "radii",
  color: "colors",
  fontFamily: "fonts",
  fontSize: "fontSizes",
  fontWeight: "fontWeights",
  textShadowColor: "colors",
  letterSpacing: "letterSpacings",
  lineHeight: "lineHeights",
  textDecorationColor: "colors",
  tintColor: "colors",
  overlayColor: "colors",
  flexBasis: "sizes",
  size: "sizes"
}

const positiveOrNegative = (scale, value) => {
  if (typeof value !== "number" || value >= 0) {
    return get(scale, value, value)
  }
  const absolute = Math.abs(value)
  const n = get(scale, absolute, absolute)
  if (typeof n === "string") return `-${n}`
  return Number(n) * -1
}

const transforms = [
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "marginStart",
  "marginEnd",
  "marginHorizontal",
  "marginVertical",
  "top",
  "bottom",
  "left",
  "right",
  "start",
  "end"
].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: positiveOrNegative
  }),
  {}
)

const maintainStringType = ["fontWeight"]

export const css = (props = {}) => (args = {}) => {
  const theme = {
    ...defaultTheme,
    ...("theme" in props ? props.theme : props)
  }
  let result = {}
  const styles = typeof args === "function" ? args(theme) : args

  for (const key in styles) {
    const x = styles[key]
    const val = typeof x === "function" ? x(theme) : x

    if (key === "variant") {
      const variant = css(theme)(get(theme, val))
      result = { ...result, ...variant }
      continue
    }

    if (val && typeof val === "object") {
      result[key] = css(theme)(val)
      continue
    }

    const prop = key in aliases ? aliases[key] : key

    if (
      !maintainStringType.includes(prop) &&
      typeof val === "string" &&
      !isNaN(val)
    ) {
      result[prop] = Number(val)
      continue
    }

    const scaleName = prop in scales ? scales[prop] : undefined
    const scale = get(theme, scaleName, get(theme, prop, {}))
    const transform = get(transforms, prop, get)
    const value = transform(scale, val, val)

    if (multiples[prop]) {
      const dirs = multiples[prop]
      for (let i = 0; i < dirs.length; i++) {
        result[dirs[i]] = value
      }
    } else {
      result[prop] = value
    }
  }

  return result
}
