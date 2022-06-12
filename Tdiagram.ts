//Implementacion de los diagramas de Tombstone como grafos. Se utiliza el map nativo de typescript.
//Se implementan los grafos como listas de listas y se agregan elementos al grafo con ayuda de la funcion del objeto Map
//que aloja los valores en numero de cada uno de los lenguajes.
//Cada vertice del grafo es un lenguaje de programacion y los arcos del grafo dirigido son las relaciones de traductor o interprete que
//tienen entre cada lenguaje.

class Grafo {
  grafo : Array<Array<Traductor>> = new Array();
  mapping = new Map<string, number>();
  programas : Array<[string,string]> = new Array();
  visitados : Array<string> = new Array();
  
  constructor() {
	  this.grafo.push(new Array());
	  this.mapping.set("LOCAL",0);
  }

  tieneTupla(x : string, y : string) : Boolean { //La funcion tieneTupla verifica si se ha cargado el programa x del lenguaje y 
    var out = false;
    for (let i = 0; i < this.programas.length; i++){
      if (this.programas[i][0]==x && this.programas[i][1]==y){
        out = true;
        break;
      }
    }
    return out;
  }
  
  definir(tipo : string,...args: string[]) { //La funcion definir maneja las entradas del usuario y puede recibir variados argumentos
    if (tipo == "PROGRAMA" && args.length == 2){
		if (this.tieneTupla(args[0],args[1]) == false){
			this.programas.push([args[0],args[1]]); //Si el programa no se encuentra en el array se anade
			console.log(`Se definió el programa '${args[0]}', ejecutable en '${args[1]}'`);
		}
		else{
			console.log("El programa ya ha sido definido");
		}
	}  //Si la entrada son Interpretes o Traductores se crean los arcos del grafo
	else if (tipo == "INTERPRETE" && args.length == 2){ //args[0]  es el lenguaje base y args[1] el lneguaje
		this.crearArco(args,"INTERPRETE");
		console.log(`Se definió un intérprete para '${args[1]}', escrito en '${args[0]}'`);
	}
	else if (tipo == "TRADUCTOR" && args.length == 3){ //args[0]  es el lenguaje base, args[1] el lneguaje origen, args[2] destino
		this.crearArco(args,"TRADUCTOR");
		console.log(`Se definió un traductor de '${args[1]}' hacia '${args[2]}', escrito en '${args[0]}'`);
	}
  }
  
  crearArco(args : Array<string>, tipo : string){
	if (this.mapping.get(args[0]) != undefined){
		var valorSalida = this.mapping.get(args[0]) ?? 0;
		var valorLlegada = 0;
		if (this.mapping.get(args[1]) != undefined){ //Si se ha definido el lenguaje anteriormente se debe buscar en el objeto Map
			valorLlegada = this.mapping.get(args[1]) ?? 0;  
		}
		else{   //Si no se ha definido se crea y se le da un valor, agregando una nueva lista al grafo que representa dicho lenguaje
			this.mapping.set(args[1],this.grafo.length);
			valorLlegada = this.grafo.length;
			this.grafo.push(new Array());
		}
		var escrito : string;
		if (tipo == "INTERPRETE"){
			escrito = args[1];
		}
		else{
			escrito = args[2];    //Si es un interprete, se considera como un traductor pero que ademas de llegar al lenguaje B
		}                         //Tambien esta escrito en el lenguaje B
		this.grafo[valorSalida].push(new Traductor(tipo,valorSalida,valorLlegada,escrito, args[0],args[1]));
		}
	else{ //Lo mismo que el caso anterior pero con los casos contrarios
		this.mapping.set(args[0],this.grafo.length);
		var valorSalida = this.grafo.length;
		this.grafo.push(new Array());
		var valorLlegada = 0;
		if (this.mapping.get(args[1]) != undefined){
			valorLlegada = this.mapping.get(args[1]) ?? 0;
		}
		else{
			this.mapping.set(args[1],this.grafo.length);
			valorLlegada = this.grafo.length;
			this.grafo.push(new Array());
		}
		var escritoL : string;
		if (tipo == "INTERPRETE"){
			escritoL = args[1];
		}
		else{
			escritoL = args[2];
		}
		this.grafo[valorSalida].push(new Traductor(tipo,valorSalida,valorLlegada,escritoL,args[0],args[1]));
		}
	}

  encontrarTupla(nombre : string) : [string,string] { //La funcion encontrarTupla retorna una tupla [programa,lenguaje] dado un nombre de un programa
    var out : [string,string]= ["",""];
    for (let i = 0; i < this.programas.length; i++){
      if (this.programas[i][0]==nombre){
        out = this.programas[i];
        break;
      }
    }
    return out;
  }
  
  ejecutable(nombre : string){
	//La funcion ejecutable verifica que el nombre del programa este guardado y si lo esta corre el algoritmo de DFS para visitar todos
	//los nodos, una vez realizado el DFS se obtiene un array con los padres de cada nodo. Se realiza un algoritmo para verificar que 
	//el nodo del lenguaje LOCAL sea padre del lenguaje que deseamos, si no lo es, no se puede ejecutar el programa.
	var lenguaje = this.encontrarTupla(nombre);
	if (lenguaje[0] == "" && lenguaje[1] == ""){
	    console.log("El programa no se encuentra definido.");
	}
	else{
	    var padres = this.DFS(); 
	    var g = this.verificarDFS(padres,lenguaje[1]);
	    if (g == true || lenguaje[1] == "LOCAL"){
	        console.log(`Si, es posible ejecutar el programa '${lenguaje[0]}'`);
	    }
	    else{
	        console.log(`No es posible ejecutar el programa '${lenguaje[0]}'`);
	    }
	}
  }
  
