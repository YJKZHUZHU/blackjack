export const formatAddress = (addr?: string) => {
  if (!addr) return ''
  if (addr.length <= 8) return addr
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`
}