import store from './store'

const http = ajaxParams => new Promise((res, req) => {
  ajaxParams = Object.assign({
    url: '',
    dataType: 'json',
    type: 'get',
    data: {},
    xhrFields: {
      withCredentials: true
    },
    success: data => {
      if (data.errno === 1001) {
        store.commit('setNotLogin')
      }
      res(data)
    },
    error: (data) => {
      req(data)
    }
  }, ajaxParams)
  $.ajax(ajaxParams)
})

export default http
