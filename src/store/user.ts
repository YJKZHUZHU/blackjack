import { create } from "zustand"
import { addUserDayScores, getUserInfo } from '@/api';

export interface UserInfo {
  walletPublicKey: string;
  scores: number;
  profileImageUrl: string;
  gender: number;
  email: string;
  age: number;
  createAt: string;
  updateAt: string;
  isNew: number;
  needShowAddDayScores: boolean;
  addDayScores: number;
}

interface StoreState {
  balance: number // 余额
  sourceBalance: number,
  wallet: string // 钱包地址，有地址代表登录了
  userInfo: Partial<UserInfo> // 用户信息
  loading: boolean
  isMobile: boolean // 是否是移动端
  needShowAddDayScores: boolean // 是否需要显示每日积分提醒
  init: (wallet: string) => void
  updateBalance: (balance: number) => void
  updateWallet: (wallet: string) => void
  updateNeedShowAddDayScores: (needShowAddDayScores: boolean) => void
  updateIsMobile: (isMobile: boolean) => void
}

export const userStore = create<StoreState>()((set, get) => ({
  wallet: '',
  balance: 0,
  sourceBalance: 0,
  isMobile: false,
  loading: false,
  needShowAddDayScores: false,
  userInfo: {},
  init: async (wallet) => {
    if (get().loading) return
    set(state => ({ ...state, loading: true }))

    const res = await getUserInfo({ wallet })
    let userInfo = res.data.data.userInfo
    if (userInfo.needShowAddDayScores) {
      const scoresRes = await addUserDayScores({ wallet })
      userInfo = {
        ...userInfo,
        scores: scoresRes.data.data.scores,
      }
    }
    set(state => {
      return { ...state, userInfo, wallet, balance: userInfo.scores, sourceBalance: userInfo.scores, loading: false, needShowAddDayScores: userInfo.needShowAddDayScores }
    })
  },
  updateBalance: (balance: number) => set(state => ({ ...state, balance })),
  updateUserInfo: (userInfo: Partial<UserInfo>) => set(state => ({ ...state, userInfo })),
  updateWallet: (wallet: string) => set(state => ({ ...state, wallet })),
  updateNeedShowAddDayScores: (needShowAddDayScores: boolean) => set(state => ({ ...state, needShowAddDayScores })),
  updateIsMobile: (isMobile: boolean) => set(state => ({ ...state, isMobile })),
}))

export const useIsNewUser = () => userStore(state => state.userInfo.isNew === 1)

export const useLoading = () => userStore(state => state.loading)

export const useAddress = () => userStore(state => state.wallet)

export const useUserInfo = () => userStore(state => state.userInfo)

export const useSourceBalance = () => userStore(state => state.sourceBalance)

export const useNeedShowAddDayScores = () => userStore(state => state.needShowAddDayScores)






