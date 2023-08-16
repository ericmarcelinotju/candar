export const articleList = {
  path: '/article',
  name: 'article',
  component: () => import(/* webpackChunkName: 'p-article-list' */ '@/pages/article/List.vue'),
  meta: {
    auth: true,
    title: 'Article'
  }
}

const ArticleCreateEdit = () => import(/* webpackChunkName: 'p-article-create-edit' */ '@/pages/article/CreateEdit.vue')

export const articleCreate = {
  path: '/article/create',
  name: 'article-create',
  component: ArticleCreateEdit,
  meta: {
    auth: true,
    title: 'Article Create'
  }
}

export const articleEdit = {
  path: '/article/edit/:id',
  name: 'article-edit',
  component: ArticleCreateEdit,
  meta: {
    auth: true,
    title: 'Article Edit'
  }
}
