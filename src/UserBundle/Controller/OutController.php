<?php

namespace UserBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class OutController extends Controller
{
  public function logoutAction(){
    $Session = new Session();
    $Session->clear();
    return $this->redirectToRoute('user_page_login');
  }

  public function loginAction(){
    $adminadd = $this->container->get('form.adminlogin');
    $data = $adminadd->DoData();
    return new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
  }
}
