<?php
namespace UserBundle\Forms;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\Session\Session;
use Wechat\ApiBundle\Forms\FormRequest;

class adminlogin extends FormRequest{

  public function rule(){
    return array(
      'username' => new Assert\NotBlank(),
      'password' => new Assert\NotBlank(),
    );
  }

  public function FormName(){
    return 'adminlogin';
  }

  public function DoData(){
    if($this->Confirm()){
      return array('code' => '11' ,'msg' => 'your input error');
    }
    return $this->dealData();
  }

  public function dealData(){
    $dataSql = $this->container->get('my.dataSql');
    if($dataSql->comfirmAdmin($this->getdata)){
      $Session = new Session();
      $Session->set($this->container->getParameter('session_login'), $this->getdata['username']);
      return array('code' => '10', 'msg' => 'login success');
    }
    return array('code' => '9', 'msg' => 'password or username error');
  }

}
