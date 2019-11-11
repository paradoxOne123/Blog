import request from '../../config/request'

//获取文章列表
export function articleList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}
// 获取文章详情
export function articleDetail(query) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: query
  })
}
//发表文章  
export function postArticle(query) {
  return request({
    url: '/article/post',
    method: 'post',
    data: query
  })
}

//修改文章  
export function editArticle(query) {
  return request({
    url: '/article/edit',
    method: 'post',
    data: query
  })
}

//上传图片  
export function uploadImg(query) {
  return request({
    url: '/article/upload',
    method: 'post',
    data: query
  })
}

//发表评论
export function comment(query) {
  return request({
    url: '/article/comment',
    method: 'post',
    data: query
  })
}


