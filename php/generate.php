<?php
 error_reporting(E_ALL);
 ini_set('display_errors', 1);
if(!empty($_POST)) {
    if(isset($_POST["commentField"])) {
        $content = process_input($_POST["commentField"]);;
        $content = str_replace('~', "&#160;", $content);
        $contentArray = explode(' ', $content);

        if(sizeof($contentArray) == 100) {
            $date = new DateTime();
            $timeStamp = $date->getTimestamp();
            $error = array();
            $htmlFiles = glob(dirname(__FILE__) . "/../../template/*.html");
            $fLength = sizeof($htmlFiles);
            $writeNot = 0;
            if(empty($htmlFiles)) {
                echo json_encode(array('error' => true, 'message' => "No html files found in <code>template</code> folder"));
                exit;
            }
            $genDir = dirname(__FILE__) . "/../../generated";
            if(!is_writable($genDir)) {
                echo json_encode(array('error' => true, 'message' => "Please set write permissions (0777) for your <code>generated</code> folder"));
                exit;
            }
            foreach (glob(dirname(__FILE__) . "/../../template/*.html") as $filename) {
                $newFileName = basename($filename, ".html")."-".$timeStamp.".html";
                $newFilePath = $genDir."/".$newFileName;
                $dom = new DOMDocument;
				libxml_use_internal_errors(true);
                $dom->loadHTMLFile($filename, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
                $dom->preserveWhiteSpace = true;

                $index = 0;
                $xpath = new DOMXPath( $dom );
                $isGenerator = $xpath->query('//body[contains(@class,"generator")]');
                if($isGenerator->length <= 0) {
                    continue;
                }
                $pDivs = $xpath->query('//h1[contains(@class,"lt-main")]');
                foreach ( $pDivs as $div ) {
                    $brSplit = preg_split('/<br[^>]*>/i', innerHTML($div));
                    if(sizeof($brSplit) > 1) {
                        $div->nodeValue = "";
                        $string = '';
                        foreach($brSplit as $key => $value) {
                            if ($key == 0) {
                                $string = $contentArray[$index];
                            } else {
                                $string = $string.'<br/>'.$contentArray[$index];
                            }
                            $index = $index + 1;
                        }
                        $fragment = $dom->createDocumentFragment();
                        $fragment->appendXML($string);
                        $div->appendChild($fragment);
                    } else {
                        $spSplit = explode(' ', $div->nodeValue);
                        if(sizeof($spSplit > 1)) {
                            $div->nodeValue = "";
                            $string = '';
                            foreach($spSplit as $key => $value) {
                                if ($key == 0) {
                                    $string = $contentArray[$index];
                                } else {
                                    $string = $string.' '.$contentArray[$index];
                                }
                                $index = $index + 1;
                            }
                            $fragment = $dom->createDocumentFragment();
                            $fragment->appendXML($string);
                            $div->appendChild($fragment);
                        } else {
                            $div->nodeValue = $contentArray[$index];
                            $index = $index + 1;
                        }
                    }
                }
                try {
                    $dom->saveHTMLFile($newFilePath);
                    $error[] = "no";
                } catch (Exception $e) {
                    $error[] = "yes";
                }
            }

            if(in_array("yes", $error)) {
                echo json_encode(array('error' => true, 'message' => $e->getMessage()));
                exit;
            } else {
                echo json_encode(array('error' => false, 'message' => 'Your teaser is successfully generated. Please check your <code>generated</code> folder.'));
                exit;
            }
        } else {
            echo json_encode(array('error' => true, 'message' => 'Please enter exactly 100 words'));
            exit;
        }
    }
}

function innerHTML($node) {
    return implode(array_map(array($node->ownerDocument,"saveHTML"),
    iterator_to_array($node->childNodes)));
}

function process_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = preg_replace('!\s+!', ' ', $data);
    return $data;
}
?>
