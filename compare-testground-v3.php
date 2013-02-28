<!DOCTYPE html>
<html>
	<head>
		<title>comparison</title>
		<style type="text/css" media="screen">
			.results {
				border:5px solid black;
				padding:20px;
			}
			body {
				padding:20px;
			}
		</style>
	</head>
	<body>

<div class="results">	
<h1>comparison results</h1>
<?php
	
	function get_file($url) {
		//curl wrapper

		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_VERBOSE, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$result = curl_exec($ch);
		$response_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$mime_type = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
		//$file_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL); 	//for testing only
		//echo("<p>{$file_url} {$mime_type} \r\n</p>");				//for testing only					
		curl_close($ch);

		//if its 404 or if it's a damn web page... barrons - go figure...
		if($response_code == '404' || $mime_type == "text/html; charset=iso-8859-1") {
			return FALSE;
		} else {
			return $result;			
		}
	}
	
	//check for wsjdmobile style source/destination types
	if(isset($_GET['source']) && preg_match("/", $_GET['source']) && isset($_GET['comparison']) && preg_match("/", $_GET['comparison'])) {
	
		$source_data = explode('/',$_GET['source']);
		$comparison_data = explode('/',$_GET['comparison']);
		
		$source_edition = $source_data[0];
		$source = $source_data[1];
		
		$comparison_edition = $comparison_data[0];
		$comparison = $comparison_data[1];
		
		//hack for incorrect folder capitalization
		if($source_edition == 'asia') {
			$cased_source_edition = 'Asia';
		} elseif($source_edition == 'europe') {
			$cased_source_edition = 'Europe';
		} else {
			$cased_source_edition = $source_edition;
		}
		
		if(isset($_GET['product']) && ($_GET['product'] == 'wsjandroid')) {
			$base_lists[] = "/var/www/html/WSJDMobile/androidConfig/trunk/workbench/package/templates/"; 					//where to get the list of files to look for
			$base_sources[] = "http://online.wsj.com/mobileConfig/wsjandroid/$source_edition/1/$source/"; 			//first folder to compaer
			$base_comparisons[] = "http://online.wsj.com/mobileConfig/wsjandroid/$comparison_edition/1/$comparison/"; //second folder to compare		

			$base_lists[] = "/var/www/html/WSJDMobile/androidConfig/trunk/workbench/package/modules/"; 					//where to get the list of files to look for
			$base_sources[] = "http://online.wsj.com/mobileConfig/wsjandroid/$source_edition/1/$source/"; 			//first folder to compaer
			$base_comparisons[] = "http://online.wsj.com/mobileConfig/wsjandroid/$comparison_edition/1/$comparison/"; //second folder to compare

		} elseif(isset($_GET['product']) && ($_GET['product'] == 'barrons')) {
			$base_lists[] = "/var/www/html/WSJDMobile/barronsConfig/trunk/$cased_source_edition"; 					//where to get the list of files to look for
			$base_sources[] = "http://online.wsj.com/mobileConfig/barrons/$source_edition/1/$source/"; 			//first folder to compaer
			$base_comparisons[] = "http://online.wsj.com/mobileConfig/barrons/$comparison_edition/1/$comparison/"; //second folder to compare		

		} else {
			$base_lists[] = "/var/www/html/WSJDMobile/designConfig/trunk/$cased_source_edition"; 					//where to get the list of files to look for
			$base_sources[] = "http://online.wsj.com/mobileConfig/wsj/$source_edition/1/$source/"; 			//first folder to compaer
			$base_comparisons[] = "http://online.wsj.com/mobileConfig/wsj/$comparison_edition/1/$comparison/"; //second folder to compare		
		}
		
	//check if its wsj.com or barrons.com we're concerned with ($_GET['product'] == 'bolimages' || $_GET['product'] == 'bolcss' || $_GET['product'] == 'wsjimages' || $_GET['product'] == 'wsjcss')	
	} elseif(isset($_GET['source']) && isset($_GET['comparison']) && (in_array($_GET['product'],array("bolimages","bolcss","wsjimages","wsjcss")))) {
	
		if($_GET['source'] == 'fdev') { 
			$source = 'f.dev';
		} elseif($_GET['source'] == 'qa') { 
			$source = 's.dev';
		} elseif($_GET['source'] == 'prod') { 
			$source = 'online';
		} else { 
			exit("Invalid source.  Next time come correct...");
		}
		
		if($_GET['comparison'] == 'fdev') { 
			$comparison = 'f.dev';
		} elseif($_GET['comparison'] == 'qa') { 
			$comparison = 's.dev';
		} elseif($_GET['comparison'] == 'prod') { 
			$comparison = 'online';
		} else { 
			exit("Invalid comparison target.  Next time lets compare it to something real eh?"); 
		}
		
		$productodestructo = $_GET['product'];
		
		switch($productodestructo) {
		
		case "wsjcss":
			$base_lists[] = "/var/www/html/svn/trunk/dev/build/css"; 						//where to get the list of files to look for
			$base_sources[] = "http://{$source}.wsj.com/css/cssDependencies/"; 				//first folder to compare
			$base_comparisons[] = "http://{$comparison}.wsj.com/css/cssDependencies/"; 		//second folder to compare
		break;
		
		case "wsjimages":
			$base_lists[] = "/var/www/html/svn/trunk/dev/build/img"; 		//where to get the list of files to look for
			$base_sources[] = "http://{$source}.wsj.com/img/"; 				//first folder to compare
			$base_comparisons[] = "http://{$comparison}.wsj.com/img/"; 		//second folder to compare
		break;
		
		case "bolcss":
			$base_lists[] = "/var/www/html/WSJDBOL/trunk/dev/build/css"; 							//where to get the list of files to look for
			$base_sources[] = "http://{$source}.barrons.com/css/barronsDependencies/"; 				//first folder to compare
			$base_comparisons[] = "http://{$comparison}.barrons.com/css/barronsDependencies/"; 		//second folder to compare
		break;
		
		case "bolimages":
			$base_lists[] = "/var/www/html/WSJDBOL/trunk/dev/build/img"; 				//where to get the list of files to look for
			$base_sources[] = "http://{$source}.barrons.com/img/barrons/"; 				//first folder to compare
			$base_comparisons[] = "http://{$comparison}.barrons.com/img/barrons/"; 		//second folder to compare
		break;
		
		default:
			echo('Invalid product choice... MAINSITE go fix it will ya?');
		break;
			
		}
		
	//check if its mobileconfig we're looking at...	
	} elseif(isset($_GET['source']) && isset($_GET['comparison']) && ($_GET['product'] == 'mobileconfig')) {
	
		if($_GET['source'] == 'fdev') { 
			$source = 'fdev';
		} elseif($_GET['source'] == 'qa') { 
			$source = 'qa';
		} elseif($_GET['source'] == 'prod') { 
			$source = 'prod';
		} else { 
			exit("Invalid source.  Next time come correct...");
		}
		
		if($_GET['comparison'] == 'fdev') { 
			$comparison = 'fdev';
		} elseif($_GET['comparison'] == 'qa') { 
			$comparison = 'qa';
		} elseif($_GET['comparison'] == 'prod') { 
			$comparison = 'prod';
		} else { 
			exit("Invalid comparison target.  Next time lets compare it to something real eh?"); 
		}
		
		$mobileprodukt = $_GET['product'];
		
		switch($mobileprodukt) {
		
		case "mobileconfig":
			$base_lists[] = "/var/www/html/wsj-ipad-app"; 						//where to get the list of files to look for
			$base_sources[] = "http://online.wsj.com/mobileConfig/wsj/3/{$source}/"; 				//first folder to compare
			$base_comparisons[] = "http://online.wsj.com/mobileConfig/wsj/3/{$comparison}/"; 		//second folder to compare
		break;
				
		default:
			echo('Invalid product choice... for mobile config.');
		break;
			
		}	
			
	} else {
		$base_lists[] = '/var/www/html/wsj-ipad-app'; 			//where to get the list of files to look for
		$base_sources[] = 'http://online.wsj.com/mobileConfig/wsj/us/3/qa/'; 		//first folder to compaer
		$base_comparisons[] = 'http://online.wsj.com/mobileConfig/wsj/us/3/prod/'; 	//second folder to compare		
	}
	
	//list of filetype extensions to look for
	switch($productodestructo) {
		case "wsjcss":
		case "bolcss":
			$valid_extensions = array('.css');
		break;
		
		case "wsjimgaes":
		case "bolimages":
			$valid_extensions = array('.gif', '.png', '.jpg');
		break;
		
		default:
			$valid_extensions = array('.xml', '.png');
		break;
	}
	
	//list of filetype extensions to look for - mobileproduct
	if($mobileprodukt == "mobileconfig") {
		$valid_extensions = array('.plist', '.xml', '.ejs', '.jpg', '.png');
	}
	
	$wrongs = array();
	$missings = array();
	$file_lists = array();
	

	for($i=0; $i<count($base_lists); $i++) {
		
		$base_list = $base_lists[$i];
		$base_source = $base_sources[$i];
		$base_comparison = $base_comparisons[$i];
		
		if ($handle = opendir($base_list)) {
		    while (false !== ($file = readdir($handle))) {
		        if ($file != "." && $file != "..") {


					//construct file paths to look for
					$source = $base_source . $file;
					$comparison = $base_comparison . $file;
					$file_lists[$i][] = $file;
				
					//get the two relevant files
					if(($source_file = get_file($source)) && ($comparison_file = get_file($comparison))) {	
					
						//md5 compare the two files
						if(md5($source_file) != md5($comparison_file)) {
							foreach($valid_extensions as $extension) {
								if(strstr($file, $extension)) {
									//if the two files are different, and the filetype is valid, mark this file as wrong
									$wrongs[$i][] = $file;
								}
							}
						}
					} else {
						//file is missing
						foreach($valid_extensions as $extension) {
							if(strstr($file, $extension)) {
								//if the two files are different, and the filetype is valid, mark this file as wrong
								$missings[$i][] = $file;
							}
						}					
					}						
		        }
		    }
		    closedir($handle);
		}
	}
	
	for($i=0; $i<count($base_lists); $i++) {
		$base_list = $base_lists[$i];
		$base_source = $base_sources[$i];
		$base_comparison = $base_comparisons[$i];
		$file_list = $file_lists[$i];
		if(isset($wrongs[$i])) {
		$wrong = $wrongs[$i];
		} else {
			$wrong = array();
		}
		if(isset($missings[$i])){
		$missing = $missings[$i];
		} else {
			$missing = array();
		}
		
		if($i > 0) {
			echo "<hr />";
		}	
		
			
		echo "comparing: <br />$base_source<br />$base_comparison <br /><br />";
		echo "base file list:<br />$base_list<br /><br />";

		$missing_count = count($missing);
		echo "number of missing files: $missing_count <br />";
		$missing_csv = implode(',',$missing);
		echo $missing_csv . "<br /><br />";

		$wrong_count = count($wrong);
		echo "number of different files: $wrong_count <br />";
		$wrong_csv = implode(',',$wrong);
		echo $wrong_csv. "<br /><br />";
	
	}

