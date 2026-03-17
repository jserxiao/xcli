import type { BundlerType } from '../../../types';

/**
 * Redux Store 模板
 */
export function getReduxStoreIndex(bundler: BundlerType = 'vite', useTypeScript: boolean = true): string {
  const isDev = bundler === 'vite' 
    ? 'import.meta.env.DEV' 
    : 'process.env.NODE_ENV === "development"';

  if (useTypeScript) {
    return `import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import counterReducer from './counterSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // thunk 已内置，无需额外配置
      // 开启不可变状态检查（开发环境）
      immutableCheck: ${isDev},
      // 开启序列化检查（开发环境）
      serializableCheck: ${isDev},
    }).concat(apiSlice.middleware), // 添加 RTK Query 中间件
  // 开启 Redux DevTools（开发环境）
  devTools: ${isDev},
});

// 设置监听器（用于 RTK Query 缓存失效等）
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
  }

  // JavaScript 版本
  return `import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import counterReducer from './counterSlice';
import { apiSlice } from './apiSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // thunk 已内置，无需额外配置
      // 开启不可变状态检查（开发环境）
      immutableCheck: ${isDev},
      // 开启序列化检查（开发环境）
      serializableCheck: ${isDev},
    }).concat(apiSlice.middleware), // 添加 RTK Query 中间件
  // 开启 Redux DevTools（开发环境）
  devTools: ${isDev},
});

// 设置监听器（用于 RTK Query 缓存失效等）
setupListeners(store.dispatch);

// 类型化的 hooks（JS 版本无类型）
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
`;
}

export function getReduxCounterSlice(useTypeScript: boolean = true): string {
  if (useTypeScript) {
    return `import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  loading: boolean;
  error: string | null;
}

const initialState: CounterState = {
  value: 0,
  loading: false,
  error: null,
};

// 使用 thunk 的异步 action（RTK 内置支持）
export const incrementAsync = createAsyncThunk(
  'counter/incrementAsync',
  async (amount: number, { rejectWithValue }) => {
    try {
      // 模拟异步操作（如 API 调用）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return amount;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;
`;
  }

  // JavaScript 版本
  return `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
  loading: false,
  error: null,
};

// 使用 thunk 的异步 action（RTK 内置支持）
export const incrementAsync = createAsyncThunk(
  'counter/incrementAsync',
  async (amount, { rejectWithValue }) => {
    try {
      // 模拟异步操作（如 API 调用）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return amount;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;
`;
}

export function getReduxApiSlice(useTypeScript: boolean = true): string {
  if (useTypeScript) {
    return `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 定义 API 响应类型
export interface User {
  id: number;
  name: string;
  email: string;
}

// 创建 RTK Query API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // 可配置请求拦截器
    prepareHeaders: (headers) => {
      // 添加认证 token 等
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', \`Bearer \${token}\`);
      return headers;
    },
  }),
  tagTypes: ['User'], // 缓存标签，用于自动刷新
  endpoints: (builder) => ({
    // 查询用户列表
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    // 查询单个用户
    getUser: builder.query<User, number>({
      query: (id) => \`/users/\${id}\`,
    }),
    // 创建用户
    createUser: builder.mutation<User, Partial<User>>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'], // 创建后自动刷新列表
    }),
  }),
});

// 自动生成的 hooks
export const { useGetUsersQuery, useGetUserQuery, useCreateUserMutation } = apiSlice;
`;
  }

  // JavaScript 版本
  return `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// 创建 RTK Query API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    // 可配置请求拦截器
    prepareHeaders: (headers) => {
      // 添加认证 token 等
      // const token = localStorage.getItem('token');
      // if (token) headers.set('Authorization', \`Bearer \${token}\`);
      return headers;
    },
  }),
  tagTypes: ['User'], // 缓存标签，用于自动刷新
  endpoints: (builder) => ({
    // 查询用户列表
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    // 查询单个用户
    getUser: builder.query({
      query: (id) => \`/users/\${id}\`,
    }),
    // 创建用户
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      invalidatesTags: ['User'], // 创建后自动刷新列表
    }),
  }),
});

// 自动生成的 hooks
export const { useGetUsersQuery, useGetUserQuery, useCreateUserMutation } = apiSlice;
`;
}

export function getReduxLoggerMiddleware(bundler: BundlerType = 'vite', useTypeScript: boolean = true): string {
  const isDev = bundler === 'vite' 
    ? 'import.meta.env.DEV' 
    : 'process.env.NODE_ENV === "development"';

  if (useTypeScript) {
    return `import type { Middleware } from '@reduxjs/toolkit';

/**
 * 开发环境日志中间件
 * 生产环境建议使用 Redux DevTools 扩展
 */
export const loggerMiddleware: Middleware = (store) => (next) => (action) => {
  if (${isDev}) {
    const actionType = (action as { type: string }).type;
    console.group(\`%c Action: \${actionType}\`, 'color: #9E9E9E; font-weight: bold');
    console.log('%c Previous State:', 'color: #9E9E9E', store.getState());
    console.log('%c Action:', 'color: #03A9F4', action);
    const result = next(action);
    console.log('%c Next State:', 'color: #4CAF50', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};
`;
  }

  // JavaScript 版本
  return `/**
 * 开发环境日志中间件
 * 生产环境建议使用 Redux DevTools 扩展
 */
export const loggerMiddleware = (store) => (next) => (action) => {
  if (${isDev}) {
    const actionType = action.type;
    console.group(\`%c Action: \${actionType}\`, 'color: #9E9E9E; font-weight: bold');
    console.log('%c Previous State:', 'color: #9E9E9E', store.getState());
    console.log('%c Action:', 'color: #03A9F4', action);
    const result = next(action);
    console.log('%c Next State:', 'color: #4CAF50', store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};
`;
}

/**
 * MobX Store 模板
 */
export function getMobXCounterStore(useTypeScript: boolean = true): string {
  if (useTypeScript) {
    return `import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  incrementByAmount(amount: number) {
    this.count += amount;
  }
}

export const counterStore = new CounterStore();
`;
  }

  // JavaScript 版本
  return `import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  incrementByAmount(amount) {
    this.count += amount;
  }
}

export const counterStore = new CounterStore();
`;
}

export function getMobXStoreIndex(useTypeScript: boolean = true): string {
  return `export { counterStore } from './CounterStore';
`;
}

/**
 * Pinia Store 模板
 */
export function getPiniaStoreIndex(): string {
  return `import { createPinia } from 'pinia';

export const pinia = createPinia();
`;
}

export function getPiniaCounterStore(): string {
  return `import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0);

  // getters
  const doubleCount = computed(() => count.value * 2);

  // actions
  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function incrementByAmount(amount: number) {
    count.value += amount;
  }

  return {
    count,
    doubleCount,
    increment,
    decrement,
    incrementByAmount,
  };
});
`;
}
