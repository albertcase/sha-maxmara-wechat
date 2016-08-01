<?php

namespace ADP\WechatBundle\Modals\Apis;
use ADP\WechatBundle\Modals\Database\dataSql;
use ADP\WechatBundle\Modals\Apis\WechatMsg;

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
    if($backxml){
      if($backxml != 'airport')
        return $backxml;
      return '';
    }
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
    $rs = $this->dataSql->textField($this->postObj->Content);
    if(is_array($rs) && count($rs)> 0 ){
      return $this->msgResponse($rs);
    }
    if(preg_match("/^[A-Za-z]{1,4}[0-9]{1,8}$/" ,trim($this->postObj->Content))){//judgement airport line
      $FlightSoapResponse = $this->container->get('my.FlightSoapResponse');
      $data = array(
        'soapevent' => 'getlatest',
        'OpenID' => $this->fromUsername,
        'ident' => trim($this->postObj->Content),
      );
      $FlightSoapResponse->addSoapJob($data);
      $FlightSoapResponse->startFlightSoap();
      return "airport";//flight number search keywords
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



}
