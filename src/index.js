import React from 'react'
import ReactDOM from 'react-dom'
import Child from './Child'
import Child1 from './Child1'
import Child2 from './Child2'
import ThemeContext from './context'

let memorizedState = [] // 存放 hook
let index = 0 // hook 数组下标位置
/**
 * useState 实现
 */
const useState = initialState => {
  let currentIndex = index
  memorizedState[currentIndex] = memorizedState[index] || initialState
  const setState = newState => {
    memorizedState[currentIndex] = newState
    render() // setState 之后触发重新渲染
  }
  return [memorizedState[index++], setState]
}

/**
 * useReducer 实现
 */
let reducerState

const useReducer = (reducer, initialArg, init) => {
  let initialState
  if (init !== undefined) {
    initialState = init(initialArg)
  } else {
    initialState = initialArg
  }

  const dispatch = action => {
    reducerState = reducer(reducerState, action)
    render()
  }
  reducerState = reducerState || initialState
  return [reducerState, dispatch]
}

const init = initialNum => {
  return { num: initialNum }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { num: state.num + 1 }
    case 'decrement':
      return { num: state.num - 1 }
    default:
      throw new Error()
  }
}

/**
 * useEffect 实现
 */
const useEffect = (callback, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let lastDependencies = memorizedState[index] // 依赖项数组
    // 循环遍历依赖项是否与上次的值相同
    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    )
    if (hasChanged) {
      // 依赖项有改变就执行 callback 函数
      memorizedState[index++] = dependencies
      setTimeout(callback)
    } else {
      index++ // 每个hook占据一个下标位置，防止顺序错乱
    }
  } else {
    // 第一次执行
    memorizedState[index++] = dependencies
    setTimeout(callback)
  }
}

/**
 * useLayoutEffect 实现
 */
const useLayoutEffect = (callback, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let lastDependencies = memorizedState[index] // 依赖项数组
    // 循环遍历依赖项是否与上次的值相同
    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    )
    if (hasChanged) {
      // 依赖项有改变就执行 callback 函数
      memorizedState[index++] = dependencies
      Promise.resolve().then(callback)
    } else {
      index++ // 每个hook占据一个下标位置，防止顺序错乱
    }
  } else {
    // 第一次执行
    memorizedState[index++] = dependencies
    Promise.resolve().then(callback)
  }
}

/**
 * useCallback 实现
 */
const useCallback = (callback, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let [lastCallback, lastDependencies] = memorizedState[index]

    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    )
    if (hasChanged) {
      memorizedState[index++] = [callback, dependencies]
      return callback
    } else {
      index++
      return lastCallback
    }
  } else {
    // 第一次执行
    memorizedState[index++] = [callback, dependencies]
    return callback
  }
}

/**
 * useMemo 实现
 */
const useMemo = (memoFn, dependencies) => {
  if (memorizedState[index]) {
    // 不是第一次执行
    let [lastMemo, lastDependencies] = memorizedState[index]

    let hasChanged = !dependencies.every(
      (item, index) => item === lastDependencies[index]
    )
    if (hasChanged) {
      memorizedState[index++] = [memoFn(), dependencies]
      return memoFn()
    } else {
      index++
      return lastMemo
    }
  } else {
    // 第一次执行
    memorizedState[index++] = [memoFn(), dependencies]
    return memoFn()
  }
}

/**
 * useRef 实现
 */
let lastRef
const useRef = value => {
  lastRef = lastRef || { current: value }
  return lastRef
}

const App = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(10)

  const [state, dispatch] = useReducer(reducer, 20, init)

  const inputEl = useRef(null)

  useEffect(() => {
    console.log('useEffect1')
  }, [count1, count2])

  useEffect(() => {
    console.log('useEffect2')
  }, [count1])

  useLayoutEffect(() => {
    console.log('useLayoutEffect')
  }, [])

  const handleCallback = useCallback(() => {
    console.log(`count1改变了，值为${count1}`)
  }, [count1])

  const onButtonClick = () => {
    inputEl.current.focus()
  }

  let data = useMemo(() => ({ number: state.num }), [state.num])
  console.log('memorizedState:', memorizedState)
  return (
    <div>
      <div>
        <h2>
          useState： {count1}--{count2}
        </h2>
        <button
          onClick={() => {
            setCount1(count1 + 1)
          }}
        >
          添加count1
        </button>
        <button
          onClick={() => {
            setCount2(count2 + 10)
          }}
        >
          添加count2
        </button>
      </div>
      <div>
        <h2>useReducer：{state.num}</h2>
        <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      </div>
      <div>
        <h2>useCallback -- 依赖count1</h2>
        <Child count1={count1} handleCallback={handleCallback} />
        <Child1 data={data} />
      </div>
      <div>
        <h2>useContext</h2>
        <ThemeContext.Provider value='dark'>
          <div>
            <Child2 />
          </div>
        </ThemeContext.Provider>
      </div>
      <div>
        <h2>useRef</h2>
        <div>
          <input type='text' ref={inputEl} />
          <button onClick={onButtonClick}>Focus the input</button>
        </div>
      </div>
    </div>
  )
}

const render = () => {
  index = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
render()
