const config = {
  plugins: ['@tailwindcss/postcss']
  // plugins:{
  //   '@tailwindcss/postcss':{},
  //    'postcss-px-to-viewport': {
  //     viewportWidth: 290, // 设计稿的视口宽度
  //     unitPrecision: 5, // 单位转换后保留的精度
  //     viewportUnit: 'vw', // 希望使用的视口单位
  //     selectorBlackList: ['.ignore', '.hairlines'], // 忽略带有这些类的选择器
  //     propList: ['*', '!font-size'], // 所有属性都转换，除了font-size
  //     minPixelValue: 1, // 小于或等于`1px`不转换为视口单位
  //     mediaQuery: false, // 允许在媒体查询中转换`px`
  //     exclude: (e) => { // 只对src/views/largeScreen文件进行px转rem，其他文件不转换
  //       if (/src(\\|\/)components(\\|\/)Mobile/.test(e)) {
  //         return false
  //       } else {
  //         return true
  //       }
  //     },
  //   },
  //   autoprefixer: {} // 直接启用 Autoprefixer
  // },
};

module.exports = config;