  verificarDFS(padres : Array<number>, lenguaje : string) : Boolean {
	  //La funcion verificarDFS corre un algoritmo sobre los padres obtenidos por medio de DFS y observa si LOCAL es o no
	  //padre del lenguaje deseado.
      var pos : number = this.mapping.get(lenguaje) ?? -1;
      var notdone = true;
      var p = padres[pos];
      while (p != -1 && p!=0){
          p = padres[p]; //Se busca en el arreglo de padres, hasta que es el nodo de LOCAL o cualquier otro (-1)
      }
      var salida=false;
      if (p == 0){
          //su padre es el LOCAL
          salida = true
      }
      else{
          salida = false;
      }
      return salida;
  }
  
  DFS() : Array<number>{
	//La funcion DFS ejecuta el algoritmo DFS sobre el grafo del diagrama de Tombstone. 
	var vertices = new Array<number>(this.grafo.length);
	var estado = new Array<number>(this.grafo.length);
	var padre = new Array<number>(this.grafo.length);
	for (let i = 0; i < this.grafo.length; i++){
		vertices[i] = i;
		estado[i] = 0;
		padre[i] = -1;
	}
	var tiempo = 0;
	for (let i = 0; i < this.grafo.length; i++){
		if (estado[i] == 0){
			var salida = this.DFS_Visitar(i,tiempo,estado,padre);
			tiempo = salida[0];
			estado = salida[1];
			padre = salida[2];
		}
	}
	return padre;
  }
  DFS_Visitar(nodo : number, tiempo : number, estado: Array<number>, padre: Array<number>) : [number,Array<number>,Array<number>] {
	//La funcion DFS_Visitar permite realizar la recursion de DFS y es llamada por todos los nodos del grafo hasta que hayan sido 
	//visitados todos.
	estado[nodo] = 1;
	tiempo = tiempo + 1;
    var arcos : Array<Traductor> = this.adyacente(nodo);
	for (let i = 0; i < arcos.length; i++){
        var arco = arcos[i];
		if (estado[arco.salida] == 0){
			padre[arco.salida] = nodo;
			var salida = this.DFS_Visitar(arco.salida,tiempo,estado,padre);
            tiempo = salida[0];
            estado = salida[1];
            padre = salida[2];
		}
	}
	estado[nodo] = 2;
	tiempo = tiempo + 1;
	return [tiempo,estado,padre];
  }
  adyacente(nodo : number) : Array<Traductor> {
	//La funcion adyacente retorna los adyacente al nodo, que son los lados que se encuentran en su posicion dentro de la estructura
	//del grafo
	return this.grafo[nodo]; 
  }
  
}
//Los arcos del grafo son del tipo Traductor. Con esta estructura se alojan los valores del tipo de arco, valor en numeros del lenguaje
//dado por el objeto Map. Ademas se guardan los nombres de entrada y salida de los lenguajes y en cual lenguaje se ha escrito el traductor.
//En caso de los interpretes, el lenguaje de salida es el mismo en el que esta escrito, para la inicializacion de esta estructura.
class Traductor {
  operacion : String;
  entrada : number;
  salida : number;
  nombreEntrada : string;
  nombreSalida : string;
  escritoEn : string;
  constructor(op : String , e : number, s: number, escrito : string, ne : string, ns: string) {
	  this.operacion = op;
	  this.entrada = e;
      this.salida = s;
      this.nombreEntrada = ne;
      this.nombreSalida = ns;
      this.escritoEn = escrito;
  }
}
//La clase diagramaTombstone maneja las entradas del usuario, con esta clase se verifican las entradas y dentro de esta clase se
//genera una instancia de Grafo que implementa el algoritmo deseado.
class diagramaTombstone { 
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  grafo = new Grafo();
    recibirInput(){
    this.readline.question('', (entrada:string) => {
    var re = /DEFINIR/gi;
    var re1 = /EJECUTABLE/gi;
    if (entrada == " " || entrada == ""){
      this.recibirInput();
    }
    if (entrada == "SALIR"){
    	this.readline.input.destroy();
    }
    if (entrada.search(re) == 0){               //Para cada uno de los inputs se compara la entrada con una expresion regular,
      var separado = entrada.split(" ");        //Luego si la cumple, se separa por los espacios y se utilizan las entradas en un array
      var args = (separado.slice(2,separado.length));  //Dependiendo del caso deseado.
      if (args.length == 2){
        this.grafo.definir(separado[1],args[0],args[1]);
      }
      else if (args.length == 3){
        this.grafo.definir(separado[1],args[0],args[1],args[2]);
      }
      if (args.length != 2 && args.length != 3){
        console.log("Error: Los nombres introducidos no son correctos.");
      }
      this.recibirInput();
    }
    if (entrada.search(re1) == 0){
      var separacion = entrada.split(" ");
      this.grafo.ejecutable(separacion[1]);
      this.recibirInput();
    }
    if (entrada != "SALIR" && entrada.search(re) != 0 && entrada.search(re1) != 0){
		this.recibirInput();
	}
    });
  }
}
var d = new diagramaTombstone();
d.recibirInput();
