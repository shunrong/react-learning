import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import UseStateExample from '@/examples/UseStateExample';
import UseEffectExample from '@/examples/UseEffectExample';
import UseContextExample from '@/examples/UseContextExample';
import UseReducerExample from '@/examples/UseReducerExample';
import UseMemoExample from '@/examples/UseMemoExample';
import UseCallbackExample from '@/examples/UseCallbackExample';
import UseRefExample from '@/examples/UseRefExample';
import UseImperativeHandleExample from '@/examples/UseImperativeHandleExample';
import UseLayoutEffectExample from '@/examples/UseLayoutEffectExample';
import UseDebugValueExample from '@/examples/UseDebugValueExample';
import CustomHooksExample from '@/examples/CustomHooksExample';
import HooksPrinciplesExample from '@/examples/HooksPrinciplesExample';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />

        {/* 基础 Hooks */}
        <Route path='/useState' element={<UseStateExample />} />
        <Route path='/useEffect' element={<UseEffectExample />} />
        <Route path='/useContext' element={<UseContextExample />} />
        <Route path='/useReducer' element={<UseReducerExample />} />

        {/* 性能优化 Hooks */}
        <Route path='/useMemo' element={<UseMemoExample />} />
        <Route path='/useCallback' element={<UseCallbackExample />} />

        {/* 引用 Hooks */}
        <Route path='/useRef' element={<UseRefExample />} />
        <Route
          path='/useImperativeHandle'
          element={<UseImperativeHandleExample />}
        />

        {/* 副作用 Hooks */}
        <Route path='/useLayoutEffect' element={<UseLayoutEffectExample />} />

        {/* 调试 Hooks */}
        <Route path='/useDebugValue' element={<UseDebugValueExample />} />

        {/* 自定义 Hooks */}
        <Route path='/custom-hooks' element={<CustomHooksExample />} />

        {/* Hooks 原理解析 */}
        <Route path='/hooks-principles' element={<HooksPrinciplesExample />} />
      </Routes>
    </Layout>
  );
}

export default App;
