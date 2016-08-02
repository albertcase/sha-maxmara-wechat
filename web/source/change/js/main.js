var formstr = {//comfirm string
  temail:function(str){
      var temail = new RegExp("^[0-9a-zA-Z._-]+@[0-9a-zA-Z-]+\.[0-9a-zA-Z]+(\.[0-9a-zA-Z]+){0,1}$");
      if(temail.test(str)){
	return true;
      }
      return false;
  },
  tmenuname:function(str){/*检验按钮名称长度1-16(中文8位，英文16位)*/
      var byteLen = 0, len = str.length;
      if( !str ) return 0;
      for( var i=0; i<len; i++ )
	  byteLen += str.charCodeAt(i) > 255 ? 2 : 1;
      if( byteLen > 0&& byteLen <=16)
	    return true;
      return false;
  },
  turl:function(str){
      var tname = new RegExp("^.{1,1000}$");
      if(tname.test(str)){
	return true;
      }
      return false;
  },
  ttype:function(str){
    var tname = new RegExp("^.{1,50}$");
    if(tname.test(str)){
	if(str != "0")
	      return true;
      }
      return false;
  },
  tname:function(str){
    var tname = new RegExp("^.{1,20}$");
    if(tname.test(str)){
	return true;
      }
      return false;
  },
  tnonull:function(str){
    var tname = new RegExp("^.{1,50}$");
    if(tname.test(str)){
	return true;
      }
      return false;
  },
  tnonull2:function(str){
    var tname = new RegExp("^.{1,1000}$");
    if(tname.test(str)){
	return true;
      }
      return false;
  },
  tinfostr:function(str){
    var tname = new RegExp("^.{8,100}$");
    if(tname.test(str)){
	return true;
      }
      return false;
  },
  ttoken:function(str){
     var tname = new RegExp("^[0-9a-zA-Z]{3,32}$");
     if(tname.test(str)){
	return true;
      }
      return false;
  },
  tAesKey:function(str){
    var tname = new RegExp("^[0-9a-zA-Z]{43}$");
     if(tname.test(str)){
	return true;
      }
      return false;
  },
  tipstr:function(str,chk,tip){
    var t = formstr[chk](str);
    if(!t)
      popup.openwarning(tip);
    return t;
  },
  tipstrobj:function(obj,chk,tip){
    var str = obj.val();
    var t = formstr[chk](str);
    if(!t){
      popup.openwarning(tip);
      obj.parent().addClass("has-error");
    }
    return t;
  },
  tall:function(data){
    var la = data.length;
    var self = this;
    var a = true;
    for(var i='0'; i<la; i++){
      a = a && self.tipstr(data[i]["0"],data[i]["1"],data[i]["2"]);
    }
    return a;
  },
  tallobj:function(data){
    $(".has-error").each(function(){
      $(this).removeClass("has-error");
    });
    var la = data.length;
    var self = this;
    var a = true;
    for(var i='0'; i<la; i++){
      a = self.tipstrobj(data[i]["0"], data[i]["1"], data[i]["2"]) && a;
    }
    return a;
  }
}


var fileupload = {
  sendfiles:function(data, obj){
	var self=this;
  popup.openprogress();
	var formData = new FormData();
	var xhr = new XMLHttpRequest();
	formData.append("uploadfile",data);
	xhr.open ('POST',"/adminapi/uploadimage/");
	xhr.onload = function(event) {
    popup.closeprogress();
    if (xhr.status === 200) {
      var aa = JSON.parse(xhr.responseText);
      if(aa.code == '10'){
        fileupload.replaceinput(aa.path,obj);
        popup.openwarning('upload success');
        return true;
      }
      popup.openwarning(aa.msg);
    } else {
      popup.openwarning('upload error');
    }
  };
    xhr.upload.onprogress = self.updateProgress;
    xhr.send (formData);
  },
  updateProgress:function(event){
    if (event.lengthComputable){
        var percentComplete = event.loaded;
        var percentCompletea = event.total;
        var press = (percentComplete*100/percentCompletea).toFixed(2);//onprogress show
      	popup.goprogress(press);
    }
  },
  replaceinput:function(url ,obj){
    var a= '<i class="fa fa-times"></i><img src="'+url+'" style="width:200px;display:block;" class="newspic">';
    obj.after(a);
    obj.remove();
  },
  replaceimage:function(obj){
    var a = '<input type="file" name="uploadfile" class="newsfile">';
    obj.next().remove();
    obj.after(a);
    obj.remove();
  }
}

var popup = {
  warningshow : function(selector,text) {
    var self = this;
    var warning = $(document.createElement('div'));
    warning.addClass('warningbox').append(text);
    warning.prependTo($(selector)).hide().slideDown();
    warning.one('click', function() {
      self.warningautomove($(this));
    });
    self.warningclear(warning);
    return true;
  },
  warningautomove: function(obj) {
    obj.fadeOut(function(){
      this.remove();
    });
  },
  warningclear : function(element) {
    setTimeout(this.warningautomove, '3000', element);
  },
  openprogress:function(){
    $("#myprogress").show();
  },
  closeprogress:function(){
    $("#myprogress").hide();
  },
  goprogress:function(t){
    $("#myprogress .progress-bar").attr("aria-valuenow" ,t);
    $("#myprogress .progress-bar").css("width", t+"%");
    $("#myprogress .sr-only").text(t+"%");
  },
  openwarning:function(text){
    this.warningshow('#warningpopup',text);
  },
  opencomfirm:function(text,fun){
    var a = '<div>'+text+'</div>';
    a += '<div>';
    a += '<button type="button" onclick="popup.closecomfirm()" class="btn btn-default btn-sm">CANCEL</button>&nbsp;&nbsp;';
    a += '<button type="button" onclick="'+fun+'" class="btn btn-primary btn-sm">TRUE</button>';
    a += '</div>';
    $("#comfirmpopup > .comfirmpopup").html(a);
    $("#comfirmpopup").show();
  },
  closecomfirm:function(){
    $("#comfirmpopup>.comfirmpopu").empty();
    $("#comfirmpopup").hide();
  },
  openloading:function(){
    $("#loadingpopup").show();
  },
  closeloading:function(){
    $("#loadingpopup").hide();
  }
}


