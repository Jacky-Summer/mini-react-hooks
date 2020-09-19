import React from 'react'

const Child = ({ count1, handleCallback }) => {
  console.log('Child组件被渲染了')
  return (
    <div>
      <h3>useCallback - {count1}</h3>
      <button onClick={handleCallback}>执行回调</button>
    </div>
  )
}

export default React.memo(Child)
