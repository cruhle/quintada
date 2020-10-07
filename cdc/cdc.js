/*

function checkForm()  {

	if(document.getElementById("subscription").value == "") { return false; }
	if(document.getElementById("source_id").value == "") { return false; }	
	if(document.getElementById("source_schema").value == "") { return false; }
	if(document.getElementById("target_schema").value == "") { return false; }
	if(document.getElementById("source_database").value == "") { return false; }
	if(document.getElementById("target_database").value == "") { return false; }
	if(document.getElementById("input_text").value == "") { return false; }
	
	// validation was successful
	return true;
	
}

*/

function process_form(dados) {						
	
	let pedido = {
			subscri: dados.subscription.value.toUpperCase(),
			src_id: dados.source_id.value.toUpperCase(),
			src_sch: dados.source_schema.value.toUpperCase(),
			trg_sch: dados.target_schema.value.toUpperCase(),
			src_db: dados.source_database.value.toUpperCase(),
			trg_db: dados.target_database.value.toUpperCase(),
			tabelas: dados.input_text.value.toUpperCase()
	};
	
	let STR_SQL = "";
	let msg = "";	
		
	let linhas = pedido.tabelas.split(";");
			
	document.formulario.output.value = add_header(pedido);
	
	for(var i=0;i<linhas.length;i++) {
		msg = linhas[i];		
		msg = msg.replace(/(\r\n|\n|\r)/gm,"");		
		STR_SQL = add_table(pedido.src_sch, pedido.trg_sch, msg);
		document.formulario.output.value += STR_SQL;
		document.formulario.output.value += "\n";
	}
	
	document.formulario.output.value += add_footer(pedido);
	
	document.formulario.output.disabled=false;
	
	let copyTest = document.getElementById("output_text");
	copyTest.select();
	document.execCommand("copy");		
	
	document.getElementById("explanation").innerHTML="Script copied to the clipboard, just do (CTRL+V).";	
	
}

function add_table(src_sch, trg_sch, tabela) {
	
	return ( `	
	add table mapping  
		sourceSchema ${src_sch} sourceTable ${tabela}  
		targetSchema ${trg_sch} targetTable ${tabela}  
		type standard method refresh;
	`);
}

function clear_fields() {
	document.getElementById("explanation").innerHTML="Script statements to execute (CTRL+A -> CTRL+C).";
	document.formulario.output.disabled=true
}

function add_header(param) {
	
	return (`
	CHCCLP session set to cdc;

	set variable name username value <<<INSERIR-USERNAME>>>;
	set variable name password value <<<INSERIR-PASSWORD>>>;

	set verbose;

	connect server hostname dboraprdrg6.tap.pt port 10101 username %username% password %password%;

	connect datastore name ${param.src_db} context source;
	connect datastore name ${param.trg_db} context target;

	add subscription name ${param.subscri} sourceid ${param.src_id};

	lock subscription name ${param.subscri};
	
	`);
	
}

function add_footer(param) {
	
	return (`	
	unlock subscription name ${param.subscri};

	disconnect datastore name ${param.src_db};
	disconnect datastore name ${param.trg_db};

	disconnect server;

	exit;	
	`);
	
}



