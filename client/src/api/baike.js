export const getBaike = {
  url: '/api/news/getBaike',
  method: 'get',
  mock: false,
  thenable: res => {
    return res.data && res.data[0]
  }
}
