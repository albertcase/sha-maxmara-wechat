<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class PageController extends Controller
{
  public function indexAction(){
    $Session = new Session();
    if($Session->has($this->container->getParameter('session_login'))){
      return $this->redirectToRoute('wechat_page_menu');
    }
    return $this->render('UserBundle:Page:index.html.twig');
  }

  public function nopermissionAction(){
      return $this->render('UserBundle:Page:nopermission.html.twig');
  }

  public function preferenceAction(){
    $Session = new Session();
    $admin = false;
    if($Session->get($this->container->getParameter('session_login')) == 'admin'){
      $admin = true;
      $dataSql = $this->container->get('my.dataSql');
      $list = $dataSql->getAdmins();
    }else{
      $admin = false;
      $list = array();
    }
    return $this->render('UserBundle:Page:preference.html.twig', array('admin' => $admin, 'list' => $list));
  }
}
