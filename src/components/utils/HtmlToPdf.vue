<template>

</template>

<script>
  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'

  export default {
    install(Vue, options) {
      Vue.prototype.getPdf = function (id, name, time) {
        if (!time || time == "") {
          time = new Date().Format('yyyy年MM月dd日');
        }
        time=time.indexOf("当天")!=-1?time.substr(0,time.length-2):time
        time=time.replace(/年/g,".")
        time=time.replace(/月/g,".")
        time=time.replace(/日/g,"")

        html2Canvas(document.querySelector('#' + id), {
          allowTaint: true
        }).then(function (canvas) {
          var canvasTitle = document.createElement('canvas');
          canvasTitle.width = canvas.width; //☜
          canvasTitle.height = 140;
          var ctx = canvasTitle.getContext('2d');
          ctx.fillStyle = '#3B87F5';
          ctx.fillRect(0, 0, canvas.width, 140);

          var txttitle = localStorage.getItem('currentTenant') + "传播分析报告";
          ctx.font = "bold 36px Microsoft YaHei";
          var txtwidth = ctx.measureText(txttitle).width
          var gradient = ctx.createLinearGradient(0, 0, 12, 0);
          gradient.addColorStop("0.5", "#ffffff");
          ctx.fillStyle = gradient;
          ctx.fillText(txttitle, canvas.width / 2 - txtwidth / 2, 80);


          ctx.font = "22px Microsoft YaHei";
          var timewidth = ctx.measureText(time).width
          var gradient = ctx.createLinearGradient(0, 0, 12, 0);
          gradient.addColorStop("0.5", "#ffffff");
          ctx.fillStyle = gradient;
          ctx.fillText(time, canvas.width - timewidth - 40, 120);
          var txt = document.title;
          ctx.font = "22px Microsoft YaHei";
          var txtwidth = ctx.measureText(txt).width
          var gradient = ctx.createLinearGradient(0, 0, 12, 0);
          gradient.addColorStop("0.5", "#ffffff");
          ctx.fillStyle = gradient;
          ctx.fillText(txt, canvas.width  - txtwidth -timewidth - 80, 120);



          var canvas2 = document.createElement('canvas');
          canvas2.height = canvas.height + canvasTitle.height
          canvas2.width = canvas.width
          var context = canvas2.getContext("2d")
          canvas2.width = canvas.width * 4; // 关键代码: canvas的width、height属性用于管理画布尺寸
          canvas2.height = (canvas.height + canvasTitle.height) * 4; // 关键代码
          canvas2.style.width = canvas.width + "px"; // 关键代码: canvas的style属性中的width、height正好是显示尺寸,即最终生成到pdf中的尺寸
          canvas2.style.height = canvas.height + canvasTitle.height + "px";
          context.scale(4, 4);
          context.drawImage(canvasTitle, 0, 0, canvasTitle.width, canvasTitle.height)
          context.drawImage(canvas, 0, canvasTitle.height, canvas.width, canvas.height)
          let contentWidth = canvas2.width
          let contentHeight = canvas2.height
          var pageHeight = contentWidth / 592.28 * 841.89;
          var leftHeight = contentHeight;
          var position = 0;
          let imgWidth = 595.28
          let imgHeight = 595.28 / contentWidth * contentHeight
          let pageData = canvas2.toDataURL('image/jpeg', 1.0)
          let PDF = new JsPDF('', 'pt', 'a4')
          var dpiX = 160;
          var dpiY = 160;
          // PDF.addImage(pageData, 'JPEG', 7 / dpiX, 5 / dpiY, imgWidth, imgHeight)

          if(leftHeight < pageHeight) {
            PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth,imgHeight);
          } else {
            while(leftHeight > 0) {
              //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
              PDF.addImage(pageData, 'JPEG', 0, position,imgWidth, imgHeight)
              leftHeight -= pageHeight;
              position -= 841.89;
              //避免添加空白页
              if(leftHeight > 0) {
                //注②
                PDF.addPage();
              }
            }
          }
          PDF.save(txt + time + '.pdf')

        })
      }
    }
  }
</script>

<style scoped>

</style>
