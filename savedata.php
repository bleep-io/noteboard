<?php
$data = $_POST['data'];
file_put_contents("savetest.txt", $data);
?>