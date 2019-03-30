(function (w, t) {
    return t(w)
})(window, function (c) {
    c.$s = {
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
            let __sTips = '<span style="display: none;padding: 5px 10px;font-size: 14px;color: #fff;background: #1f1f1f;opacity: .8;border-radius: 6px;position: fixed;top: 0;left: 0;" class="__sTips">' + o.text + '</span>'
            $('body').append(__sTips)
            let s = $('.__sTips')
            let w = s.css('width')
            let wz = s.css('padding-top')
            let q = s.css('height')
            let qz = s.css('padding-left')
            let t = Number(w.replace(/[px]/g, '')) + (Number(qz.replace(/[px]/g, '')) * 2)
            let tz = Number(q.replace(/[px]/g, '')) + (Number(wz.replace(/[px]/g, '')) * 2)
            if (o.position === 'top') {
                s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(10%)'})
            }
            if (o.position === 'center') {
                s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(50% - ' + tz / 2 + 'px)'})
            }
            if (o.position === 'bottom') {
                s.css({'left': 'calc(50% - ' + t / 2 + 'px)', 'top': 'calc(90%)'})
            }
            s.fadeIn(400)
            setTimeout(function () {
                s.fadeOut(400)
                setTimeout(function () {
                    s.remove()
                }, 410)
            }, o.time)
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
        tmpToHtml(name, f) {
            let domName = this.lave('$("' + name + '")')
            let dataList = this.lave(domName.attr('n-for'))
            let tmp = domName.html()
            let getKey = /\{{(.+?)\}}/g;
            let allKey = tmp.match(getKey)
            let str = ''
            for (let i = 0; i < dataList.length; i++) {
                let nowTmp = tmp
                for (let z = 0; z < allKey.length; z++) {
                    let a = "/" + allKey[z] + "/g";
                    -1 !== a.indexOf("+") && (a = a.split("+")[0] + "\\+" + a.split("+")[1]);
                    -1 !== a.indexOf("-") && (a = a.split("-")[0] + "\\-" + a.split("-")[1]);
                    -1 !== a.indexOf("*") && (a = a.split("*")[0] + "\\*" + a.split("*")[1]);
                    -1 !== a.indexOf("\\\\") && (a = a.split("\\")[0] + "\\\\" + a.split("\\")[1]);
                    -1 !== a.indexOf("?") && (a = a.split("?")[0] + "\\?+" + a.split("?")[1]);
                    -1 !== a.indexOf(":") && (a = a.split(":")[0] + "\\:" + a.split(":")[1]);
                    let b = this.lave(JSON.stringify(dataList[i]) + "." + allKey[z].replace(/[{}]/g, ""));
                    nowTmp = nowTmp.replace(this.lave(a), void 0 === b ? "" : b);
                }
                str += nowTmp
            }
            domName.html(str).show()
            if (f) {
                f()
            }
        },
        elSort(o) {
            let v = [], n = [], h = -1
            for (let i = 0; i < this.lave('$("'+ o.element +'")').find('li').length; i++) {
                v.push(this.lave('$("'+ o.element +'")').find('li').eq(i))
            }
            if(o['sort'].toLowerCase()==='down'){
                h = 1
            }
            v.sort((a, b) => {
                return (a.attr(o.sortData) * h) - (b.attr(o.sortData) * h)
            })
            for(let i = 0;i<v.length;i++){
                n.push(v[i][0].outerHTML)
            }
            if (o.success) {
                o.success(n)
                return
            }
            console.warn('没有找到回调函数')
        },
        upload (deploy) {
            let files = deploy.file;
            if (!files.length) return;
            this.picValue = files[0];
            this.imgPreview(deploy);
            // console.log(this.picValue)
        },
        imgPreview (deploy) {
            // console.log(deploy)
            let _THIS = this
            let file = deploy.file[0]
            //去获取拍照时的信息，解决拍出来的照片旋转问题
            EXIF.getData(file,function () {
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
                        }else {
                            img.onload = () => {
                                console.log(Orientation)
                                _THIS.compress(img,Orientation,deploy);
                            }
                        }
                    }
                }
            });
            // 看支持不支持FileReader
        },
        rotateImg (img, direction,canvas) {
            const min_step = 0;
            const max_step = 3;
            if (img == null)return;
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
        GzipPic(base,deploy){
            let _gRate = 0.65
            if(deploy.compress&&deploy.compress!==''){
                if(isNaN(deploy.compress*1)){
                    console.warn('压缩比率设置错误，将使用默认比率')
                }else {
                    _gRate = deploy.compress*1
                }
            }
            let Qcanvas= document.createElement("canvas");
            let Qctx = Qcanvas.getContext('2d');
            let QPic = new Image();
            QPic.src = base
            let _gFormat = 'image/jpeg'
            if(deploy.format&&deploy.format!==''){
                if(deploy.format.toLowerCase()==='png'){
                    _gFormat = 'image/'+deploy.format
                }
            }
            QPic.onload = () => {
                let width = QPic.width;
                let height = QPic.height;
                console.log(deploy)
                let ratio;
                if(deploy.maxWidth&&deploy.maxWidth!==''){
                    if(isNaN(deploy.maxWidth*1)){
                        console.error('图片压缩尺寸设置错误，将使用原图尺寸')
                    }else {
                        if(width>deploy.maxWidth){
                            width = deploy.maxWidth
                            ratio = deploy.maxWidth/QPic.width
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
        compress(img,Tags,deploy) {
            let gRate = 0.7
            if(deploy.compress&&deploy.compress!==''){
                if(isNaN(deploy.compress*1)){
                    console.error('压缩比率设置错误，将使用默认比率')
                }else {
                    gRate = deploy.compress*1
                }
            }
            let gFormat = 'image/jpeg'
            if(deploy.format&&deploy.format!==''){
                if(deploy.format.toLowerCase()==='png'){
                    gFormat = 'image/'+deploy.format
                }
            }
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext('2d');
            let width = img.width;
            let height = img.height;
            console.log(deploy)
            if(Tags.Orientation && Tags.Orientation !== 1){
                switch (Tags.Orientation) {
                    case 6:
                            this.rotateImg(img, 'left', canvas);
                            this.GzipPic(canvas.toDataURL(gFormat, .7),deploy)
                            break;
                        case 8:
                            this.rotateImg(img, 'right', canvas);
                            this.GzipPic(canvas.toDataURL(gFormat, .7),deploy)
                            break;
                        case 3:
                            this.rotateImg(img, 'right', canvas);//转两次
                            let xImg = img
                            xImg.src = canvas.toDataURL(gFormat, .7)
                            xImg.onload = () => {
                                this.rotateImg(xImg, 'right', canvas);
                                this.GzipPic(canvas.toDataURL(gFormat, 1),deploy)
                            }
                            return
                    }
            }else {
                let ratio;
                if(deploy.maxWidth&&deploy.maxWidth!==''){
                    if(isNaN(deploy.maxWidth*1)){
                        console.error('图片压缩尺寸设置错误，将使用原图尺寸')
                    }else {
                        if(width>deploy.maxWidth){
                            width = deploy.maxWidth
                            ratio = deploy.maxWidth/img.width
                            height *= ratio
                        }
                    }
                }else {
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
        lave(fn) {
            let Fn = Function;
            return new Fn('return ' + fn)();
        }
    }
})
