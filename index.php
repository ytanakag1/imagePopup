<?php
/*
  Plugin Name: imagePopup DX
  Plugin URI: https://ultimai.org/
  Description: 投稿した画像をポップアップ表示しドラック移動と拡大を可能にするプラグイン
  Author: john ranbo
	Version: 3.3
  */
  
 class ImagesPopUP{
	  public static $cpath  ; // /var/www/ad.zapto/wp-content/plugins/imagepopup"
    public static $cdir;  //yyk-forms
		public static $curl;

    public function __construct(){
      self::$cpath  =  dirname( __FILE__ ) ;
      self::$cdir =  dirname( plugin_basename( __FILE__ ) ) ;
      self::$curl = plugin_dir_url( dirname( __FILE__ ) ) . self::$cdir;

      add_action('wp_enqueue_scripts', function(){
       
      });
      
      // close body to show   
      add_action( 'wp_footer', function(){
        // wp_enqueue_script('jquery', '//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js'); 
        wp_enqueue_script('ui', self::$curl.'/js/jquery-ui.min.js' ); 
        wp_enqueue_script('mouse', self::$curl.'/js/jquery.mousewheel.min.js' ); 
        wp_enqueue_script('popup', self::$curl.'/js/jquery.imagePopup.js' ); 
        
      } );
      
      add_action( 'wp_footer', function(){
        echo "<script> //asdf222
        jQuery(function($){
          $(document).ready(function(){

            $('.entry-content a').click(function(e){
              e.preventDefault();
                $(function(){
                  $('.entry-content a').imagePopup();
                });
              });
          });
          });
        </script>";
      });
      
    } // end construct
 }

   new ImagesPopUP();