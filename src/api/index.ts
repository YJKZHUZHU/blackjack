"use client"
import { UserInfo } from "@/store/user"
import axios, { AxiosInstance } from "axios"
import { userStore } from '@/store/user'

export interface ErrorRes extends Error {
  url?: string
  code?: number
  error?: string
}

/** 创建请求实例 */
function createService() {
  // 创建一个 Axios 实例
  const service = axios.create({
    withCredentials: true,
    // baseURL: (window as any)._global._BASEURL,
  })

  service.interceptors.response.use(
    (response) => {
      const code = response.data.code || response.data?.data?.code
      console.log("==response==", code)
      // const data = response.data || response.data?.data

      // console.log("==response==", data)
      // if (code === 200) {
      //   return {
      //     code,
      //     message: "",
      //     success: true,
      //     data: data.data || data,
      //   } as any
      // }
      // return {
      //   ...(data.data || data),
      //   code,
      //   success: false,
      // }
      return response
    },
    (error) => {
      // Status 是 HTTP 状态码
      // const status = get(error, 'response.status');
      const status = error?.response?.status
      switch (status) {
        case 301:
          error.message = "需要登录"
          break
        case 400:
          error.message = "请求错误"
          break
        case 401:
          error.message = "token过期"
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求地址出错"
          break
        case 408:
          error.message = "请求超时"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 501:
          error.message = "服务未实现"
          break
        case 502:
          error.message = "网关错误"
          break
        case 503:
          error.message = "服务不可用"
          break
        case 504:
          error.message = "网关超时"
          break
        case 505:
          error.message = "HTTP 版本不受支持"
          break
        default:
          break
      }

      console.log("error===>", JSON.stringify(error))

      return Promise.reject(error)
    }
  )
  return service
}

export function createRequestFunction(service: AxiosInstance) {
  // service.defaults.baseURL = "https://api.douya-music.top"
  service.defaults.baseURL = "https://bj-api.luckeyboard.com/api"

  service.defaults.timeout = 60 * 1000

  service.interceptors.request.use(
    (config) => {


      console.log('config', config.data)
      // let data = Object.create(null)
      // data = config.data ? config.data : {}


      // if (cookie) {
      //   data.cookie = cookie
      // }
      // config.data = data

      // console.log('config11', config.data)
      if (userStore.getState().wallet) {
        config.headers['address'] = userStore.getState().wallet

      }
      if (userStore.getState().signature) {
        config.headers['sign'] = userStore.getState().signature
      }

      // config.headers = {
      //   ...config.headers,
      //   address: userStore.getState().wallet, 
      //   sign: userStore.getState().signature
      // }

      return config
    },
    // 发送失败
    (error) => Promise.reject(error)
  )

  return service
}


export interface IResp<T = Record<string, string>> {
  code: string
  message: string
  success: boolean
  data: T
}



const server = createRequestFunction(createService())


export const addUserDayScores = (data: { wallet: string }) => {
  return server.post<IResp<UserInfo>>("/v1/user/addUserDayScores", data)
}

// 根据钱包地址获取用户信息

export const getUserInfo = (data: { wallet: string }) => {
  return server.get<IResp<{ userInfo: UserInfo, userScoresRanking: number }>>("/v1/user/getUserInfo", { params: data })
}

interface IGameData {
  wallet: string,
  baseScores: number, // 基础筹码
  totalScores: number, // 最终筹码
  isDouble: number, // 是否双倍 0:不是，1：是
  is21: number, // 是否21点 0:不是，1：是
  userCards: string, // 用户手牌
  dealerCards: string, // 庄家手牌
  action: 0 | 1 | 2 // 0 加积分 1 减积分 平局 2
}

// 上报用户游戏数据
export const addUserGameData = (data: IGameData) => {
  return server.post<IResp<{ userInfo: UserInfo }>>("/v1/user/updateUserScore", data)
}

// 更新用户信息

interface IUpdateUserInfo {
  wallet: string,
  gender: string,
  vape: string,
  brand: string,
  age: string,
  country: string,
  email: string
}
export const updateUserInfo = (data: IUpdateUserInfo) => {
  return server.post<IResp<unknown>>("/v1/user/updateUserInfo", data)
}

// 获取用户排行榜

export interface IGetUserRankRes {
  walletPublicKey: string,
  scores: number,
  profileImageUrl: string,
  gender: number,
  email: string,
  age: number,
  createAt: string,
  updateAt: string,
  isNew: number,
  needShowAddDayScores: boolean,
  addDayScores: number,
  isVape: number,
  country: string,
  brand: string,
}
export const getUserRank = (data: { wallet: string, page: number, size: number }) => {
  return server.get<IResp<{ userList: IGetUserRankRes[] }>>("/v1/rank/GetUserScoresRank", { params: data })
}

// 获取当前用户排名
export const getCurrentUserRank = (data: { wallet: string }) => {
  return server.get<IResp<{ userInfo: UserInfo, ranking: number }>>('/v1/user/getUserRankingReq', { params: data })
}

// 获取验证码
export const getCaptcha = (data: { address: string }) => {
  return server.get<IResp<{ code: string }>>("/v1/secure/getCode", { params: data })
}


export interface IAirdropInfo {
  chips_percentage: number,
  airdrop_amount: number,
  is_airdrop_time: boolean,
}

// 获取空投情况
export const getAirdropInfo = (data: { solAddress: string }) => {
  return server.post<IResp<IAirdropInfo>>("/v1/airdrop/result", data)
}