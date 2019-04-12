//业余写着玩 大神勿喷
(function (w, t) {
  ~function () {
    let sTmp = $("[n-tmp='sTmp']")
    for(let i = 0;i<sTmp.length;i++){
      let t = sTmp.eq(i).html()
      sTmp.eq(i).html('<input class="sTemplate-model" type="hidden" value="'+ (t+'').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&apos;")+'"/>')
    }
  }()
  return t(w)
})(window, function (c) {
  c.$s = {
    sWord: '',
    upFile(o, ob) {
      let formData = new FormData()
      formData.append('avatar', o.file[0])
      $.ajax({
        type: 'post',
        url: o.api,
        data: formData,
        contentType: false,
        processData: false,
        success: function (d) {
          ob(d)
        },
        error: function (e) {
          ob(e)
        }
      })
    },
    message(o) {
      let sText = ''
      let sPosition = 'center'
      let sTime = 2000
      if(o&&o.text){sText = o.text}else {sText = o}
      if(o&&o.position){sPosition = o.position}
      if(o&&o.time){sTime = o.time}
      let __sTips = '<span style="display: none;padding: 5px 10px;font-size: 14px;color: #fff;background: #1f1f1f;opacity: .8;border-radius: 6px;position: fixed;top: 0;left: 0;" class="__sTips">' + sText + '</span>'
      $('body').append(__sTips)
      let s = $('.__sTips')
      let w = s.css('width')
      let wz = s.css('padding-top')
      let q = s.css('height')
      let qz = s.css('padding-left')
      let t = Number(w.replace(/[px]/g, '')) + (Number(qz.replace(/[px]/g, '')) * 2)
      let tz = Number(q.replace(/[px]/g, '')) + (Number(wz.replace(/[px]/g, '')) * 2)
      if (sPosition === 'top') {
        s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(10%)'})
      }
      if (sPosition === 'center') {
        s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(50% - ' + tz / 2 + 'px)'})
      }
      if (sPosition === 'bottom') {
        s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(90%)'})
      }
      s.fadeIn(400)
      setTimeout(function () {
        s.fadeOut(400)
        setTimeout(function () {
          s.remove()
        }, 410)
      }, sTime)
    },
    arrayPosition(o, f) {
      let p = [];
      let z = f.indexOf(o);
      while (z > -1) {
        p.push(z);
        z = f.indexOf(o, z + 1);
      }
      return p
    },
    tmpToHtml(name,r,f) {
      let domName = this.lave('$("' + name + '")')
      let dataList = ''
      if(r==='$s'){
        dataList = this.lave(domName.attr('n-for'))
      }else {
        console.log(r)
        dataList = r
      }
      let tmp = ''
      if(domName.find('.sTemplate-model').length===0){
        tmp = domName.html()
      }else {
        tmp = domName.find('.sTemplate-model').val()
      }
      if (r === '' || !r || r.length === 0) {
        domName.html('<input class="sTemplate-model" type="hidden" value="' + this.escapeHTML(tmp) + '"/>').show();
        if (f) {f()}
        return
      }
      let getKey = /\{{(.+?)\}}/g;
      let allKey = tmp.match(getKey)
      let str = ''
      for (let i = 0; i < dataList.length; i++) {
        let nowTmp = tmp
        for (let z = 0; z < allKey.length; z++) {
          if(allKey[z].indexOf('{{sIndex')!==-1){dataList[i]['sIndex'] = i}
          let a = "/" + allKey[z] + "/g";
          -1 !== a.indexOf("+") && (a = a.split("+")[0] + "\\+" + a.split("+")[1]);
          -1 !== a.indexOf("-") && (a = a.split("-")[0] + "\\-" + a.split("-")[1]);
          -1 !== a.indexOf("*") && (a = a.split("*")[0] + "\\*" + a.split("*")[1]);
          -1 !== a.indexOf("\\\\") && (a = a.split("\\")[0] + "\\\\" + a.split("\\")[1]);
          -1 !== a.indexOf("?") && (a = a.split("?")[0] + "\\?+" + a.split("?")[1]);
          -1 !== a.indexOf(":") && (a = a.split(":")[0] + "\\:" + a.split(":")[1]);
          let b = this.lave(JSON.stringify(dataList[i]) + "." + allKey[z].replace(/[{}]/g, ""));
          console.log(allKey[z].replace(/[{}]/g, ""))
          nowTmp = nowTmp.replace(this.lave(a), void 0 === b ? "" : b);
        }
        str += nowTmp
      }
      str+='<input class="sTemplate-model" type="hidden" value="'+ this.escapeHTML(tmp) +'"/>'
      domName.html(str).show()
      if (f) {f()}
    },
    elSort(o) {
      let v = [], n = [], h = -1
      for (let i = 0; i < this.lave('$("' + o.element + '")').find('li').length; i++) {
        v.push(this.lave('$("' + o.element + '")').find('li').eq(i))
      }
      if (o['sort'].toLowerCase() === 'down') {
        h = 1
      }
      v.sort((a, b) => {
        return (a.attr(o.sortData) * h) - (b.attr(o.sortData) * h)
      })
      for (let i = 0; i < v.length; i++) {
        n.push(v[i][0].outerHTML)
      }
      if (o.success) {
        o.success(n)
        return
      }
      console.warn('没有找到回调函数')
    },
    upload(deploy) {
      let files = deploy.file;
      if (!files.length) return;
      this.imgPreview(deploy);
      // console.log(this.picValue)
    },
    imgPreview(deploy) {
      let _THIS = this
      let file = deploy.file[0]
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      EXIF.getData(file, function () {
        let Orientation = EXIF.getAllTags(this);
        if (!file || !window.FileReader) return;
        if (/^image/.test(file.type)) {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = (r) => {
            let result = r.target['result'];
            let img = new Image();
            img.src = result;
            //判断图片是否大于20K
            if (result.length <= (20 * 1024)) {
              deploy.complete(result)
            } else {
              img.onload = () => {
                console.log(Orientation)
                _THIS.compress(img, Orientation, deploy);
              }
            }
          }
        }
      });
      // 看支持不支持FileReader
    },
    rotateImg(img, direction, canvas) {
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == 'right') {
        step++;
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext('2d');
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    GzipPic(base, deploy) {
      let _gRate = 0.65
      if (deploy.compress && deploy.compress !== '') {
        if (isNaN(deploy.compress * 1)) {
          console.warn('压缩比率设置错误，将使用默认比率')
        } else {
          _gRate = deploy.compress * 1
        }
      }
      let Qcanvas = document.createElement("canvas");
      let Qctx = Qcanvas.getContext('2d');
      let QPic = new Image();
      QPic.src = base
      let _gFormat = 'image/jpeg'
      if (deploy.format && deploy.format !== '') {
        if (deploy.format.toLowerCase() === 'png') {
          _gFormat = 'image/' + deploy.format
        }
      }
      QPic.onload = () => {
        let width = QPic.width;
        let height = QPic.height;
        console.log(deploy)
        let ratio;
        if (deploy.maxWidth && deploy.maxWidth !== '') {
          if (isNaN(deploy.maxWidth * 1)) {
            console.error('图片压缩尺寸设置错误，将使用原图尺寸')
          } else {
            if (width > deploy.maxWidth) {
              width = deploy.maxWidth
              ratio = deploy.maxWidth / QPic.width
              height *= ratio
            }
          }
        }
        Qcanvas.height = height;
        Qcanvas.width = width;
        Qctx.drawImage(QPic, 0, 0, width, height);
        deploy.complete(Qcanvas.toDataURL(_gFormat, _gRate))
      }
    },
    compress(img, Tags, deploy) {
      let gRate = 0.7
      if (deploy.compress && deploy.compress !== '') {
        if (isNaN(deploy.compress * 1)) {
          console.error('压缩比率设置错误，将使用默认比率')
        } else {
          gRate = deploy.compress * 1
        }
      }
      let gFormat = 'image/jpeg'
      if (deploy.format && deploy.format !== '') {
        if (deploy.format.toLowerCase() === 'png') {
          gFormat = 'image/' + deploy.format
        }
      }
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
      let width = img.width;
      let height = img.height;
      console.log(deploy)
      if (Tags.Orientation && Tags.Orientation !== 1) {
        switch (Tags.Orientation) {
          case 6:
            this.rotateImg(img, 'left', canvas);
            this.GzipPic(canvas.toDataURL(gFormat, .7), deploy)
            break;
          case 8:
            this.rotateImg(img, 'right', canvas);
            this.GzipPic(canvas.toDataURL(gFormat, .7), deploy)
            break;
          case 3:
            this.rotateImg(img, 'right', canvas);//转两次
            let xImg = img
            xImg.src = canvas.toDataURL(gFormat, .7)
            xImg.onload = () => {
              this.rotateImg(xImg, 'right', canvas);
              this.GzipPic(canvas.toDataURL(gFormat, 1), deploy)
            }
            return
        }
      } else {
        let ratio;
        if (deploy.maxWidth && deploy.maxWidth !== '') {
          if (isNaN(deploy.maxWidth * 1)) {
            console.error('图片压缩尺寸设置错误，将使用原图尺寸')
          } else {
            if (width > deploy.maxWidth) {
              width = deploy.maxWidth
              ratio = deploy.maxWidth / img.width
              height *= ratio
            }
          }
        } else {
          if ((ratio = width * height / 4000000) > 1) {
            console.log("大于400万像素")
            ratio = Math.sqrt(ratio);
            width /= ratio;
            height /= ratio;
          } else {
            ratio = 1;
          }
        }
        canvas.height = height;
        canvas.width = width;
        ctx.drawImage(img, 0, 0, width, height);
        deploy.complete(canvas.toDataURL(gFormat, gRate))
        canvas.width = canvas.height = 0;
      }
    },
    searchJson(o) {
      let data = o.data
      if (this.sWord === o.key) { //搜索优化，把关键词存进全局$s变量里面，因为enter会触发两次输入框值改变事件
        return
      }
      this.sWord = o.key
      let sMode = o.sMode
      let sKey = o.sKey
      let sSearchMode = o.sSearchMode
      if (this.sWord === '') {
        o.sResult(data)
        return
      }
      let sPos = []
      let sData = []
      for (let i = 0; i < data.length; i++) {
        if (sMode === 'global') {//全局搜索
          for (let key in data[i]) {
            if (sSearchMode === 'vague') {//模糊搜索
              if ((data[i][key] + '').indexOf(this.sWord) !== -1) {
                if (sPos.indexOf(i) === -1) {
                  sPos.push(i)
                }
              }
            } else if (sSearchMode === 'accurate') {//精准搜索
              if ((data[i][key]) === this.sWord) {
                if (sPos.indexOf(i) === -1) {
                  sPos.push(i)
                }
              }
            }
          }
        } else if (sMode === 'single') {//指定key搜索
          for (let key in data[i]) {
            if (sSearchMode === 'vague') {//模糊搜索
              if (key === sKey && data[i][key].indexOf(this.sWord) !== -1) {
                if (sPos.indexOf(i) === -1) {
                  sPos.push(i)
                }
              }
            } else if (sSearchMode === 'accurate') {
              if (key === sKey && data[i][key] === this.sWord) {
                if (sPos.indexOf(i) === -1) {
                  sPos.push(i)
                }
              }
            }
          }
        }
      }
      for (let i = 0; i < sPos.length; i++) {
        sData.push(data[sPos[i]])
      }
      o.sResult(sData)
    },
    numRule (val, rule) {
      if (val < 0) {
        return 0
      }
      val = val.toString().replace(/[^\d^\.？]+/g, '')
      // console.log(val)
      let numValue = val.toString()
      if (numValue === '') {
        $s.message('只能输入数字')
        return
      }
      let first = rule[0]
      let before = rule[1]
      let thisCount = 0;
      numValue.replace(/[.]/g, function (m, i) {
        thisCount++;
      });
      if (thisCount > 1) {
        console.log(thisCount)
        numValue = numValue.substring(0, numValue.length - 1)
      }
      if (thisCount > 0) {
        let valArr = numValue.split('.')
        let firstNum = valArr[0]
        let beforeNum = valArr[1]
        if (firstNum.substring(0, 1) === '0') {
          if (firstNum.substring(1, 2) === '0') {
            return firstNum.substring(0, 1) + '.' + beforeNum
          }
        }
        if (valArr[0].length > first) {
          firstNum = valArr[0].substring(0, first)
        }
        if (valArr[1].length > before) {
          beforeNum = valArr[1].substring(0, before)
        }
        if (firstNum === '0') {
          let nc = true
          let beforeNumArr = beforeNum.split('')
          if (beforeNumArr.length === before) {
            for (let i = 0; i < beforeNumArr.length - 1; i++) {
              if (beforeNumArr[i] !== '0') {
                nc = false
              }
            }
            if (nc) {
              beforeNum = beforeNum.substring(0,before-1)+'1'
            }
          }
        }
        return firstNum + '.' + beforeNum
      }
      if (thisCount === 0) {
        if (numValue.substring(0, 1) === '0') {
          if (numValue.length > 1) {
            return numValue.substring(1, 2)
          }
        }
        if (numValue.length > first) {
          numValue = numValue.substring(0, first)
        }
      }
      return numValue
    },
    lave(fn) {
      let Fn = Function;
      return new Fn('return ' + fn)();
    },
    escapeHTML(s) {
      s = "" + s;
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/[\r\n]/g,"")
        .replace(/[ ]/g,"");
    },
    unescapeHTML(s) {
      s = "" + s;
      return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    }
  }
})

