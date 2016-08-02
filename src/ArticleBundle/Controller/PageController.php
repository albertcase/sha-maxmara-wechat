<?php

namespace ArticleBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class PageController extends Controller
{
  public function pageAction(){
    $sql = $this->container->get('my.dataSql');
    if(!$w = $sql->getArticlelist(array())){
      $w = array();
    }
    $host = $this->getRequest()->getSchemeAndHttpHost();
    return $this->render('ArticleBundle:Page:pag.html.twig', array('list' => $w, 'host' => $host));
  }

  public function articleAction($pageid = ''){
    $sql = $this->container->get('my.dataSql');
    if($w = $sql->getArticle(array('pageid' => $pageid))){
      $w = $w['0'];
      return $this->render('ArticleBundle:Page:article.html.twig', $w);
    }
    return $this->render('ArticleBundle:Default:index.html.twig', array('name' => '404'));
  }
}
