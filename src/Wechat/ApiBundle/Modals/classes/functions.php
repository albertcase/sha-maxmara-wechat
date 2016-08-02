<?php

namespace Wechat\ApiBundle\Modals\classes;

use Wechat\ApiBundle\Modals\classes\WechatResponse;

class functions{

  private $_container;

  public function __construct($container){
    $this->_container = $container;
  }

  public function getmenus(){
    $dataSql = $this->_container->get('my.dataSql');
    $menus = $dataSql->getmenusDb();
    $main = array();
    foreach($menus as $x => $x_val){
      if($x_val['subOrder'] == '0'){
        $menus[$x]['belongto'] = 'Main Menu';
        $main[$x_val['mOrder']] = $x_val['menuName'];
      }
    }
    foreach($menus as $x => $x_val){
      if($x_val['subOrder'] != '0'){
        $menus[$x]['belongto'] = $main[$x_val['mOrder']];
      }
    }
    return $menus;
  }

  public function getmmenu(){
    $dataSql = $this->_container->get('my.dataSql');
    $menus = $dataSql->getmenusDb();
    $main = array();
    foreach($menus as $x => $x_val){
      if($x_val['subOrder'] == '0'){
        $main[$x_val['mOrder']] = $x_val['menuName'];
      }
    }
    return $main;
  }
}
