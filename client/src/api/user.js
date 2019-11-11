import request from '../../config/request'

export function register(query) {
  return request({
    url: '/user/register',
    method: 'post',
    data: query
  })
}

export function login(query) {
  return request({
    url: '/user/login',
    method: 'post',
    data: query
  })
}

export function logout(query) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: query
  })
}

export function getUserInfo(query) {
  return request({
    url: '/user/info',
    method: 'get',
    params: query
  })
}

