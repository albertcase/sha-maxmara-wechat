<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PageController extends Controller
{
  public function indexAction(){
      return $this->render('UserBundle:Page:index.html.twig');
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