var htmlconetnt = {
  none:function(){
    var a = '';
    return a;
  },
  externalpage:function(){
    var a = '<br>';
    a += '<div class="form-group">';
    a += '<label>Redirect to:</label>';
    a += '<input class="form-control viewurl" placeholder="Enter Your Url" style="width:90%">';
    a += '</div>';
    return a;
  },
  aview:function(content){
    var a = '<br>';
    a += '<div class="form-group">';
    a += '<label>Redirect to:</label>';
    a += '<input class="form-control viewurl" placeholder="Enter Your Url" style="width:90%" value="'+content+'">';
    a += '</div>';
    return a;
  },
  pushmessage:function(){
    var a = '<br>';
        a += '<div class="newslist">';
        a += '<i class="fa fa-minus-square" style="color:red"></i>';
        a += '<div class="form-group">';
        a += '<label>Title:</label>';
        a += '<input class="form-control newstitle" placeholder="Enter TITLE" style="width:90%">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Description:</label>';
        a += '<input class="form-control newsdescription" placeholder="Enter Your Description" style="width:90%">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Link:</label>';
        a += '<input class="form-control newslink" placeholder="Enter Your Url" style="width:90%" name="link">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Cover:</label>';
        a += '<input type="file" name="uploadfile" class="newsfile">';
        a += '</div>';
        a += '<hr>';
        a += '</div>';
        a += '<i class="fa fa-plus-square" style="color:green"></i>';
    return a;
  },
  apushmessage:function(data){
    var la = data.length;
    var a = "<br>";
    for(var i = 0 ;i<la ;i++){
      a += '<div class="newslist">';
      a += '<i class="fa fa-minus-square" style="color:red"></i>';
      a += '<div class="form-group">';
      a += '<label>Title:</label>';
      a += '<input class="form-control newstitle" placeholder="Enter TITLE" style="width:90%" value="'+data[i]['Title']+'">';
      a += '</div>';
      a += '<div class="form-group">';
      a += '<label>Description:</label>';
      a += '<input class="form-control newsdescription" placeholder="Enter Your Description" style="width:90%" value="'+data[i]['Description']+'">';
      a += '</div>';
      a += '<div class="form-group">';
      a += '<label>Link:</label>';
      a += '<input class="form-control newslink" placeholder="Enter Your Url" style="width:90%" name="link" value="'+data[i]['Url']+'">';
      a += '</div>';
      a += '<div class="form-group">';
      a += '<label>Cover:</label>';
      a += '<i class="fa fa-times"></i><img src="'+data[i]['PicUrl']+'" style="width:200px;display:block;" class="newspic">';
      a += '</div>';
      a += '<hr>';
      a += '</div>';
    }
    if(la < 10){
      a += '<i class="fa fa-plus-square" style="color:green"></i>';
    }
    return a;
  },
  textmessage:function(){
      var a = '<br>';
        a += '<div class="form-group">';
        a += '<label>MESSAGE</label>';
        a += '<textarea class="form-control textcontent" rows="3"></textarea>';
        a += '</div>';
    return a;
  },
  atextmessage:function(conetnt){
      var a = '<br>';
        a += '<div class="form-group">';
        a += '<label>MESSAGE</label>';
        a += '<textarea class="form-control textcontent" rows="3">'+conetnt+'</textarea>';
        a += '</div>';
    return a;
  },
  addnewshtml:function(){
    var a = '<div class="newslist">';
        a += '<i class="fa fa-minus-square" style="color:red"></i>';
        a += '<div class="form-group">';
        a += '<label>Title:</label>';
        a += '<input class="form-control newstitle" placeholder="Enter TITLE" style="width:90%">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Description:</label>';
        a += '<input class="form-control newsdescription" placeholder="Enter Your Description" style="width:90%">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Link:</label>';
        a += '<input class="form-control newslink" placeholder="Enter Your Url" style="width:90%" name="link">';
        a += '</div>';
        a += '<div class="form-group">';
        a += '<label>Cover:</label>';
        a += '<input type="file" name="uploadfile" class="newsfile">';
        a += '</div>';
        a += '<hr>';
        a += '</div>';
        a += '<i class="fa fa-plus-square" style="color:green"></i>';
    return a;
  },
  tagkeyword:function(){
    var a = '<div class="form-group">';
        a += '<label>Keyword:</label>';
        a += '<i class="fa fa-minus-circle"></i>';
        a += '<input class="form-control inputkeyword" placeholder="Enter Keyword" style="width:80%">';
        a += '</div>';
    return a;
  },
  showtagkeyword:function(data){
    var la = data.length;
    var a = "";
    for(var i=0;i<la; i++){
      a += '<div class="form-group">';
      a += '<label>Keyword:</label>';
      a += '<i class="fa fa-minus-circle"></i>';
      a += '<input class="form-control inputkeyword" placeholder="Enter Keyword" style="width:80%" value="'+data[i]+'">';
      a += '</div>';
    }
    a +='<i class="fa fa-plus-circle"></i>';
    return a;
  },
  belongtohtml:function(data){
    var a = "";
    var la = data.length;
    for (var i in data){
      a += '<option value="'+i+'">'+data[i]+'</option>';
    }
    return a;
  }
}

