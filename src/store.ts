import { createStore } from 'vuex'
import { testData, testPosts, ColumnProps, PostProps } from './testData'
export { ColumnProps, PostProps } from './testData'
interface UserProps {
  isLogin: boolean
  name?: string
  id?: number
  columnId?: number
}
export interface GlobalDataProps {
  columns: ColumnProps[]
  posts: PostProps[]
  user: UserProps
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: true, name: 'viking', columnId: 1 }
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'viking' }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    }
  },
  getters: {
    biggerColumnsLen(state) {
      return state.columns.filter((c) => c.id > 2).length
    },
    getColumnById(state) {
      return (id: number) => state.columns.find((c) => c.id === id)
    },
    getPostsByCid(state) {
      return (cid: number) =>
        state.posts.filter((post) => post.columnId === cid)
    }
  }
})

export default store