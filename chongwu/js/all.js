var x=0;
$(function() {
	//	var w = screen.width;
	//	$("body").width(w-17);//控制body宽度
	$(".sousuo-list").hide();
	$("#sousuo").click(function() {
		$(".sousuo-list").toggle(); //搜索栏下拉菜单的切换显示
	});
	$(".a").click(function() {
		$("#sousuo").val(this.innerText); //快捷输入内容到输入框
		$(".sousuo-list").hide();
	});
	//单机切换图片
	$("#last").click(function demo1() {
		var left = parseInt(($("#move-div").css("margin-left")).split("px")[0]);
		if (left < 0) {
			$("#move-div").animate({
				marginLeft: '+=223px',
			}, 500);
		} else {
			$("#move-div").animate({
				marginLeft: '-=223px',
			}, 500);
		}
	})
	$("#next").click(function demo2() {
		var left = parseInt(($("#move-div").css("margin-left")).split("px")[0]);
		if (left > -446) {
			$("#move-div").animate({
				marginLeft: '-=223px',
			}, 500);
		} else {
			$("#move-div").animate({
				marginLeft: '+=223px',
			}, 500);
		}
	})
	//按钮跳转
	$(".btn-contact").click(function() {
		window.location.href = "contact.html";
	})
	$("#kinds").click(function() {
		window.location.href = "kinds.html";
	})
	//
	$(".btn-top").hide();
	$(window).scroll(function() {
		if ($(window).scrollTop() > 150) {
			$(".btn-top").fadeIn(500);
		} else {
			$(".btn-top").fadeOut(500);
		}
	})
	$(".btn-top").click(function() {
		$("body,html").animate({
			scrollTop: 0
		}, 500);
	})
	//关闭回执信息窗口
	$(".close").click(function() {
		$("body").css({
			overflow: 'auto'
		});
		$(".post-back-div").fadeOut(300);
		$(".mengban-div").fadeOut(300);
	})
	//宠物品种列表样式
	var list_index = 0;
	$(".kinds-text-div .kinds-text-div-list").each(function() {
		list_index++;
		if (list_index % 2 == 0) {
			$(this).children(".text1").css("float", "right");
			$(this).children(".text2").css("float", "left");
		} else {
			$(this).children(".text1").css("float", "left");
			$(this).children(".text2").css("float", "right");
		}
	})

	//搜素加载页面
	$(".sou_btn").click(function() {
		form_1();
	})
	
	//宠物展示轮播图
	neirong();
	//验证
})

//获取表单参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");//用正则匹配相应参数名称
	var r = window.location.search.substr(1).match(reg);//根据名称的位置查找值
	console.log(r);
	if (r != null) return decodeURIComponent(r[2]);//使用decodeURIComponent解码URL中的值,并返回解码后的值，他的编码方法为encodeURIComponent
	return null;
}
//
function neirong() {
	var y = 0,//控制循环次数
		x = 0;//移动的长度
	setInterval(function() {
		if (y < ($(".neirong .text-div2").length - 2) / 2) {
			y++
		} else {
			y = 0;
		}
		x = y * 988.46;
		$(".neirong").animate({
			margin: '0 0 0 -' + x + 'px'
		})

		$(".text .ul ul").children().css("background", " #ccc")
		$(".text .ul ul li").eq(y).css("background", " #7C4C4C");
	}, 3000)
}
