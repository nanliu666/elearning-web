/**
 * @file 导出pdf文件
 */
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
/* eslint-disable */

const PDF = {}

//A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
let a4Width = 595.28
let a4Height = 841.89

let defaultOptions = {
  allowTaint: true,
  scale: 2,
  useCORS: true,
  logging: true
}

PDF.install = function(Vue, rootOptions = {}) {
  Vue.prototype.$pdf = function(dom, options = rootOptions, loadingInstance) {
    options = _.assign(defaultOptions, options)
    html2canvas(dom, options).then((canvas) => {
      const { name } = options
      //未生成pdf的html页面高度
      var leftHeight = canvas.height
      //一页pdf显示html页面生成的canvas高度;
      var a4HeightRef = Math.floor((canvas.width / a4Width) * a4Height)
      //pdf页面偏移
      var position = 0
      var pageData = canvas.toDataURL('image/jpeg', 1.0)
      var pdf = new JsPDF('p', 'pt', 'a4') //A4纸，纵向
      var index = 1,
        canvas1 = document.createElement('canvas'),
        height
      pdf.setDisplayMode('fullwidth', 'continuous', 'FullScreen')
      function createImpl(canvas) {
        // console.log(leftHeight, a4HeightRef)
        if (leftHeight > 0) {
          index++
          var checkCount = 0
          if (leftHeight > a4HeightRef) {
            var i = position + a4HeightRef
            for (i = position + a4HeightRef; i >= position; i--) {
              var isWrite = true
              for (var j = 0; j < canvas.width; j++) {
                var c = canvas.getContext('2d').getImageData(j, i, 1, 1).data
                if (c[0] != 0xff || c[1] != 0xff || c[2] != 0xff) {
                  isWrite = false
                  break
                }
              }
              if (isWrite) {
                checkCount++
                if (checkCount >= 10) {
                  break
                }
              } else {
                checkCount = 0
              }
            }
            height = Math.round(i - position) || Math.min(leftHeight, a4HeightRef)
            if (height <= 0) {
              height = a4HeightRef
            }
          } else {
            height = leftHeight
          }

          canvas1.width = canvas.width
          canvas1.height = height

          // console.log(index, 'height:', height, 'pos', position)

          var ctx = canvas1.getContext('2d')
          ctx.drawImage(canvas, 0, position, canvas.width, height, 0, 0, canvas.width, height)

          if (position != 0) {
            pdf.addPage()
          }
          pdf.addImage(
            canvas1.toDataURL('image/jpeg', 1.0),
            'JPEG',
            10,
            10,
            a4Width,
            (a4Width / canvas1.width) * height
          )
          leftHeight -= height
          position += height
          if (leftHeight > 0) {
            setTimeout(createImpl, 500, canvas)
          } else {
            pdf.save(name + '.pdf')
            loadingInstance && loadingInstance.close()
          }
        }
      }

      //当内容未超过pdf一页显示的范围，无需分页
      if (leftHeight < a4HeightRef) {
        pdf.addImage(pageData, 'JPEG', 0, 0, a4Width, (a4Width / canvas.width) * leftHeight)
        pdf.save(name + '.pdf')
      } else {
        try {
          pdf.deletePage(0)
          setTimeout(createImpl, 500, canvas)
        } catch (err) {
          console.log(err)
        }
      }
    })
  }
}
export default PDF
