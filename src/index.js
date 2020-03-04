import { createContext, createElement, useContext } from "react"
import { css } from "./css"

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

const getStyles = (props, theme) => {
  if (!props.sx && !props.style) return undefined
  const styles = typeof props.sx === "function" ? props.sx(theme) : props.sx
  const parsedStyles = css(styles, theme)
  const raw = props.style
  return { ...parsedStyles, ...raw }

}

const parseProps = (props, theme) => {
  if (!props) return null
  const next = {}
  for (let key in props) {
    if (key === "sx") continue
    next[key] = props[key]
  }

  const styles = getStyles(props, theme)
  if (styles) next.style = styles
  return next
}

const hasStyles = obj => Object.getOwnPropertyNames(obj).length > 0

export const ThemeProvider = ({ theme, children }) =>
  createElement(ThemeContext.Provider, { value: theme }, children)

export const jsx = (type, props, ...children) => {
  return createElement(ThemeContext.Consumer, {}, theme => {
    return createElement(type, { ...parseProps(props, theme) }, ...children)
  })
}

export const styled = (type, style) => props => {
  const theme = useTheme()
  const styles =
    typeof style === "function" ? style({ ...props, theme }) : style
  const sx = { ...styles, ...props.sx }
  const mergedProps = { ...props, ...(hasStyles(sx) && { sx }) }

  const parsedProps = parseProps(mergedProps, theme)

  return createElement(type, parsedProps)
}
