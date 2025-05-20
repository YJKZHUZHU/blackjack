import { useEffect, useState } from "react"
import { useIsNewUser, userStore, useAddress } from '@/store/user'
import Image from "next/image"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import countryList from '@/constant/country.json'
import { updateUserInfo } from '@/api'
import Mask from '@/components/Mask'
import classNames from "classnames"
import ClickableImage from "@/components/ClickableImage"
import { genderList, vapeList, brandList } from './help'
import style from './index.module.scss'


const UserForm = () => {

  const init = userStore((state) => state.init)
  const address = useAddress()
  const isUserNew = useIsNewUser()
  const [showMask, setShowMask] = useState(true)

  const [open, setOpen] = useState(false)

  const [message, setMessage] = useState({
    gender: '',
    vape: '',
    age: '',
    country: '',
    email: '',
    brand: '',
    otherBrand: ''
  })

  const [state, setState] = useState({
    gender: '',
    vape: '',
    age: '',
    country: '',
    email: ''
  })
  const [otherBrand, setOtherBrand] = useState('')
  const [brand, setBrand] = useState('')
  const [loading, setLoading] = useState(false)

  const onGender = (item: { label: string, value: string }) => {
    setState({
      ...state,
      gender: item.value
    })
    setMessage({
      ...message,
      gender: ''
    })
  }

  const onVape = (item: { label: string, value: string }) => {
    setState({
      ...state,
      vape: item.value
    })

    setMessage({
      ...message,
      vape: ''
    })
  }

  const onBrand = (item: { label: string, value: string }) => {
    setBrand(item.value)
    setMessage({
      ...message,
      brand: ''
    })
  }

  const onBrandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherBrand(event.target.value)
    setMessage({
      ...message,
      otherBrand: !event.target.value ? 'Please enter you like vape brand' : ''
    })
  }

  const onAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      age: event.target.value
    })

    setMessage({
      ...message,
      age: event.target.value && !/^[1-9]\d*$/.test(event.target.value) ? 'Please enter a number.' : ''
    })

  }

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      email: event.target.value
    })

    setMessage({
      ...message,
      email: event.target.value && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(event.target.value) ? 'The email address is illegal.' : ''
    })

  }

  const validateForm = () => {
    return Object.keys(state).length !== Object.values(state).filter(Boolean).length
  }

  const onSubmit = async () => {
    if (loading) return
    const result = validateForm()
    if (result) {
      setMessage(prev => {
        return {
          gender: state.gender === '' ? 'Please select your gender.' : '',
          vape: state.vape === '' ? 'Please select one of these options.' : '',
          age: state.age === '' ? 'Please select one of these options.' : prev.age,
          country: state.country === '' ? 'Please select one of these options.' : '',
          email: state.email === '' ? 'Please enter your email address.' : prev.email,
          brand: !brand ? 'Please select one of these options.' : '',
          otherBrand: !otherBrand ? 'Please enter you like vape brand' : ''
        }
      })
      return
    }
    setLoading(false)
    const res = await updateUserInfo({ ...state, brand: brand, wallet: address })

    setLoading(false)
    if (Number(res.data.code) === 0) {
      setShowMask(false)
    }
    init(address)
  }

  useEffect(() => {
    setShowMask(isUserNew)
  }, [isUserNew])


  if (!showMask) return null

  return (
    <Mask
      maskClosable={false}
      onClose={() => setShowMask(false)}
      contentClassName={style.maskContent}
    >
      <Image src='/img/highlight.png' width={400} height={106} alt="" className=" absolute top-[-51px] left-[-15px]" />
      <Image src='/img/dotGroup.png' width={86} height={16} alt="" className=" absolute bottom-[10px] left-0" />
      <div className={style.userForm}>
        <Image className="mt-[10px]" src='/img/userTitle.png' width={200} height={35} alt="" />
        <div className={style.form}>
          {/* 性别 */}
          <div className={style.formItem}>
            <span className={style.label}>Gender</span>
            <div className={style.genderList}>
              {
                genderList.map(item => {
                  return <div onClick={() => onGender(item)} className={classNames(style.genderItem, { [style.active]: state.gender === item.value })} key={item.value}>{item.label}</div>
                })
              }
            </div>
            {
              message.gender && <div data-aos="fade-in" className={style.validate}>{message.gender}</div>
            }
          </div>
          {/* 是否吸烟 */}
          <div className={style.formItem}>
            <span className={style.label}>Do you vape?</span>
            <div className={style.genderList}>
              {
                vapeList.map(item => {
                  return <div onClick={() => onVape(item)} className={classNames(style.genderItem, { [style.active]: state.vape === item.value })} key={item.value}>{item.label}</div>
                })
              }
            </div>
            {
              message.vape && <div className={style.validate}>{message.vape}</div>
            }
          </div>
          {/* 烟品牌 */}
          {
            state.vape === 'yes' && <div className={style.formItem}>
              <span className={style.label}>What brand do you like?</span>
              <div className={style.genderList}>
                {
                  brandList.map(item => {
                    return <div onClick={() => onBrand(item)} className={classNames(style.genderItem, { [style.active]: brand === item.value })} key={item.value}>{item.label}</div>
                  })
                }
              </div>
              {
                message.brand && <div className={style.validate}>{message.brand}</div>
              }
            </div>
          }
          {/*  其他研烟品牌 */}
          {
            brand === 'other' && (
              <div className={style.formItem}>
                <Input value={otherBrand} onChange={onBrandChange} className={classNames(style.input)} placeholder="Input your like brand" />
                {
                  message.otherBrand && <div className={style.validate}>{message.otherBrand}</div>
                }
              </div>
            )
          }


          {/* 年龄 */}
          <div className={style.formItem}>
            <span className={style.label}>Age</span>
            <Input onChange={onAgeChange} value={state.age} className={classNames(style.input)} placeholder="Input your age" />

            {
              message.age && <div className={style.validate}>{message.age}</div>
            }
          </div>

          {/* 国家 */}
          <div className={style.formItem}>
            <span className={style.label}>Country</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={classNames(style.selectButton, { [style.placeholder]: !state.country })}
                >
                  {state.country
                    ? countryList.find((framework) => framework.country === state.country)?.country
                    : "Select your country"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Select your country" className="h-9" />
                  <CommandList>
                    <CommandEmpty>No country found</CommandEmpty>
                    <CommandGroup>
                      {countryList.map((framework) => (
                        <CommandItem
                          key={framework.country}
                          value={framework.country}
                          onSelect={(currentValue) => {
                            setState(prev => {
                              return {
                                ...state,
                                country: currentValue === prev.country ? "" : currentValue
                              }
                            })
                            setMessage({
                              ...message,
                              country: currentValue ? '' : 'Please select your country.'
                            })
                            // setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                          }}
                        >
                          {framework.country}
                          <Check
                            className={classNames(
                              "ml-auto",
                              state.country === framework.country ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {
              message.country && <div className={style.validate}>{message.country}</div>
            }
          </div>

          {/* 邮箱 */}
          <div className={style.formItem}>
            <span className={style.label}>Email</span>
            <Input value={state.email} onChange={onEmailChange} className={style.input} type="email" placeholder="Input your email" />
            {
              message.email && <div className={style.validate}>{message.email}</div>
            }
          </div>
        </div>
        <ClickableImage
          className="self-center cursor-pointer"
          onClick={onSubmit}
          width={214}
          height={91}
          src="/img/mobile/confirm.png" />
      </div>
    </Mask >
  )
}

export default UserForm