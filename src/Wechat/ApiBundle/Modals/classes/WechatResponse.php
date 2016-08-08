<?php

namespace Wechat\ApiBundle\Modals\classes;
use Wechat\ApiBundle\Modals\Database\dataSql;
use Wechat\ApiBundle\Modals\classes\WechatMsg;

class WechatResponse{

  private $postStr = null;
  private $postObj = null;
  private $fromUsername = null;
  private $toUsername = null;
  private $msgType = null;
  private $dataSql;
  private $container;

  public function __construct($postStr, $container){
    $this->postStr = $postStr;
    $this->postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
    $this->msgType = strtolower($this->postObj->MsgType);
    $this->fromUsername = trim($this->postObj->FromUserName);
    $this->toUsername = $this->postObj->ToUserName;
    $this->container = $container;
    $this->dataSql = $container->get('my.dataSql');
  }

  public function RequestFeedback(){
    if(method_exists($this, $this->msgType.'Request')){
      $backxml =  call_user_func_array(array($this, $this->msgType.'Request'), array());
    }
    if($backxml)
        return $backxml;
    return $this->defaultfeedback();
  }

  public function msgResponse($rs){
    if(!isset($rs[0]['MsgType']))
      return false;
    $WechatMsg = new WechatMsg($this->fromUsername, $this->toUsername);
    return $WechatMsg->sendMsgxml($rs);
  }
//request functions start
  public function textRequest(){
    $tempmsg = $this->dotempevent($this->postObj->Content);//temp listener
    if($tempmsg)
      return $tempmsg;
    $rs = $this->dataSql->textField($this->postObj->Content);
    if(is_array($rs) && count($rs)> 0 ){
      return $this->msgResponse($rs);
    }
    return "";
  }

  private function sendMsgForText($fromUsername, $toUsername, $time, $msgType, $contentStr)
  {
    $textTpl = "<xml>
          <ToUserName><![CDATA[%s]]></ToUserName>
          <FromUserName><![CDATA[%s]]></FromUserName>
          <CreateTime>%s</CreateTime>
          <MsgType><![CDATA[%s]]></MsgType>
          <Content><![CDATA[%s]]></Content>
          <FuncFlag>0</FuncFlag>
          </xml>";
    return sprintf($textTpl, $fromUsername, $toUsername, $time, $msgType, $contentStr);
  }

  public function imageRequest(){
    return "";
  }

  public function voiceRequest(){
    return "";
  }

  public function videoRequest(){
    return "";
  }

  public function shortvideoRequest(){
    return "";
  }

  public function locationRequest(){
    // return "";
    return $this->sendMsgForText($this->fromUsername, $this->toUsername, time(), 'text', $this->fromUsername);
  }

  public function linkRequest(){
    return "";
  }

  public function eventRequest(){
    $event = strtolower($this->postObj->Event);
    if(method_exists($this, $event.'Event')){
      return call_user_func_array(array($this, $event.'Event'), array());
    }
    return "";
  }
//request function end

//event function start
  public function subscribeEvent(){
    $rs = $this->dataSql->subscribeField();
    if(is_array($rs) && count($rs)> 0 ){
      return $this->msgResponse($rs);
    }
    return "";
  }

  public function scanEvent(){
    return "";
  }

  public function locationEvent(){
    return "";
  }

  public function clickEvent(){
    $eventKey = $this->postObj->EventKey;
    $rs = $this->dataSql->clickField($eventKey);
    if(is_array($rs) && count($rs)> 0 ){
      return $this->msgResponse($rs);
    }
    return "";
  }

  public function viewEvent(){
    return "";
  }

//event function end
  public function systemLog(){
    $this->dataSql->systemLog($this->postStr, $this->fromUsername, $this->msgType);
  }

  public function comfirmkeycode($msgType){

  }

  public function defaultfeedback(){
    $rs = $this->dataSql->defaultField();
    if(is_array($rs) && count($rs)> 0 ){
      return $this->msgResponse($rs);
    }
    return "";
  }

// goto temp event
  public function dotempevent($tempid){
    $redis = $this->container->get('my.RedisLogic');
    if($redis->checkString('wechattemplistener')){
      $temp = json_decode($redis->getString('wechattemplistener'), true);
      if($temp['tempid'] == $tempid){
        if(method_exists($this, $temp['eventname'].'Tempevent')){
          return call_user_func_array(array($this,  $temp['eventname'].'Tempevent'), array($temp));
        }
      }
    }
    return "";
  }
// Temp Events
  public function sendpreviewnewsTempevent($temp){
    $redis = $this->container->get('my.RedisLogic');
    $tempid = mt_rand(0,9).mt_rand(0,9).mt_rand(0,9).mt_rand(0,9).mt_rand(0,9).mt_rand(0,9);
    $data = array(
      'groupname' => $temp['groupname'],
      'grouptagid' => $temp['grouptagid'],
      'mediaid' => $temp['mediaid'],
      'tempid' => $tempid,
      'eventname' => 'tagnewssend',
      'fromopenid' => $this->fromUsername,
    );
    $redis->setString('wechattemplistener', json_encode($data, JSON_UNESCAPED_UNICODE), 120);
    $wehcat = $this->container->get('my.Wechat');
    $prev = array(
      "touser" => $this->fromUsername,
      "mpnews" => array(
         "media_id" => $temp['mediaid'],
       ),
      "msgtype" => "mpnews",
    );
    $wehcat->sendTagPreviewMsg($prev);
    return $this->sendMsgForText(
      $this->fromUsername,
      $this->toUsername,
      time(),
      'text',
      "pls confirm this news preview \n if you make true \n pls within 80s feedback code <a href='#'>".$tempid."</a> \n to send this news to group [{$temp['groupname']}]"
    );
  }

  public function tagnewssendTempevent($temp){
    $redis = $this->container->get('my.RedisLogic');
    if($temp['fromopenid'] == $this->fromUsername){
      $wehcat = $this->container->get('my.Wechat');
      $data = array(
        "filter" => array(
          "is_to_all" => false,
          "tag_id" => $temp['grouptagid'],
        ),
        "mpnews" => array(
          "media_id" => $temp['mediaid']
        ),
        "msgtype" => "mpnews"
      );
      $result = $wehcat->sendTagMsg(json_encode($data, JSON_UNESCAPED_UNICODE));
      $dataSql = $this->container->get('my.dataSql');
      $dataSql->tempEventLog($this->fromUsername, $temp['tempid'],'sendTagMsg',json_encode($result));
      $redis->delkey('wechattemplistener');
      return $this->sendMsgForText(
        $this->fromUsername,
        $this->toUsername,
        time(),
        'text',
        "your send a news to group [{$temp['groupname']}]"
      );
    }
    return '';
  }



}