?>
	</div>
	
	<h2>Options</h2>
	<h3>Editions (not currently applicable to WSJ.com/Barrons.com)</h3>
	<ul>
		<li>us</li>
		<li>asia</li>
		<li>europe</li>
	</ul>
	<h3>Environments</h3>
	<ul>
		<li>dev</li>
		<li>qa</li>
		<li>prod</li>
	</ul>
	<h3>Products</h3>
	<ul>
		<li>wsjmobile [default/mobile]</li>
		<li>wsjandroid [mobile]</li>
		<li>barrons [mobile]</li>
		<li>wsjcss [wsj.com]</li>
		<li>wsjimages [wsj.com]</li>
		<li>bolcss [barrons.com]</li>
		<li>bolimages [barrons.com]</li>
	</ul>	
	<h3>Verbosity</h3>
	<ul>
		<li>true</li>
		<li>false</li>
	</ul>
	
	<h2>Syntax Examples</h2>
	<code>
		<h4>Mobile examples</h4>
		<ul>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/qa">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/qa</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/qa&comparison=us/prod">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/qa&comparison=us/prod</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=europe/dev&comparison=europe/qa">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=europe/dev&comparison=europe/qa</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=europe/dev&comparison=europe/qa&verbosity=true">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=europe/dev&comparison=europe/qa&verbosity=true</a></li>	
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/prod&product=wsjandroid">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/prod&product=wsjandroid</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/prod&product=barrons">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare.php?source=us/dev&comparison=us/prod&product=barrons</a></li>							
		</ul>
		<h4>Mainsite examples</h4>
		<ul>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=fdev&comparison=qa&product=wsjcss">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=fdev&comparison=qa&product=wsjcss</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=qa&comparison=prod&product=wsjimages">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=qa&comparison=prod&product=wsjimages</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=fdev&comparison=qa&product=bolcss">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=fdev&comparison=qa&product=bolcss</a></li>
			<li><a href="http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=qa&comparison=prod&product=bolimages">http://wsjdesign.dowjones.net/WSJDMobile/utilities/compare-testground.php?source=qa&comparison=prod&product=bolimages</a></li>
		</ul>
	</code>
	
	
<?php
	if(isset($_GET['verbosity']) && ($_GET['verbosity'] == 'true')) {
		echo "<hr />Verbose Output<hr />";
		
		for($i=0; $i<count($base_lists); $i++) {
			echo "files to compare:<br />";
			foreach($file_lists[$i] as $file) {
				foreach($valid_extensions as $extension) {
					if(strstr($file, $extension)) {
						echo "<a href=\"$base_sources[$i]$file\">$base_sources[$i]$file</a><br />";
						echo "<a href=\"$base_comparisons[$i]$file\">$base_comparisons[$i]$file</a><br /><br />";
					}
				}
			}
		}
	}

?>
	</body>
</html>