var menu = {
  mbuttonfun:null,
  subbuttonfun:null,
  editbuttonfun:null,
  editinfo:null,
  delobj:null,
  showfeedback: function(obj){//add menu
    var self = this;
    var action = obj.attr('action');
    if($("#myModal ."+action+" div").length == 0)
      $("#myModal ."+action).html(htmlconetnt[action]());
    $("#myModal .menushow").removeClass("menushow");
    $("#myModal ."+action).addClass("menushow");
    self.mbuttonfun = "m"+action;
  },
  showfeedback2: function(obj){//add submenu
    var self = this;
    var action = obj.attr('action');
    if($("#submenu ."+action+" div").length == 0)
      $("#submenu ."+action).html(htmlconetnt[action]());
    $("#submenu .menushow").removeClass("menushow");
    $("#submenu ."+action).addClass("menushow");
    self.subbuttonfun = "sub"+action;
  },
  showfeedback3: function(obj){//add submenu
    var self = this;
    var action = obj.attr('action');
    if($("#editmenu ."+action+" div").length == 0)
      $("#editmenu ."+action).html(htmlconetnt[action]());
    $("#editmenu .menushow").removeClass("menushow");
    $("#editmenu ."+action).addClass("menushow");
    self.editbuttonfun = "edit"+action;
  },
  mnone:function(){
    var a={
      "buttonaddm[menuName]": $("#myModal .menuname").val(),
    };
    return a;
  },
  mexternalpage:function(){
    var a={
      "buttonaddm[menuName]": $("#myModal .menuname").val(),
      "buttonaddm[eventtype]": 'view',
      "buttonaddm[eventUrl]": $("#myModal .viewurl").val(),
    };
    return a;
  },
  mpushmessage:function(){
    var self = this;
    var key = new Date().getTime();
    var a = {
      "buttonaddm[menuName]": $("#myModal .menuname").val(),
      "buttonaddm[eventtype]": 'click',
      "buttonaddm[MsgType]": 'news',
      "buttonaddm[eventKey]": "e"+key,
      "buttonaddm[newslist]": self.getnewslist($("#myModal .pushmessage .newslist")),
    };
    return a;
  },
  getnewslist:function(obj){
    var a = [];
    var la = obj.length;
    obj.each(function(){
      var mself = $(this);
      var b = {};
      b = {
        "Title": mself.find(".newstitle").val(),
        "Description": mself.find(".newsdescription").val(),
        "Url": mself.find(".newslink").val(),
        "PicUrl": mself.find(".newspic").attr("src"),
      }
      a.push(b);
    });
    return JSON.stringify(a);
  },
  mtextmessage:function(){
    var key = new Date().getTime();
    var a={
      "buttonaddm[menuName]":$("#myModal .menuname").val(),
      "buttonaddm[eventtype]":'click',
      "buttonaddm[Content]": $("#myModal .textcontent").val(),
      "buttonaddm[MsgType]": 'text',
      "buttonaddm[eventKey]": "e"+key,
    };
    return a;
  },
  subnone:function(){
    var a={
      "buttonaddsub[menuName]": $("#submenu .menuname").val(),
      "buttonaddsub[mOrder]": $("#submenu .belongto").val(),
    };
    return a;
  },
  subexternalpage:function(){
    var a={
      "buttonaddsub[menuName]": $("#submenu .menuname").val(),
      "buttonaddsub[mOrder]": $("#submenu .belongto").val(),
      "buttonaddsub[eventtype]": 'view',
      "buttonaddsub[eventUrl]": $("#submenu .viewurl").val(),
    };
    return a;
  },
  subpushmessage:function(){
    var self = this;
    var key = new Date().getTime();
    var a = {
      "buttonaddsub[menuName]": $("#submenu .menuname").val(),
      "buttonaddsub[mOrder]": $("#submenu .belongto").val(),
      "buttonaddsub[eventtype]": 'click',
      "buttonaddsub[MsgType]": 'news',
      "buttonaddsub[eventKey]": "e"+key,
      "buttonaddsub[newslist]": self.getnewslist($("#submenu .pushmessage .newslist")),
    };
    return a;
  },
  subtextmessage:function(){
    var key = new Date().getTime();
    var a={
      "buttonaddsub[menuName]": $("#submenu .menuname").val(),
      "buttonaddsub[mOrder]": $("#submenu .belongto").val(),
      "buttonaddsub[eventtype]":'click',
      "buttonaddsub[Content]": $("#submenu .textcontent").val(),
      "buttonaddsub[MsgType]": 'text',
      "buttonaddsub[eventKey]": "e"+key,
    };
    return a;
  },
  editexternalpage:function(){
    var self = this;
    var a={
      "buttonupdate[id]": self.editinfo['id'],
      "buttonupdate[menuName]": $("#editmenu .menuname").val(),
      "buttonupdate[eventtype]": 'view',
      "buttonupdate[eventUrl]": $("#editmenu .viewurl").val(),
    };
    return a;
  },
  editpushmessage:function(){
    var key = new Date().getTime();
    var self = this;
    var a = {
      "buttonupdate[id]": self.editinfo['id'],
      "buttonupdate[menuName]": $("#editmenu .menuname").val(),
      "buttonupdate[eventtype]": 'click',
      "buttonupdate[MsgType]": 'news',
      "buttonupdate[eventKey]": "e"+key,
      "buttonupdate[newslist]": self.getnewslist($("#editmenu .pushmessage .newslist")),
    };
    return a;
  },
  edittextmessage:function(){
    var key = new Date().getTime();
    var self = this;
    var a={
      "buttonupdate[id]": self.editinfo['id'],
      "buttonupdate[menuName]": $("#editmenu .menuname").val(),
      "buttonupdate[eventtype]":'click',
      "buttonupdate[Content]": $("#editmenu .textcontent").val(),
      "buttonupdate[MsgType]": 'text',
      "buttonupdate[eventKey]": "e"+key,
    };
    return a;
  },
  editnone:function(){
    var self = this;
    var a={
      "buttonupdate[id]": self.editinfo['id'],
      "buttonupdate[menuName]": $("#editmenu .menuname").val(),
    };
    return a;
  },
  cleaninput:function(obj){
    $(obj+" input").each(function(){
      $(this).val("");
    });
    $(obj).find(".externalpage").html('');
    $(obj).find(".pushmessage").html('');
    $(obj).find(".textmessage").html('');
  },
  ajaxaddmbutton:function(){
    popup.openloading();
    var self = this;
    var up = menu[self.mbuttonfun]();
    $.ajax({
      type:'post',
      url: '/adminapi/addmbutton/',
      data: up,
      dataType:'json',
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          menu.cleaninput("#myModal");
          $('#myModal').modal('hide');
          popup.openwarning(data.msg);
          menu.ajaxreload();
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        menu.ajaxreload();
        popup.openwarning('unknow error');
      }
    });
  },
  ajaxaddsubbutton:function(){
    popup.openloading();
    var self = this;
    var up = menu[self.subbuttonfun]();
    $.ajax({
      type:'post',
      url: '/adminapi/addsubbutton/',
      data: up,
      dataType:'json',
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          menu.cleaninput("#submenu");
          $('#submenu').modal('hide');
          popup.openwarning(data.msg);
          menu.ajaxreload();
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow error');
      }
    });
  },
  ajaxreload:function(){
    $.ajax({
      type:"post",
      url: "/adminapi/getmenus/",
      dataType:"json",
      success: function(data){
        menu.buildtd(data['menus']);
      },
      error:function(){
        popup.openwarning('unknow error');
      },
    });
  },
  buildtd:function(data){
    var la = data.length;
    var a = "";
    for(var i=0 ;i<la ;i++){
      a += '<tr class="odd gradeX" menuid="'+data[i]['id']+'">';
      a += '<td>'+data[i]['menuName']+'</td>';
      a += '<td>'+data[i]['belongto']+'</td>';
      a += '<td>'+data[i]['eventtype']+'</td>';
      a += '<td class="center"><i class="fa fa-edit fa-lg"></i></td>';
      a += '<td class="center"><i class="fa fa-trash-o fa-lg"></i></td>';
      a +='</tr>';
    }
    $("#menutable tbody").html(a);
  },
  delbutton: function(){
    obj = this.delobj;
    var id = obj.parent().parent().attr('menuid');
    popup.openloading();
    $.ajax({
      type:'post',
      url: '/adminapi/deletebutton/',
      dataType:'json',
      data: {
          "buttondel[id]": id,
        },
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          popup.closecomfirm();
          menu.ajaxreload();
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow error');
      }
    });
  },
  publishmenu:function(){
    popup.openloading();
    $.ajax({
      url:"/adminapi/createmenu/",
      type:"post",
      dataType:'json',
      success:function(data){
        popup.closeloading();
        if(data.code == '10'){
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow errors');
      }
    });
  },
  ajaxgetmbuttom:function(){
    popup.openloading();
    $.ajax({
      url:"/adminapi/getmmenu/",
      type:"post",
      dataType:'json',
      success:function(data){
        popup.closeloading();
        if(data.code == '10'){
          $("#submenu .belongto").html(htmlconetnt.belongtohtml(data.menus));
          $('#submenu').modal('show');
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow errors');
      }
    });
  },
  ajaxgetbuttoninfo:function(id){
    popup.openloading();
    $.ajax({
      url:"/adminapi/getbuttoninfo/",
      type:"post",
      dataType:'json',
      data:{
        "buttoninfo[id]": id,
      },
      success:function(data){
        popup.closeloading();
        if(data.code == '10'){
          menu.editbutton(data['info']);
          $('#editmenu').modal('show');
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow errors');
      }
    });
  },
  editbutton:function(data){
    var self = this;
    self.editinfo = data;
    $("#editmenu .buttontype .active").removeClass("active");
    $('#editmenu .menuname').val(data['menuName']);
    $("#editmenu .menushow").removeClass("menushow");
    if(data['eventtype'] == 'view'){
      $("#editmenu .externalpage").addClass("menushow");
      $("#editmenu .buttontype .btn").eq(0).addClass("active");
      $("#editmenu .externalpage").html(htmlconetnt.aview(data['eventUrl']));
      self.editbuttonfun = "editexternalpage";
      return true;
    }
    if(data['eventtype'] == 'click'){
      if(data['buttonevent'].hasOwnProperty('newslist')){
        $("#editmenu .pushmessage").addClass("menushow");
        $("#editmenu .buttontype .btn").eq(1).addClass("active");
        $("#editmenu .pushmessage").html(htmlconetnt.apushmessage(data['buttonevent']['newslist']));
        self.editbuttonfun = "editpushmessage";
        return true;
      }
      if(data['buttonevent']['MsgType'] == 'text'){
        $("#editmenu .textmessage").addClass("menushow");
        $("#editmenu .buttontype .btn").eq(2).addClass("active");
        $("#editmenu .textmessage").html(htmlconetnt.atextmessage(data['buttonevent']['Content']));
        self.editbuttonfun = "edittextmessage";
        return true;
      }
    }
    self.editbuttonfun = "editnone";
  },
  ajaxupdatebutton:function(){
    popup.openloading();
    var self = this;
    var up = menu[self.editbuttonfun]();
    $.ajax({
      url: "/adminapi/updatebutton/",
      data: up,
      type:"post",
      dataType:'json',
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          menu.ajaxreload();
          menu.cleaninput("#editmenu");
          popup.openwarning(data.msg);
          $('#editmenu').modal('hide');
          return true;
        }
        popup.openwarning(data.msg);
      },
      error:function(){
        popup.closeloading();
        popup.openwarning('unknow errors');
      }
    });
  },
  onload: function(){
    var self = this;
    $("#myModal .buttontype .btn").click(function(){//add main menu 's submenu
      $("#myModal .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showfeedback($(this));
    });
    $("#menufun>.addmainmenu").click(function(){//add main menu
      if(!self.mbuttonfun)
        self.mbuttonfun = "mnone";
      $('#myModal').modal('show');
    });
    $("#menufun>.addsubmenu").click(function(){//add submenu ajax
      if(!self.subbuttonfun)
        self.subbuttonfun = "subnone";
      self.ajaxgetmbuttom();
    });
    $("#submenu .buttontype .btn").click(function(){//add main menu 's submenu
      $("#submenu .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showfeedback2($(this));
    });
    $("#editmenu .buttontype .btn").click(function(){//edit menu 's submenu
      $("#editmenu .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showfeedback3($(this));
    });
    $("#myModal .addmmenusubmit").click(function(){
      self.ajaxaddmbutton();
    });
    $("#menufun>.publish").click(function(){
      self.publishmenu();
    });
    $("#menutable").on("click", "tbody .fa-trash-o", function(){
      self.delobj = $(this);
      popup.opencomfirm("delete this menu???","menu.delbutton()");
    });
    $("#myModal").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#myModal").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#myModal .pushmessage .fa-minus-square").length >= 10)
        $("#myModal .pushmessage .fa-plus-square").remove();
    });
    $("#myModal").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#myModal").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
    $("#submenu").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#submenu").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#submenu .pushmessage .fa-minus-square").length >= 10)
        $("#submenu .pushmessage .fa-plus-square").remove();
    });
    $("#submenu").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#submenu").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
    $("#editmenu").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#editmenu").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#editmenu .pushmessage .fa-minus-square").length >= 10)
        $("#editmenu .pushmessage .fa-plus-square").remove();
    });
    $("#editmenu").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#editmenu").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
    $("#addsubmenusubmit").click(function(){
      self.ajaxaddsubbutton();
      // alert(self.subbuttonfun);
    });
    $("#menutable").on("click", "tbody .fa-edit", function(){
      var id = $(this).parent().parent().attr("menuid");
      self.ajaxgetbuttoninfo(id);
    });
    $("#savechange").click(function(){
      self.ajaxupdatebutton();
    });
  },
}

