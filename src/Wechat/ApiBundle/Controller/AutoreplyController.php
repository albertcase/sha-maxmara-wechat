<?php

namespace Wechat\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

class AutoreplyController extends Controller
{
  public function autoreplyAction(){
    $sql = $this->container->get('form.autoreply');
    $data = $sql->DoData();
    return new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
  }

  public function autoreplyinfoAction(){
    $sql = $this->container->get('form.autoreplyload');
    $data = $sql->DoData();
    return new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
  }

  public function autoreplydelAction(){
    $sql = $this->container->get('form.autoreplydel');
    $data = $sql->DoData();
    return new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
  }
}
