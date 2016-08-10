<?php

namespace Wechat\ApiBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\Session;

class DefaultController extends Controller
{
    public function indexAction($name)
    {
        return $this->render('WechatApiBundle:Default:index.html.twig', array('name' => $name));
    }

    public function wechatAction()
    {
      $wechatObj = $this->container->get('my.Wechat');
      if(isset($_GET["echostr"])){
      return new Response($wechatObj->valid($_GET["echostr"]));
      }
      $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
      $respose = new Response($wechatObj->responseMsg($postStr));
      return $respose->send();
    }

    public function uploadstoreAction()
    {
      $form = $this->container->get('form.uploadstore');
      $data = $form->DoData();
      return new Response(json_encode($data, JSON_UNESCAPED_UNICODE));
    }

    public function api1Action(Request $request)
    {

      // print_r($request->query->all());
      // hasParameter
      // $papis = array();
      // $bundles = $this->container->getParameter('bundles');
      // foreach ($bundles as $x) {
      //   if($this->container->hasParameter($x.'_papis'))
      //     $papis = array_merge($papis ,$this->container->getParameter($x.'_papis'));
      // }
      $url = $request->get("urll");
      print $url;
      print_r($this->container->get('request_stack')->getCurrentRequest()->getSchemeAndHttpHost());
      return new Response("\n123456789");
    }
}
