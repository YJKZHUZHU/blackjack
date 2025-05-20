/**
 * 数字格式化工具（支持国际/中文单位）
 * @param {number} num - 要格式化的数字
 * @param {Object} [options] - 配置选项
 * @param {number} [options.decimal=1] - 小数位数
 * @param {boolean} [options.forceDecimal=false] - 是否强制保留小数位
 * @param {boolean} [options.chineseUnit=false] - 是否使用中文单位（万/亿）
 * @returns {string} 格式化后的字符串
 */
export function formatScores(num: number, {
  decimal = 1,
  forceDecimal = false,
  chineseUnit = false
} = {}) {
  if (typeof num !== 'number') return 'NaN';
  if (num === 0) return '0';

  const units = chineseUnit
    ? [
      { value: 1e8, symbol: '亿' }, // 100,000,000
      { value: 1e4, symbol: '万' }, // 10,000
    ]
    : [
      { value: 1e6, symbol: 'm' }, // 1,000,000
      { value: 1e3, symbol: 'k' }, // 1,000
    ];

  // 查找匹配的单位
  const unit = units.find(unit => num >= unit.value) || { value: 1, symbol: '' };
  const scaledNum = num / unit.value;

  // 处理小数部分
  let formatted = scaledNum.toFixed(decimal);

  // 优化显示：移除无效小数位
  if (!forceDecimal) {
    formatted = formatted.replace(
      new RegExp(`\\.?0{0,${decimal}}$`),
      match => match.includes('.') ? '' : match
    );
  }

  return `${formatted}${unit.symbol}`.replace(/\.$/, '');
}