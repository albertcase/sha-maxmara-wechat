<?php

namespace Wechat\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class GroupnewsController extends Controller
{
  public function batchgetmaterialAction(){
    $wehcat = $this->container->get('my.Wechat');
    $data = array('code' => '9', 'msg' => 'update wechat menus error');
    $search = array(
      'type' => 'news',
      'offset' => '0',
      'count' => '10',
    );
    $check = $wehcat->getMateriallist($search);
    print_r($check);
    return  new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
  }
}