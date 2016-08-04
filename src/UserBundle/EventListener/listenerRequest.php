<?php
namespace UserBundle\EventListener;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\GetResponseEvent;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Session;

class listenerRequest{

    private $request;
    private $container;
    private $router;
    private $userinfo;

    public function __construct(Request $request ,$container){
	      $this->request = $request;
        $this->container = $container;
    }

    public function onKernelRequest(GetResponseEvent $event){
    	$this->router = $event->getRequest()->get('_route');
      $this->userinfo = $this->getUserinfo();
      print_r($this->router);
      if($this->userinfo["username"] != "admin"){
        $this->judgeApiPrtmission($event);
        $this->judgePagePrtmission($event);
      }
    }

    private function judgeApiPrtmission(&$event){
      if(preg_match("/.+_papi_.+/" ,trim($this->router))){
        $pers = $this->getApiPermission();
        if(array_key_exists($this->router, $pers)){
          if(!array_key_exists($pers[$this->router]['permission'], $this->userinfo['permission'])){
            $event->getRequest()->attributes->set("_controller", trim($this->container->get('router')->generate($pers[$this->router]['goto'], array())));
          }
        }
      }
    }

    private function judgePagePrtmission(&$event){
      if(preg_match("/.+_page_.+/" ,trim($this->router))){
        $pers = $this->getPagePermission();
        print_r($this->container->get('router')->generate($pers[$this->router]['goto'], array()));
        if(array_key_exists($this->router, $pers)){
          if(!array_key_exists($pers[$this->router]['permission'], $this->userinfo['permission'])){
            $event->getRequest()->attributes->set("_controller", $this->container->get('router')->generate($pers[$this->router]['goto'], array()));
          }
        }
      }
    }

    private function getUserinfo(){
      $userinfo = array(
        "username" => 'anoymous',
        "uid" => 0,
        "permission" => array()
      );
      $Session = new Session();
      if($Session->has($this->container->getParameter('session_login'))){
        $user = $Session->get($this->container->getParameter('session_login'));
        if($this->container->get('my.RedisLogic')->checkString("user:".$user)){
          return json_encode($this->container->get('my.RedisLogic')->getString("user:".$user), true);
        }
        return $userinfo;
      }
      return $userinfo;
    }

    private function getApiPermission(){
      $papis = array();
      $bundles = $this->container->getParameter('bundles');
      foreach ($bundles as $x) {
        if($this->container->hasParameter($x.'_papis'))
          $papis = array_merge($papis ,$this->container->getParameter($x.'_papis'));
      }
      return $papis;
    }

    private function getPagePermission(){
      $pages = array();
      $bundles = $this->container->getParameter('bundles');
      foreach ($bundles as $x) {
        if($this->container->hasParameter($x.'_pages'))
          $pages = array_merge($pages ,$this->container->getParameter($x.'_pages'));
      }
      return $pages;
    }

}
