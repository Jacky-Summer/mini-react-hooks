import React from 'react'

const Child1 = ({ data }) => {
  console.log('Child1组件被渲染了')
  return (
    <div>
      <h3>useMemo - Child1 组件的data：{data.number}</h3>
    </div>
  )
}

export default React.memo(Child1)
