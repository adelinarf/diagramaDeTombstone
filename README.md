# Pregunta 5 : Diagrama de Tombstone

Este programa ejecuta una implementación de los diagramas de Tombstone como grafos. En el archivo Tdiagram.ts se encuentra el código de la implementación y en el archivo pruebaUNIT.ts se encuentran los tests con los que se realizó el unit test.

## Detalles de la implementación
El diagrama se implementó como un grafo, en el que los nodos son los lenguajes de programación y los arcos son los traductores que indican las relaciones entre los lenguajes. El grafo se crea de manera que todos los lenguajes que puede ejecutar algún programa en la máquina son hijos del nodo LOCAL, o del lenguaje nativo de la máquina.

De esta manera, se puede aplicar un algoritmo de búsqueda en grafos cono DFS para viajar por todo el grafo en busca de los padres de cada nodo, si el padre de un lenguaje es LOCAL, se puede correr, si no lo es, no es posible. Además se creó una estructura de Traductor que funciona como arco del grafo dirigido y cuenta con información relevante como lenguaje de entrada, salida y el lenguaje en el que se escribió el traductor. En caso de los intérpretes, se considera el lenguaje de salida igual al lenguaje en el que se escribió el traductor.

## ¿Cómo correr el programa?
El programa puede correrse de manera muy sencilla mediante los comandos:

    tsc Tdiagram.ts
    node Tdiagram.js
    
Se debe tener instalado Typescript y Node.js en el computador, en su última versión.

## Unit Test y Code Coverage
Durante el unit test todas las pruebas terminaron de manera exitosa y se logró un coverage de 100%. Las pruebas fueron realizadas con typescript-coverage-report una herramienta de comandos de Node que permite realizar pruebas y verificar la cobertura del código escrito en Typescript.


<img src="coverage.jpg" alt="tests"/>

La herramienta puede conseguirse aquí: https://github.com/alexcanessa/typescript-coverage-report
