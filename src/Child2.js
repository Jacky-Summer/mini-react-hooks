import React from 'react'
import ThemeContext from './context'

/**
 * useContext 实现
 */
const useContext = context => {
  return context._currentValue
}

const Child2 = () => {
  const themeContext = useContext(ThemeContext)
  return <div>获取到的 context：{themeContext}</div>
}

export default Child2
