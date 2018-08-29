<template>
  <canvas id="canvas" :width="size" :height="size" :style="'background-color:'+backgroundColor?backgroundColor:'#fff'">

  </canvas>
</template>

<script>
  export default {
    name: "word-cloud-pic",
    props: {
      size: {type: String/Number, require: true},
      data: {type: Array, require: true},
      backgroundColor: {type: String, require: false},
      decorateCircleColor: {type: Array, require: false},
    },
    watch:{
      data(old,newDate){
        this.init();
      },
      size(old,newDate){
        this.init();
      }
    },
    methods:{
      init(){
        var canvasSize =this.size
        var data = this.data
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        var sum = 0
        for(var i = 0; i < data.length; i++) {
          sum = sum+data[i].num
        }
        var length = canvasSize
        var unitLength = length / sum
        var circleList = []
        for(var i = 0; i < data.length; i++) {
          var circle = {
            pointX: 0,
            pointY: 0,
            length: ((sum/9) + data[i].num / 4) * 1.6,
          }
          circleList.push(circle)
        }
        var num = 0
        for(var i = 0; i < data.length; i++) {
          var circle = circleList[i]
          var circleLength = circle.length
          var X = 0
          var Y = 0
          num = 0
          while(1) {
            X = circleLength*1.1 / 2 + Math.random() * (sum - circleLength*1.1)
            Y = circleLength*1.1 / 2 + Math.random() * (sum - circleLength*1.1)
            var flag = -1
            for(var j = 0; j < i; j++) {
              if(i == j) {
                continue
              }
              if(circleList[j].pointX == 0 || circleList[j].pointY == 0) {
                continue
              }
              var c2cLengthSquare = (X - circleList[j].pointX) * (X - circleList[j].pointX) + (Y - circleList[j].pointY) * (Y - circleList[j].pointY)
              var lengthSquare = (circleList[j].length + circleLength) * (circleList[j].length + circleLength) / 4
              if(lengthSquare > c2cLengthSquare) {
                num++
                flag = 1
                break
              }
            }
            if(flag == -1 || num > 100000) {
              break
            }
          }
          circle.pointX = X
          circle.pointY = Y
        }
        var littleCircleList = []
        for(var i = 0; i < 10000; i++) {
          if(littleCircleList.length > 10)
            break
          var item = {}
          var length = sum/15 + Math.random() * (sum/20)
          item.x = length*1.1 / 2 + Math.random() * (sum - length*1.1)
          item.y = length*1.1/ 2 + Math.random() * (sum - length*1.1)
          item.length = length
          var flag = -1;
          for(var j = 0; j < circleList.length; j++) {
            var c2cLengthSquare = (item.x - circleList[j].pointX) * (item.x - circleList[j].pointX) + (item.y - circleList[j].pointY) * (item.y - circleList[j].pointY)
            var lengthSquare = (circleList[j].length + length) * (circleList[j].length + length) / 4
            if(lengthSquare > c2cLengthSquare) {
              flag = 1
              break
            }
          }
          for(var j = 0; j < littleCircleList.length; j++) {
            var c2cLengthSquare = (item.x - littleCircleList[j].x) * (item.x - littleCircleList[j].x) + (item.y - littleCircleList[j].y) * (item.y - littleCircleList[j].y)
            var lengthSquare = (littleCircleList[j].length + length) * (littleCircleList[j].length + length) / 4
            if(lengthSquare > c2cLengthSquare) {
              flag = 1
              break
            }
          }
          if(flag == -1) {
            littleCircleList.push(item)
          }
        }
        for(var i = 0; i < littleCircleList.length; i++) {
          var circle = littleCircleList[i]
          ctx.beginPath();
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(108,108,108,1)";
          ctx.arc(circle.x * unitLength, circle.y * unitLength, circle.length * unitLength * 0.5, 0, 2 * Math.PI);
          if(this.decorateCircleColor){
            ctx.fillStyle = this.decorateCircleColor[i%this.decorateCircleColor.length]
          }else {
            ctx.fillStyle = "deepskyblue";
          }
          ctx.fill();
        }

        for(var i = 0; i < circleList.length; i++) {
          if(circleList[i].pointX == 0 || circleList[i].pointY == 0) {
            continue
          }
          var circle = circleList[i]
          ctx.beginPath();
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(66,66,66,1)";
          ctx.arc(circle.pointX * unitLength, circle.pointY * unitLength, circle.length * unitLength * 0.5 / 0.95, 0, 2 * Math.PI);
          ctx.fillStyle = data[i].color;
          ctx.fill();
          ctx.shadowBlur = 0;
          var fontSize = canvasSize/25
          fontSize = parseInt(fontSize)
          ctx.font = fontSize+"px Microsoft YaHei";
          var txt = data[i].name
          var percent = (data[i].num/sum)*100
          percent = percent+""
          var strArray = percent.split(".")
          if(strArray.length>1&&strArray[1].length>2){
            percent=percent.substring(0,percent.indexOf(".")+3)+"%"
          }else{
            percent=percent+"%"
          }
          var txtwidth = ctx.measureText(txt).width
          var percentwidth = ctx.measureText(percent).width
          var gradient = ctx.createLinearGradient(0, 0, 12, 0);
          gradient.addColorStop("0.5", "#fff");
          ctx.fillStyle = gradient;
          ctx.fillText(txt, circle.pointX * unitLength - txtwidth/2, circle.pointY * unitLength-2);
          ctx.fillText(percent, circle.pointX * unitLength - percentwidth/2, circle.pointY * unitLength+2+fontSize);
        }
      }
    },
    mounted(){
      if(this.data&&this.data.length>0){
        this.init()
      }
    }

  }
</script>

<style scoped>

</style>