var keyword = {
  editinfo:null,
  addfun:null,
  editfun:null,
  cleanadd: function(){
    $("#addtagdiv .inputtagname").val('');
    var a = '<div class="form-group">';
        a += '<label>Key Word:</label>';
        a += '<i class="fa fa-minus-circle"></i>';
        a += '<input class="form-control inputkeyword" placeholder="Enter Key Word" style="width:80%">';
        a += '</div>';
        a += '<i class="fa fa-plus-circle"></i>';
    $("#addtagdiv .taglist").html(a);
    $("#addtagdiv .pushmessage").html(htmlconetnt['pushmessage']());
    $("#addtagdiv .textmessage").html(htmlconetnt['textmessage']());
  },
  gotolist:function(){
    $("#tagnav .active").removeClass("active");
    $("#tagnav li").eq(0).addClass("active");
    $("#tagmanage .navshow").removeClass("navshow");
    $("#taglist").addClass("navshow");
  },
  showaddedit: function(obj){
    var self = this;
    var action = obj.attr('action');
    if($("#addtagdiv ."+action+" div").length == 0)
      $("#addtagdiv ."+action).html(htmlconetnt[action]());
    $("#addtagdiv .menushow").removeClass("menushow");
    $("#addtagdiv ."+action).addClass("menushow");
    self.addfun = "a"+action;
  },
  showaddedit2: function(obj){
    var self = this;
    var action = obj.attr('action');
    if($("#tagkeyslist ."+action+" div").length == 0)
      $("#tagkeyslist ."+action).html(htmlconetnt[action]());
    $("#tagkeyslist .menushow").removeClass("menushow");
    $("#tagkeyslist ."+action).addClass("menushow");
    self.editfun = "e"+action;
  },
  apushmessage:function(){
    var self = this;
    var a = {
      "keywordadd[Tagname]": $("#addtagdiv .inputtagname").val(),
      "keywordadd[keywords]": self.getkeywords($("#addtagdiv .taglist .inputkeyword")),
      "keywordadd[MsgType]": 'news',
      "keywordadd[newslist]": menu.getnewslist($("#addtagdiv .pushmessage .newslist")),
    };
    return a;
  },
  atextmessage:function(){
    var self = this;
    var a={
      "keywordadd[Tagname]": $("#addtagdiv .inputtagname").val(),
      "keywordadd[keywords]": self.getkeywords($("#addtagdiv .taglist .inputkeyword")),
      "keywordadd[MsgType]": 'text',
      "keywordadd[Content]": $("#addtagdiv .textcontent").val(),
    };
    return a;
  },
  epushmessage:function(){
    var self = this;
    var a = {
      "keywordupdate[menuId]": self.editinfo['menuId'],
      "keywordupdate[Tagname]": $("#tagkeyslist .inputtagname").val(),
      "keywordupdate[keywords]": self.getkeywords($("#tagkeyslist .taglist .inputkeyword")),
      "keywordupdate[MsgType]": 'news',
      "keywordupdate[newslist]": menu.getnewslist($("#tagkeyslist .pushmessage .newslist")),
    };
    return a;
  },
  etextmessage:function(){
    var self = this;
    var a={
      "keywordupdate[menuId]": self.editinfo['menuId'],
      "keywordupdate[Tagname]": $("#tagkeyslist .inputtagname").val(),
      "keywordupdate[keywords]": self.getkeywords($("#tagkeyslist .taglist .inputkeyword")),
      "keywordupdate[MsgType]": 'text',
      "keywordupdate[Content]": $("#tagkeyslist .textcontent").val(),
    };
    return a;
  },
  getkeywords: function(obj){
    var keys = [];
    obj.each(function(){
      keys.push($(this).val());
    });
    return JSON.stringify(keys);
  },
  ajaxtaglist:function(){
    var self = this;
    popup.openloading();
    $.ajax({
      url:"/adminapi/getkeywordlist/",
      type:"post",
      dataType:'json',
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          $("#taglisttable tbody").html(keyword.buildtbody(data["list"]));
        }
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxdeltag: function(menuId){
    var self = this;
    popup.openloading();
    $.ajax({
      url:"/adminapi/keyworddel/",
      type:"post",
      dataType:'json',
      data:{
        'keyworddel[menuId]':menuId,
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          keyword.ajaxtaglist();
          return true
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  buildtbody: function(data){
    var la = data.length;
    var a = "";
    for(var i=0; i<la ;i++){
      a += '<tr class="odd gradeX" menuid="'+data[i]['menuId']+'">';
      a += '<td>'+data[i]['Tagname']+'</td>';
      a += '<td class="center"><i class="fa fa-edit fa-lg"></i></td>';
      a += '<td class="center"><i class="fa fa-trash-o fa-lg"></i></td>';
      a += '</tr>';
    }
    return a;
  },
  ajaxaddtag: function(){
    var self = this;
    popup.openloading();
    var up = keyword[self.addfun]();
    $.ajax({
      url:"/adminapi/keywordadd/",
      type:"post",
      dataType:'json',
      data: up,
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          keyword.ajaxtaglist();
          keyword.cleanadd();
          keyword.gotolist();
        }
        popup.openwarning(data.msg);
        return true;
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxtaginfo:function(menuId){
    var self = this;
    popup.openloading();
    $.ajax({
      url:"/adminapi/getkeywordinfo/",
      type:"post",
      dataType:'json',
      data:{
        'keywordinfo[menuId]':menuId,
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          keyword.buildtaginfo(data.info);
          $("#tagmanagepanel .navshow").removeClass("navshow");
          $("#tagkeyslist").addClass("navshow");
          return true
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  buildtaginfo: function(data){
    var self = this;
    self.editinfo = data;
    $("#tagkeyslist .taglist").html(htmlconetnt.showtagkeyword(data.getContent));
    $("#tagkeyslist .inputtagname").val(data.Tagname);
    $("#tagkeyslist .buttontype .active").removeClass("active");
    $("#tagkeyslist .menushow").removeClass("menushow");
    if(data.MsgType == "text"){
      $("#tagkeyslist .buttontype .btn").eq(0).addClass("active");
      $("#tagkeyslist .textmessage").addClass("menushow");
      self.editfun = "etextmessage";
      $("#tagkeyslist .textmessage").html(htmlconetnt.atextmessage(data.Content));
      return true;
    }
    if(data.MsgType == "news"){
      $("#tagkeyslist .buttontype .btn").eq(1).addClass("active");
      $("#tagkeyslist .pushmessage").addClass("menushow");
      self.editfun = "epushmessage";
      $("#tagkeyslist .pushmessage").html(htmlconetnt.apushmessage(data.newslist));
      return true;
    }
  },
  keywordupdate:function(){
    var self = this;
    popup.openloading();
    var up = keyword[self.editfun]();
    $.ajax({
      url:"/adminapi/keywordupdate/",
      type:"post",
      dataType:'json',
      data: up,
      success:function(data){
        popup.closeloading();
        if(data.code == "10"){
          keyword.ajaxtaglist();
          keyword.gotolist();
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  onload: function(){
    var self = this;
    $("#addtagdiv .buttontype .btn").click(function(){//add event 's submenu
      $("#addtagdiv .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showaddedit($(this));
    });
    $("#tagnav .message").click(function(){
      $("#tagmanage .active").removeClass("active");
      $(this).parent().addClass("active");
      $("#tagmanage .navshow").removeClass("navshow");
      var active = $(this).attr("active");
      $("#"+active).addClass("navshow");
    });
    $("#addtagdiv .taglist").on("click",".fa-plus-circle", function(){
      $(this).before(htmlconetnt.tagkeyword);
    });
    $("#addtagdiv .taglist").on("click",".fa-minus-circle", function(){
      $(this).parent().remove();
    });
//add tag message
    $("#addtagdiv").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#addtagdiv").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#addtagdiv .pushmessage .fa-minus-square").length >= 10)
        $("#addtagdiv .pushmessage .fa-plus-square").remove();
    });
    $("#addtagdiv").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#addtagdiv").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
//add tag message end
// edit tag
    $("#tagkeyslist").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#tagkeyslist").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#tagkeyslist .pushmessage .fa-minus-square").length >= 10)
        $("#tagkeyslist .pushmessage .fa-plus-square").remove();
    });
    $("#tagkeyslist").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#tagkeyslist").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
    $("#tagkeyslist .taglist").on("click",".fa-plus-circle", function(){
      $(this).before(htmlconetnt.tagkeyword);
    });
    $("#tagkeyslist .taglist").on("click",".fa-minus-circle", function(){
      $(this).parent().remove();
    });
    $("#tagkeyslist .buttontype .btn").click(function(){//add event 's submenu
      $("#tagkeyslist .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showaddedit2($(this));
    });
// edit tag end
    $("#addtagsubmit").click(function(){
      self.ajaxaddtag();
    });
    $("#taglisttable").on("click", "tbody .fa-trash-o", function(){
      var menuId = $(this).parent().parent().attr("menuid");
      self.ajaxdeltag(menuId);
    });
    $("#tagkeyslist .panel-heading .fa-mail-reply").click(function(){
      $("#tagmanagepanel .navshow").removeClass("navshow");
      $("#taglist").addClass("navshow");
    });
    $("#taglist").on("click", "tbody .fa-edit", function(){
      var menuId = $(this).parent().parent().attr("menuid");
      self.ajaxtaginfo(menuId);
    });
    $("#tagchangesubmit").click(function(){
      self.keywordupdate();
    });
  }
}

var autoreplay = {
  welcomefun:null,
  defaultfun:null,
  navactive:null,
  getEvent:null,
  showwelcome: function(obj){
    var self = this;
    var action = obj.attr('action');
    if($("#welcomemessage ."+action+" div").length == 0)
      $("#welcomemessage ."+action).html(htmlconetnt[action]());
    $("#welcomemessage .menushow").removeClass("menushow");
    $("#welcomemessage ."+action).addClass("menushow");
    self.welcomefun = "w"+action;
  },
  showdefault:function(obj){
    var self = this;
    var action = obj.attr('action');
    if($("#defaultmessage ."+action+" div").length == 0)
      $("#defaultmessage ."+action).html(htmlconetnt[action]());
    $("#defaultmessage .menushow").removeClass("menushow");
    $("#defaultmessage ."+action).addClass("menushow");
    self.defaultfun = "d"+action;
  },
  wpushmessage:function(){
    var self = this;
    var a = {
      "autoreply[getMsgType]": "event",
      "autoreply[getEvent]": "subscribe",
      "autoreply[MsgType]": 'news',
      "autoreply[newslist]": menu.getnewslist($("#welcomemessage .pushmessage .newslist")),
    };
    return a;
  },
  wtextmessage:function(){
    var self = this;
    var a={
      "autoreply[getMsgType]": "event",
      "autoreply[getEvent]": "subscribe",
      "autoreply[MsgType]": 'text',
      "autoreply[Content]": $("#welcomemessage .textcontent").val(),
    };
    return a;
  },
  dpushmessage:function(){
    var self = this;
    var a = {
      "autoreply[getMsgType]": "event",
      "autoreply[getEvent]": "defaultback",
      "autoreply[MsgType]": 'news',
      "autoreply[newslist]": menu.getnewslist($("#defaultmessage .pushmessage .newslist")),
    };
    return a;
  },
  dtextmessage:function(){
    var self = this;
    var a={
      "autoreply[getMsgType]": "event",
      "autoreply[getEvent]": "defaultback",
      "autoreply[MsgType]": 'text',
      "autoreply[Content]": $("#defaultmessage .textcontent").val(),
    };
    return a;
  },
  ajaxwecomeup:function(){
    popup.openloading();
    var self = this;
    var up = autoreplay[self.welcomefun]();
    $.ajax({
      url: "/adminapi/autoreply/",
      type:"post",
      dataType:'json',
      data: up,
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxdefaultup:function(){
    popup.openloading();
    var self = this;
    var up = autoreplay[self.defaultfun]();
    $.ajax({
      url: "/adminapi/autoreply/",
      type:"post",
      dataType:'json',
      data: up,
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxautoreply:function(getEvent){
    popup.openloading();
    var self = this;
    $.ajax({
      url: "/adminapi/autoreplyinfo/",
      type:"post",
      dataType:'json',
      data: {
        "autoreplyload[getEvent]": getEvent,
      },
      success: function(data){
        $("#"+autoreplay.navactive).addClass("navshow");
        popup.closeloading();
        if(data.code == '10'){
          autoreplay.buildMsg(data.info);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  buildMsg: function(data){
    var self = this;
    if(data.MsgType == "text"){
      if(self.navactive == "defaultmessage")
        autoreplay.defaultfun = "dtextmessage";
      if(self.navactive == "welcomemessage")
        autoreplay.welcomefun = "wtextmessage";
      $("#"+self.navactive+" .buttontype .btn").eq(0).addClass("active");
      $("#"+self.navactive+" .textmessage").addClass("menushow");
      $("#"+self.navactive+" .textmessage").html(htmlconetnt.atextmessage(data.MsgData.Content));
      return true;
    }
    if(data.MsgType == "news"){
      if(self.navactive = "defaultmessage")
        autoreplay.defaultfun = "dpushmessage";
      if(self.navactive == "welcomemessage")
        autoreplay.welcomefun = "wpushmessage";
      $("#"+self.navactive+" .buttontype .btn").eq(1).addClass("active");
      $("#"+self.navactive+" .pushmessage").addClass("menushow");
      $("#"+self.navactive+" .pushmessage").html(htmlconetnt.apushmessage(data.MsgData.Articles));
      return true;
    }
  },
  ajaxreplydel:function(getEvent){
    popup.openloading();
    var self = this;
    $.ajax({
      url: "/adminapi/autoreplydel/",
      type:"post",
      dataType:'json',
      data: {
        "autoreplydel[getEvent]": getEvent,
        "autoreplydel[getMsgType]": 'event',
      },
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          autoreplay.cleanMsg($("#"+autoreplay.navactive));
          autoreplay.ajaxautoreply(autoreplay.getEvent);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  cleanMsg: function(obj){
    obj.find(".pushmessage").html('');
    obj.find(".textmessage").html('');
  },
  onload: function(){
    var self = this;
    $("#autoreplaynav .message").click(function(){
      $("#autoreplaynav .active").removeClass("active");
      $(this).parent().addClass("active");
      $("#autoreload .navshow").removeClass("navshow");
      var active = $(this).attr("active");
      self.getEvent = $(this).attr("getEvent");
      self.navactive = active;
      self.cleanMsg($("#"+active));
      self.ajaxautoreply(self.getEvent);
    });
    $("#welcomemessage .buttontype>.btn").click(function(){
      $("#welcomemessage .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showwelcome($(this));
    });
    $("#defaultmessage .buttontype>.btn").click(function(){
      $("#defaultmessage .buttontype .active").removeClass("active");
      $(this).addClass("active");
      self.showdefault($(this));
    });
    $("#welcomemessage .savebutton").click(function(){
      self.ajaxwecomeup();
    });
    $("#defaultmessage .savebutton").click(function(){
      self.ajaxdefaultup();
    });
    $("#welcomemessage .welcomedel").click(function(){
      self.ajaxreplydel('subscribe');
    });
    $("#defaultmessage .defaultdel").click(function(){
      self.ajaxreplydel('defaultback');
    });
// welcome msg
    $("#welcomemessage").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#welcomemessage").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#welcomemessage .pushmessage .fa-minus-square").length >= 10)
        $("#welcomemessage .pushmessage .fa-plus-square").remove();
    });
    $("#welcomemessage").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#welcomemessage").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
// welcome msg end
// default msg
    $("#defaultmessage").on("click",".fa-minus-square", function(){
      $(this).parent().remove();
    });
    $("#defaultmessage").on("click",".fa-plus-square", function(){
      var a = htmlconetnt.addnewshtml();
      $(this).after(a);
      $(this).remove();
      if($("#defaultmessage .pushmessage .fa-minus-square").length >= 10)
        $("#defaultmessage .pushmessage .fa-plus-square").remove();
    });
    $("#defaultmessage").on("change", ".newsfile", function(){
      fileupload.sendfiles($(this)[0].files[0], $(this));
    });
    $("#defaultmessage").on("click",".fa-times",function(){
      fileupload.replaceimage($(this));
    });
// default msg end
  }
}

var preference = {
  editinfo:null,
  ajaxchangpwd:function(){
    var test = [
      [$("#changepwd .oldpassword"), "tnonull", "the oldpassword is empty"],
      [$("#changepwd .newpassword"), "tnonull", "the newpassword is empty"],
      [$("#changepwd .newpassword2"), "tnonull", "the repeat password is empty"],
    ];
    if(!formstr.tallobj(test))
      return false;
    if($("#changepwd .newpassword").val() !== $("#changepwd .newpassword2").val()){
      popup.openwarning('the repeat password error');
      return false;
    }
    popup.openloading();
    $.ajax({
      url: "/adminapi/changepwd/",
      type:"post",
      dataType:'json',
      data:{
        "changepwd[oldpassword]": $("#changepwd .oldpassword").val(),
        "changepwd[newpassword]": $("#changepwd .newpassword2").val(),
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          preference.cleanpsw();
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxadduser: function(){
    var test = [
      [$("#adduserbox .username"), "tnonull", "the username is empty"],
      [$("#adduserbox .newpassword"), "tnonull", "the password is empty"],
      [$("#adduserbox .newpassword2"), "tnonull", "the repeat password is empty"],
    ];
    if(!formstr.tallobj(test))
      return false;
    if($("#adduserbox .newpassword").val() !== $("#adduserbox .newpassword2").val()){
      popup.openwarning('the repeat password error');
      return false;
    }
    popup.openloading();
    $.ajax({
      url: "/adminapi/creatadmin/",
      type:"post",
      dataType:'json',
      data:{
        "adminadd[username]": $("#adduserbox .username").val(),
        "adminadd[password]": $("#adduserbox .newpassword2").val(),
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          $("#adduserbox").modal('hide');
          preference.ajaxgetadmins();
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxdeluser: function(userid){
    popup.openloading();
    $.ajax({
      url: "/adminapi/userdel/",
      type:"post",
      dataType:'json',
      data:{
        "admindel[id]": userid,
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          preference.ajaxgetadmins();
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxgetadmins:function(){
    popup.openloading();
    $.ajax({
      url: "/adminapi/getadmins/",
      type:"post",
      dataType:'json',
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          $("#usertables tbody").html(preference.buildtbody(data.list));
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  getadmininfo:function(userid){
    popup.openloading();
    $.ajax({
      url: "/adminapi/getadminerinfo/",
      type:"post",
      dataType:'json',
      data:{
        "admininfo[id]": userid,
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          preference.editinfo = data.info;
          $("#edituserbox .adminname").text(data.info.username);
          $("#edituserbox").modal('show');
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  adminchangepwd: function(){
    var test = [
      [$("#edituserbox .newpassword"), "tnonull", "the password is empty"],
      [$("#edituserbox .newpassword2"), "tnonull", "the repeat password is empty"],
    ];
    if(!formstr.tallobj(test))
      return false;
    if($("#edituserbox .newpassword").val() !== $("#edituserbox .newpassword2").val()){
      popup.openwarning('the repeat password error');
      return false;
    }
    popup.openloading();
    $.ajax({
      url: "/adminapi/admincpw/",
      type:"post",
      dataType:'json',
      data:{
        "admincpw[id]": preference.editinfo["id"],
        "admincpw[newpassword]": $("#edituserbox .newpassword2").val(),
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          $("#edituserbox").modal('hide');
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  buildtbody: function(data){
    var la = data.length;
    var a="";
    for(var i="0"; i<la; i++){
      a += '<tr class="odd gradeX" userid="'+data[i]['id']+'">';
      a += '<td>'+data[i]['username']+'</td>';
      a += '<td>'+data[i]['latestTime']+'</td>';
      a += '<td class="center"><i class="fa fa-edit fa-lg"></i></td>';
      a += '<td class="center"><i class="fa fa-trash-o fa-lg"></i></td>';
      a += '</tr>';
    }
    return a;
  },
  cleanpsw:function(){
    $("#changepwd .oldpassword").val('');
    $("#changepwd .newpassword2").val('');
    $("#changepwd .newpassword").val('');
  },
  cleanadduser: function(){
    $("#adduserbox .username").val('');
    $("#adduserbox .newpassword2").val('');
    $("#adduserbox .newpassword").val('');
  },
  cleanadmincpw: function(){
    $("#edituserbox .newpassword2").val('');
    $("#edituserbox .newpassword").val('');
  },
  onload: function(){
    var self = this;
    $("#preferencenav .message").click(function(){
      $("#preferencenav .active").removeClass("active");
      $(this).parent().addClass("active");
      $("#preference .navshow").removeClass("navshow");
      var active = $(this).attr("active");
      $("#"+active).addClass("navshow");
    });
    $("#changepwd .save").click(function(){
      self.ajaxchangpwd();
    });
    $("#menufun .adduser").click(function(){
      self.cleanadduser();
      $("#adduserbox").modal('show');
    });
    $("#adduserbox .addusersubmit").click(function(){
      self.ajaxadduser();
    });
    $("#usermanage").on("click", "tbody .fa-trash-o", function(){ //delete user
      var userid = $(this).parent().parent().attr("userid");
      self.ajaxdeluser(userid);
    });
    $("#usermanage").on("click", "tbody .fa-edit", function(){ //edit user
      var userid = $(this).parent().parent().attr("userid");
      self.cleanadmincpw();
      self.getadmininfo(userid);
    });
    $("#edituserbox .changepwdsubmit").click(function(){
      self.adminchangepwd();
    });
  }
}

var webpage = {
  editpageid:null,
  cleaninput:function(){
    $("#addpage .pagename").val('');
    $("#addpage .pagetitle").val('');
    CKEDITOR.instances.editor1.setData('');
  },
  ajaxarticleup:function(){
    var test = [
      [$("#addpage .pagename"), "tnonull", "the pagename is empty"],
      [$("#addpage .pagetitle"), "tnonull", "the pagetitle is empty"],
    ];
    if(!formstr.tallobj(test))
      return false;
    popup.openloading();
    $.ajax({
      url: "/adminapi/articleadd/",
      type:"post",
      dataType:'json',
      data:{
        "articleadd[pagename]": $("#addpage .pagename").val(),
        "articleadd[pagetitle]": $("#addpage .pagetitle").val(),
        "articleadd[content]": CKEDITOR.instances.editor1.getData(),
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          webpage.cleaninput();
          webpage.ajaxpagelist();
          webpage.gotolist();
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  ajaxdelarticle: function(pageid){
    popup.openloading();
    $.ajax({
      url: "/adminapi/deletearticle/",
      type:"post",
      dataType:'json',
      data:{
        "articledel[pageid]": pageid,
      },
      success: function(data){
        popup.closeloading();
        if(data.code == '10'){
          popup.openwarning(data.msg);
          webpage.ajaxpagelist();
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  gotolist:function(){
    $("#pagmanagenav .active").removeClass("active");
    $("#pagmanagenav li").eq(0).addClass("active");
    $("#pagmanage .navshow").removeClass("navshow");
    $("#pagelist").addClass("navshow");
  },
  ajaxpagelist:function(){
    popup.openloading();
    $.ajax({
      url: "/outapi/articlelist/",
      type:"post",
      dataType:'json',
      success:function(data){
        popup.closeloading();
        if(data.code == "10"){
          $("#pagelisttable tbody").html(webpage.buildlist(data['list']));
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  buildlist: function(data){
    var la = data.length;
    var a = "";
    for(var i = 0;i<la ;i++){
      a += '<tr class="odd gradeX" pageid="'+data[i]['pageid']+'">';
      a += '<td>'+data[i]['pagename']+'</td>';
      a += '<td>'+data[i]['pagetitle']+'</td>';
      a += '<th><a target="_blank" href="/article/'+data[i]['pageid']+'">'+pagecode.hosts+'/article/'+data[i]['pageid']+'</a></th>';
      a += '<td>'+data[i]['submiter']+'</td>';
      a += '<td>'+data[i]['edittime']+'</td>';
      a += '<td class="center"><i class="fa fa-edit fa-lg"></i></td>';
      a += '<td class="center"><i class="fa fa-trash-o fa-lg"></i></td>';
      a += '</tr>';
    }
    return a;
  },
  getarticle: function(pageid){
    popup.openloading();
    $.ajax({
      url: "/outapi/getarticle/",
      type:"post",
      dataType:'json',
      data:{
        "articleinfo[pageid]": pageid,
      },
      success:function(data){
        popup.closeloading();
        if(data.code == "10"){
          webpage.editpageid = data.article.pageid;
          $("#editpage .pagename").val(data.article.pagename);
          $("#editpage .pagetitle").val(data.article.pagetitle);
          CKEDITOR.instances.editor2.setData(data.article.content);
          $("#pagmanage .navshow").removeClass("navshow");
          $("#editpage").addClass("navshow");
          return true;
        }
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  updatearticle:function(){
    var test = [
      [$("#editpage .pagename"), "tnonull", "the pagename is empty"],
      [$("#editpage .pagetitle"), "tnonull", "the pagetitle is empty"],
    ];
    if(!formstr.tallobj(test))
      return false;
    popup.openloading();
    $.ajax({
      url: "/adminapi/editarticle/",
      type:"post",
      dataType:'json',
      data:{
        "articleedit[pageid]": webpage.editpageid,
        "articleedit[pagename]":$("#editpage .pagename").val(),
        "articleedit[pagetitle]":$("#editpage .pagetitle").val(),
        "articleedit[content]":CKEDITOR.instances.editor2.getData(),
      },
      success: function(data){
        popup.closeloading();
        if(data.code == "10"){
          webpage.ajaxpagelist();
          webpage.gotolist();
          popup.openwarning(data.msg);
          return true;
        }
        popup.openwarning(data.msg);
      },
      error: function(){
        popup.closeloading();
        popup.openwarning("unknow error");
      }
    });
  },
  onload: function(){
    var self = this;
    $("#pagmanagenav .message").click(function(){
      $("#pagmanagenav .active").removeClass("active");
      $(this).parent().addClass("active");
      $("#pagmanage .navshow").removeClass("navshow");
      var active = $(this).attr("active");
      $("#"+active).addClass("navshow");
    });
    $("#articlesubmit").click(function(){
      self.ajaxarticleup();
    });
    $("#pagelist").on("click","tbody .fa-trash-o" ,function(){
      var pageid = $(this).parent().parent().attr("pageid");
      self.ajaxdelarticle(pageid);
    });
    $("#pagelist").on("click","tbody .fa-edit" ,function(){
      var pageid = $(this).parent().parent().attr("pageid");
      self.getarticle(pageid);
    });
    $("#editpagesubmit").click(function(){
      self.updatearticle();
    });
    $("#editpage .fa-mail-reply").click(function(){
      webpage.gotolist();
    });
  }
}

$(function(){
  menu.onload();
  keyword.onload();
  autoreplay.onload();
  preference.onload();
  webpage.onload();
});
