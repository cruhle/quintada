function filter_textarea(os_dados) {
  
	var TS = "";
	var STR_SQL = "";
	var msg = "";	
	
	var linhas = os_dados.split("\n");
			
	for(var i=0;i<linhas.length;i++) {
		msg = linhas[i];
		msg.trim();
		if(msg.length>1) {
			if(msg.match(/.+ERROR.+INVBR_CREATE=(.+?) and/)) {
				TS = (msg.match(/.+ERROR.+INVBR_CREATE=(.+?) and/))[1];
				STR_SQL = `UPDATE TBCLIDOC SET MAIL = 'gtrt@tap.pt' WHERE INVBR_CREATE = TO_TIMESTAMP('${TS}', 'YYYY-MM-DD HH24.MI.SS.FF9');`;
				document.formulario.output.value += STR_SQL;
				document.formulario.output.value += "\n";
			}
		}
	}
	document.formulario.output.disabled=false;
	
	var copyTest = document.getElementById("output_text");
	copyTest.select();
	document.execCommand("copy");		
	
	document.getElementById("explanation").innerHTML="Select statement(s) copied to the clipboard (CTRL+V).";	
	
}

function clear_fields() {
	document.getElementById("explanation").innerHTML="SQL update statments to execute (CTRL+A -> CTRL+C).";
	document.formulario.output.disabled=true
}
