DROP TABLE IF EXISTS `user_premission`;
CREATE TABLE `user_premission` (
  `uid` int(11) NOT NULL,
  `premission` varchar(50) NOT NULL,
  KEY `wechat_admin_id` (`uid`),
  CONSTRAINT `wechat_admin_id` FOREIGN KEY (`uid`) REFERENCES `wechat_admin` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
