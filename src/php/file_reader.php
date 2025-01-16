<?php 

function list_files($directory) {
  $files = array();
  if ($handle = opendir($directory)) {
    while (false !== ($file = readdir($handle))) 
      if (is_file($directory . '/' . $file)) 
        $files[] = $file;
    closedir($handle);
  }
  return $files;
}

function deleteFile($filename) {
  if (file_exists($filename)) {
      unlink($filename);
      return true;
  } else {
      return false;
  }
}
