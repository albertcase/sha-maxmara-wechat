<?php

namespace Wechat\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class PageController extends Controller
{
  public function menuAction(){
    $functions = $this->container->get('my.functions');
    $menus = $functions->getmenus();
    return $this->render('WechatApiBundle:Page:menu.html.twig', array('menus' => $menus));
  }

  public function keywordAction(){
    $sql = $this->container->get('my.dataSql');
    $wordlist = $sql->getkeywordlist();
    return $this->render('WechatApiBundle:Page:keyword.html.twig', array('wordlist' => $wordlist));
  }

  public function replyAction(){
    return $this->render('WechatApiBundle:Page:replay.html.twig');
  }
}
