var p = require("./otro.js");

//Este es el archivo que fue utilizado para realizar el unit test, se elaboraron varios casos y se verificaron
//gracias a los padres que retorna la funcion DFS. Tambien se realizan pruebas con la funcion verificarDFS para 
//garantizar que sus resultados sean correctos. Estas funciones son las principales de todo el programa.

describe('testing index file', () => {
  test('Prueba DFS', () => {
    var grafo = new p.Grafo();
    grafo.definir("PROGRAMA","fibo","JAVA");
    grafo.definir("INTERPRETE","C","JAVA");
    grafo.definir("TRADUCTOR","C","JAVA","C");
    grafo.ejecutable("fibo");
    grafo.definir("INTERPRETE","LOCAL","C");
    grafo.ejecutable("fibo");
    grafo.definir("PROGRAMA","holamundo","PYTHON");
    grafo.definir("TRADUCTOR","lenguaje","PYTHON","LOCAL");
    grafo.ejecutable("holamundo");
    grafo.definir("TRADUCTOR","C","lenguaje","JAVA");
    grafo.ejecutable("holamundo");
    expect(grafo.DFS()).toEqual([-1,0,1,1,3]);
  });
  test('Prueba DFS 2', () => {
    var grafo = new p.Grafo();
    grafo.definir("PROGRAMA","fibo","PASCAL");
    grafo.definir("TRADUCTOR","PASCAL","PASCAL","LOCAL");
    grafo.definir("TRADUCTOR","PCODE","PASCAL","LOCAL");
    grafo.definir("INTERPRETE","LOCAL","PCODE");
    grafo.ejecutable("fibo");
    expect(grafo.DFS()).toEqual([-1,2,0]);
  });
  test('Prueba Verificar DFS 2', () => {
    var grafo = new p.Grafo();
    grafo.definir("PROGRAMA","fibo","PASCAL");
    grafo.definir("TRADUCTOR","PASCAL","PASCAL","LOCAL");
    grafo.definir("TRADUCTOR","PCODE","PASCAL","LOCAL");
    grafo.definir("INTERPRETE","LOCAL","PCODE");
    grafo.ejecutable("fibo");
    expect(grafo.verificarDFS(grafo.DFS(),"PASCAL")).toEqual(true);
  });
  test('Prueba Verificar DFS', () => {
    var grafo = new p.Grafo();
    grafo.definir("PROGRAMA","fibo","JAVA");
    grafo.definir("INTERPRETE","C","JAVA");
    grafo.definir("TRADUCTOR","C","JAVA","C");
    grafo.ejecutable("fibo");
    expect(grafo.verificarDFS(grafo.DFS(),"JAVA")).toEqual(false);
    grafo.definir("INTERPRETE","LOCAL","C");
    grafo.ejecutable("fibo");
    expect(grafo.verificarDFS(grafo.DFS(),"JAVA")).toEqual(true);
    grafo.definir("PROGRAMA","holamundo","PYTHON");
    grafo.definir("TRADUCTOR","lenguaje","PYTHON","LOCAL");
    grafo.ejecutable("holamundo");
    expect(grafo.verificarDFS(grafo.DFS(),"PYTHON")).toEqual(false);
    grafo.definir("TRADUCTOR","C","lenguaje","JAVA");
    grafo.ejecutable("holamundo");
    expect(grafo.verificarDFS(grafo.DFS(),"PYTHON")).toEqual(true);
  });

  
  
});
