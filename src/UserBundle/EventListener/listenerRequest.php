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

    public function __construct(Request $request ,$container){
	      $this->request = $request;
        $this->container = $container;
    }

    public function onKernelRequest(GetResponseEvent $event){
    	$this->router = $event->getRequest()->get('_route');
      // print_r($this->router);
    	// if($this->router == 'user_page_preference'){
      //   $Session = new Session();wechat_page_menu
      //   if($Session->has($this->container->getParameter('session_login'))){
      // return $event->setResponse(new Response(json_encode("aaaaaaaaa", JSON_UNESCAPED_UNICODE)));
          // return $event->setResponse(new RedirectResponse($this->container->get('router')->generate('user_page_login' ,array())));
      //   }
    	// }
    }

}
