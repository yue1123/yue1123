window.onload = function(){
	var Input1 = document.getElementById("input1");
	var Input2 = document.getElementById("input2");
	var Input3 = document.getElementById("input3");
	var Input4 = document.getElementById("input4");
	var btn = document.getElementById("send");
	var a=0,b=0,c=0,d=0;
	var reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
	var reg2 = /^1[3|4|5|8][0-9]\d{4,8}$/;
	Input1.onchange = function (){
		value = Input1.value;
		if(value.length<=3){
			Input1.style.color = "#f00";
			a=0;
		}
		else{
			Input1.style.color = "#000";
			a=1;
		}
	}
	Input2.onchange = function(){
		value = Input2.value;
		if(!reg.test(value)){
			Input2.style.color = "#f00";
			b=0;
		}
		else{
			Input2.style.color = "#000";
			b=1;
		}
	}
	Input3.onchange = function(){
		value = Input3.value;
		if(!reg2.test(value)){
			Input3.style.color = "#f00";
			c=0;
		}
		else{
			Input3.style.color = "#000";
			c=1;
		}
	}
	Input4.onchange = function(){
		value = Input4.value;
		if(value.length<=10){
			alert("你的留言太短了,再多说一点吧");
			d=0;
		}
		else{
			d=1;
		}
	}
	//提交留言按钮功能
		btn.onclick = function (){
			var flag = a+b+c+d;
			if(flag==4){
				$("body").css({
					overflow: 'hidden'
				});
				$(".post-back-div").fadeIn(500);
				$(".mengban-div").fadeIn(500);
			}
			else{
				alert("你的信息有点不对,再更正一下吧");
			}
		}
}
